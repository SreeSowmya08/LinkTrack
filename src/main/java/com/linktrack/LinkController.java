package com.linktrack;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class LinkController {

    @Autowired
    private LinkRepository linkRepository;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser(Authentication auth) {
        String email = auth.getName();
        return userRepository.findByEmail(email).orElseThrow();
    }

    @PostMapping("/shorten")
    public Link shorten(@RequestBody Link request, Authentication auth) {
        User user = getCurrentUser(auth);
        String code = UUID.randomUUID().toString().substring(0, 6);
        Link link = new Link(request.getOriginalUrl(), code);
        link.setOwner(user);
        return linkRepository.save(link);
    }

    @GetMapping("/links")
    public List<Link> getAllLinks(Authentication auth) {
        User user = getCurrentUser(auth);
        return linkRepository.findByOwner(user);
    }

    @GetMapping("/{code}")
    public ResponseEntity<Void> redirect(@PathVariable String code) {
        return linkRepository.findByShortCode(code)
                .map(link -> {
                    link.setClicks(link.getClicks() + 1);
                    linkRepository.save(link);
                    HttpHeaders headers = new HttpHeaders();
                    headers.add(HttpHeaders.LOCATION, link.getOriginalUrl());
                    return new ResponseEntity<Void>(headers, HttpStatus.FOUND);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
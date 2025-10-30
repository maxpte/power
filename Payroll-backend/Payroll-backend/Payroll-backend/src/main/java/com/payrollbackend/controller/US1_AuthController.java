package com.payrollbackend.controller;

import com.payrollbackend.config.JwtService;
import com.payrollbackend.dto.US1_LoginRequest;
import com.payrollbackend.dto.US1_LoginResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class US1_AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Autowired
    public US1_AuthController(AuthenticationManager authenticationManager, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<US1_LoginResponse> login(@RequestBody US1_LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        String username = authentication.getName();
        List<String> roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .map(auth -> auth.startsWith("ROLE_") ? auth.substring(5) : auth)
                .toList();
        String token = jwtService.generateToken(username, roles);
        return ResponseEntity.ok(new US1_LoginResponse(token, username, roles));
    }
}

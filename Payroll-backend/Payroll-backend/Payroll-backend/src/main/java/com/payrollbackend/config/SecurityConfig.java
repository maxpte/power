package com.payrollbackend.config;

import org.springframework.context.annotation.Lazy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.List;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    public SecurityConfig(@Lazy JwtAuthenticationFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000")); // frontend origin
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors
                        .configurationSource(corsConfigurationSource()) // <-- reference to your CorsConfigurationSource bean
                )
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/login").permitAll()
                        // Swagger UI and OpenAPI docs
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // OPERATOR access
                        .requestMatchers(HttpMethod.POST, "/api/batch/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/batch", "/api/batch/**").hasRole("OPERATOR")
                        // ACCOUNTS access
                        .requestMatchers("/api/accounts/**").hasAnyRole("OPERATOR", "APPROVER")
                        // ACCOUNT STATEMENT access
                        .requestMatchers("/api/account-statement/**").hasAnyRole("OPERATOR", "APPROVER")
                        // APPROVER access
                        .requestMatchers("/api/approvals/**").hasRole("APPROVER")
                        .requestMatchers("/api/batch/manage/**").hasRole("APPROVER")
                        .requestMatchers("/api/batch/approval/**").hasAnyRole("APPROVER", "OPERATOR")
                        .requestMatchers("/api/dashboard/**").hasAnyRole("OPERATOR", "APPROVER")

                        // everything else requires authentication
                        .anyRequest().authenticated()

                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    // Demo in-memory users; replace with persistent users later
    @Bean
    public UserDetailsService userDetailsService(PasswordEncoder passwordEncoder) {
        var operator = User.withUsername("operator")
                .password(passwordEncoder.encode("password"))
                .roles("OPERATOR")
                .build();
        var approver = User.withUsername("approver")
                .password(passwordEncoder.encode("password"))
                .roles("APPROVER")
                .build();
        var approver2 = User.withUsername("approver2")
                .password(passwordEncoder.encode("password"))
                .roles("APPROVER")
                .build();
        var approver3 = User.withUsername("approver3")
                .password(passwordEncoder.encode("password"))
                .roles("APPROVER")
                .build();
        return new InMemoryUserDetailsManager(operator, approver, approver2, approver3);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider(UserDetailsService userDetailsService, PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
}

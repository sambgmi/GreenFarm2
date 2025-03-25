package agroindia.agro.controller;

import agroindia.agro.dto.LoginRequest;
import agroindia.agro.dto.RegisterRequest;
import agroindia.agro.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request)
    {
        return authService.login(request);
    }

    @GetMapping("/oauth2/success")
    public ResponseEntity<?> oauth2LoginSuccess() {

        return authService.handleOAuth2Success();
    }

    @GetMapping("/oauth2/failure")
    public ResponseEntity<?> oauth2LoginFailure() {
        return ResponseEntity.badRequest()
            .body(Map.of("message", "OAuth2 login failed"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        return authService.getCurrentUser();
    }
}
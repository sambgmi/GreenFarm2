package agroindia.agro.service;

import agroindia.agro.dto.LoginRequest;
import agroindia.agro.dto.RegisterRequest;
import agroindia.agro.model.Location;
import agroindia.agro.model.User;
import agroindia.agro.model.User;
import agroindia.agro.repository.UserRepository;
import agroindia.agro.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final LocationService locationService; // Add this

    public ResponseEntity<?> register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Email already registered"));
        }

        // Get location if provided for farmer
        Location location = null;
        if (request.getLocationId() != null && request.getRole() == User.Role.FARMER) {
            location = locationService.getLocationById(request.getLocationId());
            if (!location.isActive()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Selected location is not active"));
            }
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setProvider("LOCAL");
        user.setLocation(location);
        
        userRepository.save(user);

        String token = jwtService.generateToken(user);
        
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", user);
        
        return ResponseEntity.ok(response);
    }

    public ResponseEntity<?> login(LoginRequest request)
    {

        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Invalid credentials"));
        }

        String token = jwtService.generateToken(user);
        
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", user);
        System.out.println("camefor lofign");
        return ResponseEntity.ok(response);
    }

    public ResponseEntity<?> handleOAuth2Success() {
        // Get the authenticated user from OAuth2
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByEmail(authentication.getName())
            .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtService.generateToken(user);
        
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", user);
        
        return ResponseEntity.ok(response);
    }

    public ResponseEntity<?> getCurrentUser() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByEmail(authentication.getName())
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        return ResponseEntity.ok(user);
    }
}
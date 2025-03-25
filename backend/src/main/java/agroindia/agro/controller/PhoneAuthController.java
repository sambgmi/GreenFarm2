package agroindia.agro.controller;

import agroindia.agro.service.PhoneAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/phone")
@RequiredArgsConstructor
public class PhoneAuthController {
    
    private final PhoneAuthService phoneAuthService;

    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(@RequestParam String phoneNumber) {
        phoneAuthService.sendOtp(phoneNumber);
        return ResponseEntity.ok("OTP sent successfully");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(
            @RequestParam String phoneNumber,
            @RequestParam String otp) {
        String token = phoneAuthService.verifyOtp(phoneNumber, otp);
        return ResponseEntity.ok(token);
    }
}
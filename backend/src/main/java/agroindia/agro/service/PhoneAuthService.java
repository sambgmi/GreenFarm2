package agroindia.agro.service;

import agroindia.agro.model.User;
import agroindia.agro.repository.UserRepository;
import agroindia.agro.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class PhoneAuthService {
    
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public void sendOtp(String phoneNumber) {
        String otp = generateOtp();
        User user = userRepository.findByPhoneNumber(phoneNumber)
            .orElseGet(() -> {
                User newUser = new User();
                newUser.setPhoneNumber(phoneNumber);
                return newUser;
            });
        
        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
        userRepository.save(user);
        
        System.out.println("OTP for " + phoneNumber + ": " + otp);
    }

    public String verifyOtp(String phoneNumber, String otp) {
        User user = userRepository.findByPhoneNumber(phoneNumber)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }

        if (!user.getOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        return jwtService.generateToken(user);
    }

    private String generateOtp() {
        Random random = new Random();
        return String.format("%06d", random.nextInt(1000000));
    }
}
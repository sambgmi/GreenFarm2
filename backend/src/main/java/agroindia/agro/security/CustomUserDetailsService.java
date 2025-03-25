package agroindia.agro.security;

import agroindia.agro.model.User;
import agroindia.agro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String loginField) throws UsernameNotFoundException {
        System.out.println("Attempting to load user with login field: " + loginField);
        
        try {
            // Try email first
            Optional<User> userByEmail = userRepository.findByEmail(loginField);
            if (userByEmail.isPresent()) {
                System.out.println("User found by email: " + loginField);
                return userByEmail.get();
            }
            
            // Try name if email fails
            Optional<User> userByName = userRepository.findByName(loginField);
            if (userByName.isPresent()) {
                System.out.println("User found by name: " + loginField);
                return userByName.get();
            }
            
            System.out.println("No user found with email or name: " + loginField);
            throw new UsernameNotFoundException("User not found with email or name: " + loginField);
            
        } catch (Exception e) {
            System.out.println("Error during user lookup: " + e.getMessage());
            throw new UsernameNotFoundException("Error during user lookup", e);
        }
    }
}
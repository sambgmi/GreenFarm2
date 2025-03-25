package agroindia.agro.dto;

import agroindia.agro.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterResponse {
    private String token;
    private User user;
    private String message;
    private boolean success;
    private String role;
    private String provider;
}

package agroindia.agro.service;

import agroindia.agro.model.FarmerProduct;
import agroindia.agro.model.User;
import agroindia.agro.model.User.Role;  // Update this import to use Role from User class
import agroindia.agro.repository.CartRepository;
import agroindia.agro.repository.FarmerProductRepository;
import agroindia.agro.repository.ProductRepository;
import agroindia.agro.repository.UserRepository;
import agroindia.agro.security.JwtService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final CartRepository cartRepository;
    private final FarmerProductRepository farmerProductRepository;
    private final ProductRepository productRepository;

    public List<User> getAllFarmers() {
        return userRepository.findByRole(User.Role.FARMER);  // Update to User.Role
    }

    public List<User> getAllBuyers() {
        return userRepository.findByRole(User.Role.BUYER);   // Update to User.Role
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = getUserById(userId);
        
        // Handle relationships based on user role
        if (user.getRole() == User.Role.BUYER) {
            // Delete all cart items associated with this buyer
            deleteCartItemsByBuyerId(userId);
        } else if (user.getRole() == User.Role.FARMER) {
            // For farmers, we need to handle both products and farmer products
            
            // First, delete all cart items that reference any farmer product from this farmer
            // This is the most important step to avoid foreign key constraint violations
            List<FarmerProduct> farmerProducts = farmerProductRepository.findByFarmer(user);
            for (FarmerProduct farmerProduct : farmerProducts) {
                cartRepository.deleteByFarmerProduct(farmerProduct);
            }
            
            // Now it's safe to delete farmer products
            farmerProductRepository.deleteByFarmer(user);
            
            // Finally delete all products associated with this farmer
            productRepository.deleteByFarmer(user);
        }
        
        // Now delete the user
        userRepository.deleteById(userId);
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional
    public void deleteCartItemsByBuyerId(Long buyerId) {
        cartRepository.deleteByBuyerId(buyerId);
    }
}
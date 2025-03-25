package agroindia.agro.repository;

import agroindia.agro.model.Cart;
import agroindia.agro.model.User;
import agroindia.agro.model.FarmerProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findByBuyer(User buyer);
    Optional<Cart> findByBuyerAndFarmerProduct(User buyer, FarmerProduct farmerProduct);
    
    // Add this method
    void deleteByFarmerProduct(FarmerProduct farmerProduct);
    void deleteByBuyerId(Long buyerId);
}
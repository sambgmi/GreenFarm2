package agroindia.agro.repository;


import agroindia.agro.model.Category;
import agroindia.agro.model.FarmerProduct;
import agroindia.agro.model.Product;
import agroindia.agro.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface FarmerProductRepository extends JpaRepository<FarmerProduct, Long> {
    List<FarmerProduct> findByFarmer(User farmer);
    FarmerProduct findByFarmerAndProduct_Id(User farmer, Long productId);
     
    List<FarmerProduct> findByFarmerAndProduct_Category(User farmer, Category category);
    @Query("SELECT fp FROM FarmerProduct fp JOIN FETCH fp.product p JOIN FETCH fp.farmer f")
    List<FarmerProduct> findAllWithProductAndFarmer();
    void deleteByProduct(Product product);
    @Query("SELECT fp FROM FarmerProduct fp JOIN FETCH fp.product p JOIN FETCH fp.farmer f WHERE p.id = :productId")
    List<FarmerProduct> findAllByProductIdWithFarmer(Long productId);
    
    List<FarmerProduct> findByProduct_Category(Category category);
    
    Optional<FarmerProduct> findByProduct_IdAndFarmer_IdAndBargainPrice(
            Long productId, Long farmerId, BigDecimal bargainPrice);
    
    List<FarmerProduct> findByProduct_NameContainingIgnoreCaseOrProduct_DescriptionContainingIgnoreCase(
            String name, String description);
    
    List<FarmerProduct> findByProduct(Product product);
    
    // Method to delete farmer products by farmer
    void deleteByFarmer(User farmer);
}
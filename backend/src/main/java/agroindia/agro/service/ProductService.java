package agroindia.agro.service;


import agroindia.agro.model.Category;
import agroindia.agro.model.FarmerProduct;
import agroindia.agro.model.Product;
import agroindia.agro.repository.CartRepository;
import agroindia.agro.repository.FarmerProductRepository;
import agroindia.agro.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class ProductService {
    
    private final ProductRepository productRepository;

    public Product addProduct(Product product) {


        System.out.println("hi");
        return productRepository.save(product);
        
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> getProductsByCategory(Category category) {
        return productRepository.findByCategory(category);
    }

    @Autowired
    private CartRepository cartRepository;
    
    @Autowired
    private FarmerProductRepository farmerProductRepository;

    @Transactional
    public void deleteProduct(Long productId) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));

        // First delete all cart items that reference this product's farmer products
        List<FarmerProduct> farmerProducts = farmerProductRepository.findByProduct(product);
        for (FarmerProduct fp : farmerProducts) {
            cartRepository.deleteByFarmerProduct(fp);
        }

        // Then delete all farmer products
        farmerProductRepository.deleteByProduct(product);

        // Finally delete the product
        productRepository.delete(product);
    }

    public Product updateProduct(Long productId, Product updatedProduct) {
        Product existingProduct = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));

        existingProduct.setName(updatedProduct.getName());
        existingProduct.setDescription(updatedProduct.getDescription());
        existingProduct.setPrice(updatedProduct.getPrice());
        existingProduct.setCategory(updatedProduct.getCategory());
        existingProduct.setImageUrl(updatedProduct.getImageUrl());

        return productRepository.save(existingProduct);
    }

    public List<Map<String, Object>> searchProducts(String query) {
        String searchQuery = "%" + query.toLowerCase() + "%";
        List<Product> products = productRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
            searchQuery, searchQuery);
        
        return products.stream().map(product -> {
            Map<String, Object> result = new HashMap<>();
            result.put("id", product.getId());
            result.put("name", product.getName());
            result.put("price", product.getPrice());
            result.put("imageUrl", product.getImageUrl());
            result.put("description", product.getDescription());
            result.put("category", product.getCategory());
            return result;
        }).collect(Collectors.toList());
    }

    // This method is no longer needed as deletion is handled in UserService
    // Keeping the method signature for backward compatibility
    public void deleteAllProductsByFarmerId(Long farmerId) {
        // Even though this is handled in UserService.deleteUser, we'll implement it for backward compatibility
        List<Product> farmerProducts = productRepository.findByFarmerId(farmerId);
        
        for (Product product : farmerProducts) {
            deleteProduct(product.getId());
        }
    }
}

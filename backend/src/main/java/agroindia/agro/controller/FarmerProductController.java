package agroindia.agro.controller;

import agroindia.agro.dto.FarmerProductDTO;
import agroindia.agro.model.Category;
import agroindia.agro.model.FarmerProduct;
import agroindia.agro.model.User;
import agroindia.agro.service.FarmerProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/farmer/products")
public class FarmerProductController {
    @Autowired
    private FarmerProductService farmerProductService;

    @GetMapping
    public ResponseEntity<List<FarmerProduct>> getFarmerProducts(@AuthenticationPrincipal User farmer) {
        return ResponseEntity.ok(farmerProductService.getFarmerProducts(farmer));
    }

    @PostMapping("/add")
    public ResponseEntity<FarmerProduct> addFarmerProduct(
            @AuthenticationPrincipal User farmer,
            @RequestParam Long productId,
            @RequestParam Integer quantity,
            @RequestParam BigDecimal bargainPrice) {
        return ResponseEntity.ok(farmerProductService.addFarmerProduct(farmer, productId, quantity, bargainPrice));
    }

    @PutMapping("/{productId}/stock")
    public ResponseEntity<FarmerProduct> updateStock(
            @AuthenticationPrincipal User farmer,
            @PathVariable Long productId,
            @RequestParam Integer quantity) {
                
        return ResponseEntity.ok(farmerProductService.updateStock(farmer, productId, quantity));
    }

    @PutMapping("/{productId}/bargain-price")
    public ResponseEntity<FarmerProduct> updateBargainPrice(
            @AuthenticationPrincipal User farmer,
            @PathVariable Long productId,
            @RequestParam BigDecimal bargainPrice) {
        return ResponseEntity.ok(farmerProductService.updateBargainPrice(farmer, productId, bargainPrice));
    }

    @GetMapping("/all")
    public ResponseEntity<List<FarmerProductDTO>> getAllProductsWithFarmerDetails() {
        return ResponseEntity.ok(farmerProductService.getAllProductsWithFarmerDetails());
    }

    @GetMapping("/public/all")
    public ResponseEntity<List<FarmerProductDTO>> getAllPublicProducts() {
        return ResponseEntity.ok(farmerProductService.getAllProductsWithFarmerDetails());
    }

    @GetMapping("/public/search")
    public ResponseEntity<List<FarmerProductDTO>> searchPublicProducts(
            @RequestParam String query) {
        return ResponseEntity.ok(farmerProductService.searchFarmerProducts(query));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<FarmerProductDTO> getProductDetails(@PathVariable Long productId) {
        return ResponseEntity.ok(farmerProductService.getProductWithFarmerDetails(productId));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<FarmerProduct>> getFarmerProductsByCategory(
            @AuthenticationPrincipal User farmer,
            @PathVariable String category) {
        return ResponseEntity.ok(farmerProductService.getFarmerProductsByCategory(farmer, Category.valueOf(category)));
    }

    @GetMapping("/public/category/{category}")
    public ResponseEntity<List<FarmerProductDTO>> getPublicProductsByCategory(
            @PathVariable String category) {
        return ResponseEntity.ok(farmerProductService.getPublicProductsByCategory(Category.valueOf(category)));
    }


    @GetMapping("/public/{farmerProductId}")
    public ResponseEntity<FarmerProductDTO> getPublicFarmerProductDetails(
            @PathVariable Long farmerProductId) {
        return ResponseEntity.ok(farmerProductService.getFarmerProductDetails(farmerProductId));
    }

    @DeleteMapping("/{farmerProductId}")
    public ResponseEntity<?> deleteFarmerProduct(
            @AuthenticationPrincipal User farmer,
            @PathVariable Long farmerProductId) {
        farmerProductService.deleteFarmerProduct(farmer, farmerProductId);
        return ResponseEntity.ok().build();
    }
}
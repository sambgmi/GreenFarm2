package agroindia.agro.controller;

import agroindia.agro.model.Cart;
import agroindia.agro.model.FarmerProduct;
import agroindia.agro.model.User;
import agroindia.agro.service.CartService;
import agroindia.agro.service.FarmerProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    @Autowired
    private CartService cartService;

    @Autowired
    private FarmerProductService farmerProductService;

    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(
            @AuthenticationPrincipal User buyer,
            @RequestParam Long farmerProductId,
            @RequestParam Integer quantity) {
        return ResponseEntity.ok(cartService.addToCart(buyer, farmerProductId, quantity));
    }

    @PutMapping("/update/{cartId}")
    public ResponseEntity<Cart> updateCartQuantity(
            @PathVariable Long cartId,
            @RequestParam Integer quantity) {
        return ResponseEntity.ok(cartService.updateCartQuantity(cartId, quantity));
    }

    @DeleteMapping("/remove/{cartId}")
    public ResponseEntity<Void> removeFromCart(@PathVariable Long cartId) {
        cartService.removeFromCart(cartId);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<Cart>> getCartItems(@AuthenticationPrincipal User buyer) {
        return ResponseEntity.ok(cartService.getCartItems(buyer));
    }

    @GetMapping("/farmer-products")
    public ResponseEntity<List<FarmerProduct>> getAllFarmerProducts() {
        return ResponseEntity.ok(farmerProductService.getAllFarmerProducts());
    }

    @GetMapping("/farmer-products/details")
    public ResponseEntity<List<Map<String, Object>>> getFarmerProductDetails() {
        List<FarmerProduct> products = farmerProductService.getAllFarmerProducts();
        List<Map<String, Object>> details = products.stream().map(fp -> {
            Map<String, Object> detail = new HashMap<>();
            detail.put("farmerProductId", fp.getId());
            detail.put("productName", fp.getProduct().getName());
            detail.put("productId", fp.getProduct().getId());
            detail.put("farmerId", fp.getFarmer().getId());
            detail.put("farmerName", fp.getFarmer().getName());
            detail.put("bargainPrice", fp.getBargainPrice());
            detail.put("stock", fp.getQuantity());
            return detail;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(details);
    }
    @GetMapping("/public/farmer-products/details")
        public ResponseEntity<List<Map<String, Object>>> getPublicFarmerProductDetails() {
            List<FarmerProduct> products = farmerProductService.getAllFarmerProducts();
            List<Map<String, Object>> details = products.stream().map(fp -> {
                Map<String, Object> detail = new HashMap<>();
                detail.put("farmerProductId", fp.getId());
                detail.put("productName", fp.getProduct().getName());
                detail.put("productId", fp.getProduct().getId());
                detail.put("farmerId", fp.getFarmer().getId());
                detail.put("farmerName", fp.getFarmer().getName());
                detail.put("bargainPrice", fp.getBargainPrice());
                detail.put("stock", fp.getQuantity());
                detail.put("imageUrl", fp.getProduct().getImageUrl());
                detail.put("description", fp.getProduct().getDescription());
                detail.put("category", fp.getProduct().getCategory());
                detail.put("location", fp.getFarmer().getLocation());
                return detail;
            }).collect(Collectors.toList());
            return ResponseEntity.ok(details);
        }
    @GetMapping("/find-product")
    public ResponseEntity<FarmerProduct> getFarmerProduct(
            @RequestParam Long productId,
            @RequestParam Long farmerId,
            @RequestParam BigDecimal bargainPrice) {
        return ResponseEntity.ok(farmerProductService.findByProductAndFarmerAndPrice(
            productId, farmerId, bargainPrice));
    }
}
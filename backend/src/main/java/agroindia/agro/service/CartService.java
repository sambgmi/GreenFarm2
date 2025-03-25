package agroindia.agro.service;

import agroindia.agro.model.Cart;
import agroindia.agro.model.User;
import agroindia.agro.model.FarmerProduct;
import agroindia.agro.repository.CartRepository;
import agroindia.agro.repository.FarmerProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {
    @Autowired
    private CartRepository cartRepository;
    
    @Autowired
    private FarmerProductRepository farmerProductRepository;

    public Cart addToCart(User buyer, Long farmerProductId, Integer quantity) {
          System.out.println("CAME HERE");
        FarmerProduct farmerProduct = farmerProductRepository.findById(farmerProductId)

                .orElseThrow(() -> new RuntimeException("Farmer product not found"));


        // Verify if the product exists and has enough stock
        if (farmerProduct.getQuantity() < quantity) {
            throw new RuntimeException("Not enough stock available");
        }
        System.out.println("NUMBER"+farmerProduct);
        // Check if the item already exists in cart
        Optional<Cart> existingCart = cartRepository.findByBuyerAndFarmerProduct(buyer, farmerProduct);
        
        if (existingCart.isPresent()) {
            Cart cart = existingCart.get();
            cart.setQuantity(cart.getQuantity() + quantity);
            return cartRepository.save(cart);
        }

        Cart cart = new Cart();
        cart.setBuyer(buyer);
        cart.setFarmerProduct(farmerProduct);
        cart.setQuantity(quantity);
        
        return cartRepository.save(cart);
    }

    public Cart updateCartQuantity(Long cartId, Integer quantity) {
        Cart cart = cartRepository.findById(cartId)
            .orElseThrow(() -> new RuntimeException("Cart item not found"));
        cart.setQuantity(quantity);
        return cartRepository.save(cart);
    }

    public void removeFromCart(Long cartId) {
        cartRepository.deleteById(cartId);
    }

    public List<Cart> getCartItems(User buyer) {
        return cartRepository.findByBuyer(buyer);
    }
}
package com.sudin.ecom_proj.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sudin.ecom_proj.dto.CartItemRequest;
import com.sudin.ecom_proj.dto.CartItemResponse;
import com.sudin.ecom_proj.model.CartItem;
import com.sudin.ecom_proj.model.Product;
import com.sudin.ecom_proj.model.User;
import com.sudin.ecom_proj.repository.CartItemRepository;
import com.sudin.ecom_proj.repository.ProductRepository;
import com.sudin.ecom_proj.repository.UserRepository;

@Service
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    private User getUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<CartItemResponse> getCart(String username) {
        User user = getUser(username);
        return cartItemRepository.findByUser(user).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<CartItemResponse> addToCart(String username, CartItemRequest request) {
        User user = getUser(username);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem item = cartItemRepository.findByUserAndProduct(user, product)
                .orElse(new CartItem(null, user, product, 0));

        int addQty = (request.getQuantity() == null || request.getQuantity() <= 0) ? 1 : request.getQuantity();
        item.setQuantity(item.getQuantity() + addQty);
        cartItemRepository.save(item);

        return getCart(username);
    }

    public List<CartItemResponse> updateQuantity(String username, Integer productId, Integer quantity) {
        User user = getUser(username);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        CartItem item = cartItemRepository.findByUserAndProduct(user, product)
                .orElseThrow(() -> new RuntimeException("Item not in cart"));

        if (quantity == null || quantity <= 0) {
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }
        return getCart(username);
    }

    public List<CartItemResponse> removeFromCart(String username, Integer productId) {
        User user = getUser(username);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        cartItemRepository.deleteByUserAndProduct(user, product);
        return getCart(username);
    }

    public void clearCart(String username) {
        User user = getUser(username);
        cartItemRepository.deleteByUser(user);
    }

    private CartItemResponse toResponse(CartItem item) {
        Product p = item.getProduct();
        return new CartItemResponse(
                item.getId(), p.getId(), p.getName(), p.getBrand(),
                p.getPrice(), item.getQuantity());
    }
}

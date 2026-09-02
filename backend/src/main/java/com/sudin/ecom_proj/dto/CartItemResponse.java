package com.sudin.ecom_proj.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemResponse {
    private Integer cartItemId;
    private Integer productId;
    private String productName;
    private String brand;
    private BigDecimal price;
    private Integer quantity;
}

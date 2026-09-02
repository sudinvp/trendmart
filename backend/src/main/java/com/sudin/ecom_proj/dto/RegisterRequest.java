package com.sudin.ecom_proj.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    private String username;
    private String email;
    private String password;
    // "USER" (default) or "ADMIN"
    private String role;
    // required only when role = "ADMIN"
    private String adminCode;
}

# TrendMart – Full-Stack E-Commerce App (with Auth, Roles & Cart)

This package contains both projects:

```
backend/    Spring Boot REST API (Java 21, Spring Security, JWT, MySQL, JPA/Hibernate)
frontend/   React app (Vite, React Router, Axios, Bootstrap)
```

## What's new in this version

- **Login / Register** – `/api/auth/register` and `/api/auth/login`, JWT-based.
- **Role separation** – every account is `USER` or `ADMIN`.
  - `ADMIN` accounts can add, update, and delete products.
  - `USER` accounts can browse products and use the cart.
  - Registering as `ADMIN` requires an admin code (see `admin.secret.code` below) so
    randoms can't self-promote to admin.
- **Route protection**
  - Backend: Spring Security + a JWT filter enforce this at the API level
    (`SecurityConfig.java`) — the real source of truth.
  - Frontend: `ProtectedRoute` (any logged-in user) and `AdminRoute` (admin only)
    guard the relevant pages/buttons so the UI matches what the API allows.
- **Cart** – a per-user cart backed by the database (`CartItem` entity +
  `/api/cart/**` endpoints), in addition to the existing local cart the UI already had.
- Fixed the backend `pom.xml`, which previously referenced Spring Boot artifact
  IDs that don't exist (`spring-boot-starter-webmvc`, `spring-boot-starter-data-jpa-test`,
  `spring-boot-starter-webmvc-test`) and an unreleased parent version — the project would
  not have compiled as originally uploaded.

## Running the backend

1. Create a MySQL database matching `backend/src/main/resources/application.properties`
   (default: `projectdb`, user `root`, password `sudin` — change these for your machine).
2. From `backend/`, run:
   ```
   ./mvnw spring-boot:run
   ```
   Hibernate will auto-create the `product`, `users`, and `cart_items` tables
   (`spring.jpa.hibernate.ddl-auto=update`).
3. The API runs on `http://localhost:8080`.

### Auth config (`application.properties`)

```
jwt.secret=...            # HS256 signing key — change in production
jwt.expiration=86400000   # token lifetime in ms (24h)
admin.secret.code=...     # code required to self-register as ADMIN — change/remove in production
```

## Running the frontend

```
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173` by default and expects the API at
`http://localhost:8080/api` (see `src/axios.jsx`).

## Key new/changed files

**Backend**
- `model/User.java`, `model/Role.java`, `model/CartItem.java`
- `repository/UserRepository.java`, `repository/CartItemRepository.java`
- `dto/*` — request/response payloads for auth and cart
- `security/JwtUtil.java`, `security/JwtAuthFilter.java`,
  `security/CustomUserDetailsService.java`, `security/SecurityConfig.java`
- `service/AuthService.java`, `service/CartService.java`
- `controller/AuthController.java`, `controller/CartController.java`
- `pom.xml` — fixed dependencies, added Spring Security + JJWT
- `application.properties` — added JWT/admin config

**Frontend**
- `src/Context/AuthContext.jsx` — login/register/logout state, JWT stored in `localStorage`
- `src/components/Login.jsx`, `src/components/Register.jsx`
- `src/components/ProtectedRoute.jsx` — `ProtectedRoute` + `AdminRoute`
- `src/axios.jsx` — attaches the JWT to every request automatically
- `src/App.jsx` — new routes, wrapped in `AuthProvider`, admin-only routes guarded
- `src/components/Navbar.jsx` — Login/Register or username+Logout, "Add Product" hidden from non-admins
- `src/components/Home.jsx`, `src/components/Product.jsx` — require login to add to cart;
  Update/Delete buttons on the product page only show for admins
- `src/main.jsx` — simplified (removed a duplicate context provider wrap)

## A note on scope

The existing shopping cart (`Context/Context.jsx`, `Cart.jsx`) was left as-is — it's a
working client-side cart stored in `localStorage`. I added a parallel, per-user backend
cart (`/api/cart/**`) so cart data can persist server-side per account; wiring the Cart
page to call it instead of (or alongside) local storage is a natural next step if you
want carts to follow a user across devices.

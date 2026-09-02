import "./App.css";
import React, { useState } from "react";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Cart from "./components/Cart";
import AddProduct from "./components/AddProduct";
import Product from "./components/Product";
import Login from "./components/Login";
import Register from "./components/Register";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./Context/Context";
import { AuthProvider } from "./Context/AuthContext";
import { ProtectedRoute, AdminRoute } from "./components/ProtectedRoute";
import UpdateProduct from "./components/UpdateProduct";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function App() {
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Navbar onSelectCategory={handleCategorySelect} />
          <Routes>
            <Route
              path="/"
              element={<Home selectedCategory={selectedCategory} />}
            />

            {/* public auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* admin-only: manage products */}
            <Route
              path="/add_product"
              element={
                <AdminRoute>
                  <AddProduct />
                </AdminRoute>
              }
            />
            <Route
              path="/product/update/:id"
              element={
                <AdminRoute>
                  <UpdateProduct />
                </AdminRoute>
              }
            />

            {/* any logged-in user: view products */}
            <Route path="/product" element={<Product />} />
            <Route path="/product/:id" element={<Product />} />

            {/* any logged-in user: cart */}
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;

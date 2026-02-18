import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ShopLayout } from './src/layouts/ShopLayout';
import { AdminLayout } from './src/components/admin/AdminLayout';
import { ProtectedRoute } from './src/components/admin/ProtectedRoute';
import { Dashboard } from './src/pages/admin/Dashboard';
import { Categories } from './src/pages/admin/Categories';
import { Products } from './src/pages/admin/Products';
import { Brands } from './src/pages/admin/Brands';
import { Login } from './src/pages/admin/Login';
import { Register } from './src/pages/admin/Register';
import { Profile } from './src/pages/Profile';
import { ProductDetails } from './src/pages/ProductDetails';
import { VerifyEmail } from './src/pages/admin/VerifyEmail';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Shop Routes */}
        <Route path="/" element={<ShopLayout />} />
        <Route path="/product/:id" element={<ProductDetails />} />

        {/* User Profile */}
        <Route path="/profile" element={<Profile />} />

        {/* Admin Auth */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="brands" element={<Brands />} />
            <Route path="categories" element={<Categories />} />
            <Route path="products" element={<Products />} />
          </Route>
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
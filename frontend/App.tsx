import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ShopLayout } from './src/layouts/ShopLayout';
import { AdminLayout } from './src/components/admin/AdminLayout';
import { Dashboard } from './src/pages/admin/Dashboard';
import { Categories } from './src/pages/admin/Categories';
import { Products } from './src/pages/admin/Products';
import { Brands } from './src/pages/admin/Brands';
import { Login } from './src/pages/admin/Login';
import { Register } from './src/pages/admin/Register';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Shop Routes */}
        <Route path="/" element={<ShopLayout />} />

        {/* Admin Auth */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/register" element={<Register />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="brands" element={<Brands />} />
          <Route path="categories" element={<Categories />} />
          <Route path="products" element={<Products />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MainLayout from "./components/layout/MainLayout";
import DashboardPage from "@/pages/user/dashboard/DashboardPage";
import AdminLayout from "@/components/layout/admin/AdminLayout";
import AdminDashboardPage from "@/pages/admin/dashboard/AdminDashboardPage";
import AdminProductsPage from "@/pages/admin/products/AdminProductsPage";
import AdminUsersPage from "@/pages/admin/users/AdminUsersPage";
import AdminAuditPage from "@/pages/admin/audit/AdminAuditPage";
import { Toaster } from "react-hot-toast";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-center" reverseOrder={false} />
      <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="audit" element={<AdminAuditPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

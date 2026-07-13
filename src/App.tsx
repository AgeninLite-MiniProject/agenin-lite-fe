import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MainLayout from "./components/layout/MainLayout";
import DashboardPage from "@/pages/user/dashboard/DashboardPage";
import DownlinePage from "@/pages/user/downline/DownlinePage";
import DownlineDetailPage from "@/pages/user/downline/DownlineDetailPage";
import SendInvitationPage from "@/pages/user/downline/SendInvitationPage";
import IncomingInvitationsPage from "@/pages/user/downline/IncomingInvitationsPage";
import TransactionPage from "@/pages/user/transaction/TransactionPage";
import AdminLayout from "@/components/layout/admin/AdminLayout";
import AdminDashboardPage from "@/pages/admin/dashboard/AdminDashboardPage";
import AdminProductsPage from "@/pages/admin/products/AdminProductsPage";
import AdminUsersPage from "@/pages/admin/users/AdminUsersPage";
import AdminAuditPage from "@/pages/admin/audit/AdminAuditPage";
import RegisterPage from "@/pages/user/register/RegisterPage";
import LoginPage from "@/pages/user/login/LoginPage";
import HistoryPage from "@/pages/user/history/HistoryPage";
import AuthGuard from "@/components/guards/AuthGuard";
import AdminGuard from "@/components/guards/AdminGuard";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route element={<AuthGuard />}>
          
          {/* User Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/transaksi" element={<TransactionPage />} />
            <Route path="/downline" element={<DownlinePage />} />
            <Route path="/riwayat" element={<HistoryPage />} />
            <Route path="/downline/invite" element={<SendInvitationPage />} />
            <Route path="/downline/incoming" element={<IncomingInvitationsPage />} />
            <Route path="/downline/:id" element={<DownlineDetailPage />} />
          </Route>
          
          {/* Admin Routes */}
          <Route element={<AdminGuard />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="audit" element={<AdminAuditPage />} />
            </Route>
          </Route>

        </Route>
      </Routes>
    </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

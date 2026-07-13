import { useAuthStore } from "@/store/auth.store";
import { Navigate, Outlet } from "react-router-dom";

export default function AuthGuard() {
    const role = useAuthStore((state) => state.role);
    return role === 'ADMIN' ? <Outlet/> : <Navigate to="/dashboard" replace/>;
}
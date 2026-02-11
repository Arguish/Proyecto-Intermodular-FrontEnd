import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import MyReservations from "../pages/MyReservations";
import AdminDashboard from "../pages/AdminDashboard";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route
                element={
                    <ProtectedRoute redirectTo="/login">
                        <MainLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="/" element={<Home />} />
                <Route path="/my-reservations" element={<MyReservations />} />
                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]} redirectTo="/">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
            </Route>
        </Routes>
    );
}

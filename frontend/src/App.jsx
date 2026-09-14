import { Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import PostPurchasePage from "./pages/PostPurchasePage.jsx";
import CreatePasswordPage from "./pages/CreatePasswordPage.jsx";

function ProtectedRoute({ children }) {
  return localStorage.getItem("palavraToken") ? (
    children
  ) : (
    <Navigate to="/login" replace />
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/pos-compra" element={<PostPurchasePage />} />
      <Route path="/criar-senha" element={<CreatePasswordPage />} />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

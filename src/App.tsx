import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AuthPage } from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import { Toaster } from "react-hot-toast";
import { THEME } from "./constants/theme";
import EditProfilePage from "./pages/EditProfilePage";


const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="h-screen bg-[#0B0F19] text-white flex items-center justify-center">Loading...</div>;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return !isAuthenticated ? <>{children}</> : <Navigate to="/task-dashboard" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          
          <Route path="/login" element={<PublicRoute><AuthPage /></PublicRoute>} />
          
          
          <Route path="/task-dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster
  position="top-center"
  toastOptions={{
    style: {
      background: THEME.colors.panel,
      color: THEME.colors.text,
      border: `1px solid ${THEME.colors.border}`,
      borderRadius: THEME.radii.input,
      fontSize: "14px",
    },
    success: {
      iconTheme: {
        primary: THEME.colors.success, 
        secondary: THEME.colors.panel,
      },
    },
  }}
/>
    </AuthProvider>
  );
}
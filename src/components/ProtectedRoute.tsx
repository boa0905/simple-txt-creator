import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute = ({ children, allowedRoles = ['admin', 'user'] }: ProtectedRouteProps) => {
  const { user, isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated || !user) {
        try {
          const res = await axios.post(
            `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/auth/refresh`,
            {},
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true, // important for HttpOnly cookies
            }
          );
          const data = res.data;
          // Store auth data using context
          login(data.user, data.accessToken);
        } catch (err: any) {
          navigate("/login");
          if (err.response) {
            console.error("Login failed", err.response.data);
          } else {
            console.error("Network error during login", err.message);
          }
        }
      } else if (user?.role === "nothing") {
        // User has no access, show warning and redirect
      }
    };

    checkAuth();
  }, [isAuthenticated, user, navigate]);


  if (!isAuthenticated || !user) {
    return null;
  }

  if (user.role === 'nothing') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Alert className="max-w-md border-destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-center">
            <div className="font-semibold mb-2">Access Denied</div>
            <div>You don't have permission to access this application.</div>
            <div className="text-sm text-muted-foreground mt-2">
              waiting...
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Alert className="max-w-md border-destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-center">
            <div className="font-semibold mb-2">Insufficient Permissions</div>
            <div>You don't have permission to access this page.</div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
};
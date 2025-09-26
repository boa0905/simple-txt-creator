import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    const credential = credentialResponse?.credential;
    if (!credential) {
      console.error("No credential from Google");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/auth/google`,
        { credential },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true, // important for HttpOnly cookies
        }
      );
      const data = res.data;
      // Store auth data using context
      login(data.user, data.accessToken);

      navigate("/dashboard");
    } catch (err: any) {
      if (err.response) {
        console.error("Login failed", err.response.data);
      } else {
        console.error("Network error during login", err.message);
      }
    }
  };

  const handleGoogleError = () => {
    console.error("Google login failed");
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="absolute inset-0 gaming-gradient opacity-20"></div>

        <Card className="w-full max-w-md card-shadow relative z-10">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl primary-gradient flex items-center justify-center gaming-shadow">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Ageless Republic</CardTitle>
              <p className="text-muted-foreground mt-2">Secure access to admin panel</p>
            </div>
          </CardHeader>

          <CardContent>
            <div className="w-full">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                theme="outline"
                size="large"
                width={400}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;

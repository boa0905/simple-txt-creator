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
      <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="absolute inset-0 gaming-gradient opacity-20"></div>

        <Card className="w-full max-w-md card-shadow relative z-10">
          <CardHeader className="text-center space-y-3 sm:space-y-4 px-4 sm:px-6">
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl primary-gradient flex items-center justify-center gaming-shadow">
              <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-xl sm:text-2xl font-bold">Ageless Republic</CardTitle>
              <p className="text-sm sm:text-base text-muted-foreground mt-2">Secure access to admin panel</p>
            </div>
          </CardHeader>

          <CardContent className="px-4 sm:px-6">
            <div className="w-full flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                theme="outline"
                size="large"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;

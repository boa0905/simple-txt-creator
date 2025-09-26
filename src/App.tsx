import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { MainLayout } from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Players from "./pages/Players";
import Guilds from "./pages/Guilds";
import Economy from "./pages/Economy";
import Events from "./pages/Events";
import Monitoring from "./pages/Monitoring";
import Logs from "./pages/Logs";
import Rewards from "./pages/Rewards";
import News from "./pages/News";
import UserManagement from "./pages/UserManagement";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/players" element={
            <ProtectedRoute>
              <MainLayout>
                <Players />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/guilds" element={
            <ProtectedRoute>
              <MainLayout>
                <Guilds />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/economy" element={
            <ProtectedRoute>
              <MainLayout>
                <Economy />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/events" element={
            <ProtectedRoute>
              <MainLayout>
                <Events />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/monitoring" element={
            <ProtectedRoute>
              <MainLayout>
                <Monitoring />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/logs" element={
            <ProtectedRoute>
              <MainLayout>
                <Logs />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/rewards" element={
            <ProtectedRoute>
              <MainLayout>
                <Rewards />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/news" element={
            <ProtectedRoute>
              <MainLayout>
                <News />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/user-management" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <MainLayout>
                <UserManagement />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

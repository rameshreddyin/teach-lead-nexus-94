
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/authContext";
import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import LeadForm from "./pages/LeadForm";
import LeadDetail from "./pages/LeadDetail";
import Profile from "./pages/Profile";
import EditProfile from "./pages/profile/EditProfile";
import NotificationSettings from "./pages/profile/NotificationSettings";
import ChangePassword from "./pages/profile/ChangePassword";
import HelpSupport from "./pages/profile/HelpSupport";
import TermsOfService from "./pages/profile/TermsOfService";
import PrivacyPolicy from "./pages/profile/PrivacyPolicy";
import NotFound from "./pages/NotFound";

// Define a Content Security Policy
// In a real app, this would be in server headers
if (typeof window !== 'undefined') {
  // Create meta element for CSP
  const cspMeta = document.createElement('meta');
  cspMeta.httpEquiv = 'Content-Security-Policy';
  cspMeta.content = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self';";
  document.head.appendChild(cspMeta);
}

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
            
            {/* Protected routes with role-based access */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Home />} />
                
                {/* Lead management routes - only for teachers and admins */}
                <Route element={<ProtectedRoute allowedRoles={['teacher', 'admin']} />}>
                  <Route path="/add-lead" element={<LeadForm />} />
                  <Route path="/edit-lead/:id" element={<LeadForm />} />
                  <Route path="/lead/:id" element={<LeadDetail />} />
                </Route>
                
                {/* Profile routes - available to all authenticated users */}
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/edit" element={<EditProfile />} />
                <Route path="/profile/notifications" element={<NotificationSettings />} />
                <Route path="/profile/change-password" element={<ChangePassword />} />
                <Route path="/profile/help" element={<HelpSupport />} />
                <Route path="/profile/terms" element={<TermsOfService />} />
                <Route path="/profile/privacy" element={<PrivacyPolicy />} />
              </Route>
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

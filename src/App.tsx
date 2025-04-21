
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/authContext";
import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Lazy-loaded components
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const LeadForm = lazy(() => import("./pages/LeadForm"));
const LeadDetail = lazy(() => import("./pages/LeadDetail"));
const Profile = lazy(() => import("./pages/Profile"));
const EditProfile = lazy(() => import("./pages/profile/EditProfile"));
const NotificationSettings = lazy(() => import("./pages/profile/NotificationSettings"));
const ChangePassword = lazy(() => import("./pages/profile/ChangePassword"));
const HelpSupport = lazy(() => import("./pages/profile/HelpSupport"));
const TermsOfService = lazy(() => import("./pages/profile/TermsOfService"));
const PrivacyPolicy = lazy(() => import("./pages/profile/PrivacyPolicy"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Define a Content Security Policy
// In a real app, this would be in server headers
if (typeof window !== 'undefined') {
  // Create meta element for CSP
  const cspMeta = document.createElement('meta');
  cspMeta.httpEquiv = 'Content-Security-Policy';
  cspMeta.content = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self';";
  document.head.appendChild(cspMeta);
}

// Create a queryClient with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes (replacing cacheTime with gcTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-app-black"></div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
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
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

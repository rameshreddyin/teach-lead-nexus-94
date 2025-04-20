
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/authContext';
import { Toaster } from '@/components/ui/toaster';
import BottomNav from './BottomNav';
import Header from './Header';

const AppLayout = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-app-mediumGray">Loading...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="app-container bg-app-lightGray">
      <Header />
      <main className="main-content pb-16"> {/* Add bottom padding for the navbar */}
        <Outlet />
      </main>
      <BottomNav />
      <Toaster />
    </div>
  );
};

export default AppLayout;

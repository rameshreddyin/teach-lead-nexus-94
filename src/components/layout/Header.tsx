
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get title based on current path
  const getTitle = () => {
    const path = location.pathname;
    
    if (path === '/') return 'My Leads';
    if (path === '/add-lead') return 'Add New Lead';
    if (path.startsWith('/edit-lead')) return 'Edit Lead';
    if (path === '/profile') return 'My Profile';
    if (path.includes('/lead/')) return 'Lead Details';
    
    // Default title
    return 'Teacher Lead Nexus';
  };

  // Check if we need to show back button
  const showBackButton = location.pathname !== '/';

  // Handle back button press
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <header className="sticky top-0 bg-app-white border-b border-app-lightGray z-10 shadow-sm">
      <div className="flex items-center h-16 px-4">
        {showBackButton && (
          <button 
            onClick={handleBack}
            className="mr-3 p-2 rounded-full hover:bg-app-lightGray transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        <h1 className="text-lg font-medium flex-1 text-center">
          {getTitle()}
        </h1>
        <div className="w-10">
          {/* Empty div for balance */}
        </div>
      </div>
    </header>
  );
};

export default Header;

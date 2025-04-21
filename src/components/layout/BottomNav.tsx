
import { useLocation, useNavigate } from 'react-router-dom';
import { HomeIcon, User, PlusSquare } from 'lucide-react';

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Helper function to check if we're on a profile-related page
  const isProfileRoute = () => {
    return location.pathname === '/profile' || location.pathname.startsWith('/profile/');
  };
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-app-white border-t border-app-lightGray z-50 shadow-lg">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto">
        <button
          onClick={() => navigate('/')}
          className={`flex flex-col items-center justify-center w-1/3 py-2 transition-colors ${
            location.pathname === '/' ? 'text-app-black' : 'text-app-mediumGray'
          }`}
        >
          <HomeIcon className="h-5 w-5 mb-1" />
          <span className="text-xs font-medium">Home</span>
        </button>
        
        <button
          onClick={() => navigate('/add-lead')}
          className={`flex flex-col items-center justify-center w-1/3 py-2 transition-colors ${
            location.pathname === '/add-lead' ? 'text-app-black' : 'text-app-mediumGray'
          }`}
        >
          <PlusSquare className="h-5 w-5 mb-1" />
          <span className="text-xs font-medium">Add Lead</span>
        </button>
        
        <button
          onClick={() => navigate('/profile')}
          className={`flex flex-col items-center justify-center w-1/3 py-2 transition-colors ${
            isProfileRoute() ? 'text-app-black' : 'text-app-mediumGray'
          }`}
        >
          <User className="h-5 w-5 mb-1" />
          <span className="text-xs font-medium">Profile</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;


import React from 'react';
import { Search, Settings, User as UserIcon, LogOut } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

interface NavbarProps {
  store: any;
}

const Navbar: React.FC<NavbarProps> = ({ store }) => {
  const { state, logout } = store;
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-bottom border-gray-200 px-6 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <div className="flex-1 max-w-2xl relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search in Locker"
          value={store.searchQuery}
          onChange={(e) => store.setSearchQuery(e.target.value)}
          className="block w-full bg-gray-100 border-none rounded-lg py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
        />
      </div>

      <div className="flex items-center space-x-4 ml-4">
        <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
          <Settings className="w-5 h-5" />
        </button>

        <div className="h-8 w-px bg-gray-200"></div>

        <div className="flex items-center space-x-3">
          <Link to="/profile" className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors">
            <div className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
              {state.currentUser.name.charAt(0)}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-800 leading-none">{state.currentUser.name}</p>
              <p className="text-xs text-gray-500 leading-none mt-1">{state.currentUser.role.toUpperCase()}</p>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="p-2 hover:bg-red-50 rounded-full text-gray-500 hover:text-red-600 transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

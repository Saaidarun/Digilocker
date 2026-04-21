import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  HardDrive,
  Star,
  Clock,
  Trash2,
  ShieldCheck,
  BookOpen,
  Plus,
  FolderPlus,
  FileUp,
  ChevronDown,
  Share2
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  store: any;
}

const Sidebar: React.FC<SidebarProps> = ({ store }) => {
  const { state, uploadFile, createFolder } = store;
  const [isNewMenuOpen, setIsNewMenuOpen] = useState(false);

  const userDocs = state.documents.filter((d: any) => d.userId === state.currentUser.id && !d.isDeleted);
  const totalUsed = userDocs.reduce((acc: number, d: any) => acc + d.fileSize, 0);
  const limit = state.currentUser.storageLimit;
  const percentage = Math.round((totalUsed / limit) * 100);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0]);
      setIsNewMenuOpen(false);
    }
  };

  const handleCreateFolder = () => {
    const name = prompt("Enter folder name:");
    if (name) {
      createFolder(name);
      setIsNewMenuOpen(false);
    }
  };

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/drive', label: 'My Locker', icon: HardDrive },
    { to: '/shared', label: 'Received Docs', icon: Share2 },
    { to: '/starred', label: 'Important Docs', icon: Star },
    { to: '/recent', label: 'Latest Activity', icon: Clock },
    { to: '/trash', label: 'Recycle Bin', icon: Trash2 },
  ];

  if (state.currentUser.role === UserRole.ADMIN) {
    navItems.push({ to: '/admin', label: 'Admin Panel', icon: ShieldCheck });
  }

  navItems.push({ to: '/documentation', label: 'Documentation', icon: BookOpen });

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-6">
        <div className="flex items-center space-x-2 text-blue-600 mb-8">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">DigiLocker</span>
        </div>

        <div className="relative mb-6">
          <button
            onClick={() => setIsNewMenuOpen(!isNewMenuOpen)}
            className="flex items-center justify-between w-full bg-white border border-gray-200 hover:shadow-md transition-shadow py-3 px-4 rounded-2xl text-gray-700 font-medium group"
          >
            <div className="flex items-center space-x-2">
              <Plus className="w-6 h-6 text-blue-500" />
              <span>New</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isNewMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {isNewMenuOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 shadow-xl rounded-xl z-20 py-2">
              <label className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors">
                <FileUp className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-700">File upload</span>
                <input type="file" className="hidden" onChange={handleFileUpload} />
              </label>
              <button
                onClick={handleCreateFolder}
                className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 w-full text-left transition-colors"
              >
                <FolderPlus className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-700">New folder</span>
              </button>
            </div>
          )}
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-2.5 rounded-full transition-colors ${isActive
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6">
        <div className="mb-2">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Storage</span>
            <span>{percentage}% used</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all duration-500 ${percentage > 90 ? 'bg-red-500' : 'bg-blue-600'}`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
        <p className="text-xs text-gray-500">
          {(totalUsed / (1024 * 1024 * 1024)).toFixed(2)} GB of {(limit / (1024 * 1024 * 1024)).toFixed(0)} GB used
        </p>
        <button className="mt-4 w-full text-blue-600 text-sm font-medium border border-blue-600 rounded-full py-2 hover:bg-blue-50 transition-colors">
          Buy storage
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

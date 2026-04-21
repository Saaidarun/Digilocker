
import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useStore } from './store';
import { UserRole } from './types';
import {
  Home,
  HardDrive,
  Star,
  Clock,
  Trash2,
  Users,
  LogOut,
  Upload,
  FileText,
  MoreVertical,
  ChevronRight,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  FileBadge
} from 'lucide-react';

// Components
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Pages
// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import MyDrivePage from './pages/MyDrivePage';
import StarredPage from './pages/StarredPage';
import RecentPage from './pages/RecentPage';
import TrashPage from './pages/TrashPage';
import AdminDashboard from './pages/AdminDashboard';
import ProfilePage from './pages/ProfilePage';
import DocumentationPage from './pages/DocumentationPage';
import SharedWithMePage from './pages/SharedWithMePage';

const App: React.FC = () => {
  const store = useStore();
  const { state } = store;

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
        {!state.currentUser ? (
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage store={store} />} />
            <Route path="/register" element={<RegisterPage store={store} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        ) : (
          <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <Sidebar store={store} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <Navbar store={store} />
              <main className="flex-1 overflow-y-auto p-6">
                <Routes>
                  <Route path="/" element={<HomePage store={store} />} />
                  <Route path="/drive" element={<MyDrivePage store={store} />} />
                  <Route path="/shared" element={<SharedWithMePage store={store} />} />
                  <Route path="/starred" element={<StarredPage store={store} />} />
                  <Route path="/recent" element={<RecentPage store={store} />} />
                  <Route path="/trash" element={<TrashPage store={store} />} />
                  <Route path="/profile" element={<ProfilePage store={store} />} />
                  <Route path="/documentation" element={<DocumentationPage />} />

                  {state.currentUser.role === UserRole.ADMIN && (
                    <Route path="/admin" element={<AdminDashboard store={store} />} />
                  )}

                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </main>
            </div>
          </div>
        )}
      </div>
    </HashRouter>
  );
};

export default App;

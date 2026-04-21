
import React from 'react';
import { User, Shield, Key, Bell, CreditCard } from 'lucide-react';

interface ProfilePageProps {
  store: any;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ store }) => {
  const { state } = store;

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-500">Manage your account information and preferences.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-3xl mx-auto mb-4 border-4 border-white shadow-md">
              {state.currentUser.name.charAt(0)}
            </div>
            <h2 className="text-lg font-bold text-gray-900">{state.currentUser.name}</h2>
            <p className="text-sm text-gray-500 mb-4">{state.currentUser.email}</p>
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase">
              {state.currentUser.role}
            </span>
          </div>

          <nav className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {[
              { label: 'General', icon: User },
              { label: 'Security', icon: Shield },
              { label: 'Password', icon: Key },
              { label: 'Notifications', icon: Bell },
              { label: 'Billing', icon: CreditCard },
            ].map((item, idx) => (
              <button 
                key={idx} 
                className={`w-full flex items-center space-x-3 px-6 py-4 text-sm font-medium transition-colors ${idx === 0 ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Personal Information</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                  <input 
                    type="text" 
                    defaultValue={state.currentUser.name.split(' ')[0]} 
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                  <input 
                    type="text" 
                    defaultValue={state.currentUser.name.split(' ')[1] || ''} 
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                <input 
                  type="email" 
                  disabled 
                  defaultValue={state.currentUser.email} 
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="+1 (555) 000-0000" 
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div className="pt-4">
                <button className="bg-blue-600 text-white font-bold px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors">
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          <div className="bg-red-50 p-8 rounded-2xl border border-red-100 shadow-sm">
            <h3 className="text-lg font-bold text-red-900 mb-2">Danger Zone</h3>
            <p className="text-red-700 text-sm mb-6">Permanently delete your account and all documents. This action cannot be undone.</p>
            <button className="bg-red-600 text-white font-bold px-6 py-2 rounded-xl hover:bg-red-700 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

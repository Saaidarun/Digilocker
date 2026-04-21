
import React from 'react';
import { Link } from 'react-router-dom';
// Fix: Added ShieldCheck to the imports from lucide-react
import { Folder, Clock, Star, TrendingUp, ShieldCheck } from 'lucide-react';
import FileList from '../components/FileList';

interface HomePageProps {
  store: any;
}

const HomePage: React.FC<HomePageProps> = ({ store }) => {
  const { state, toggleStar, softDelete } = store;
  
  const userDocs = state.documents.filter((d: any) => d.userId === state.currentUser.id && !d.isDeleted);
  const recentDocs = [...userDocs].sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()).slice(0, 5);
  const starredDocs = userDocs.filter((d: any) => d.isStarred).slice(0, 5);
  
  const stats = [
    { label: 'Total Files', value: userDocs.length, icon: Folder, color: 'bg-blue-500' },
    { label: 'Recent Uploads', value: recentDocs.length, icon: Clock, color: 'bg-indigo-500' },
    { label: 'Starred Items', value: starredDocs.length, icon: Star, color: 'bg-yellow-500' },
    { label: 'Usage', value: `${((userDocs.reduce((acc: any, d: any) => acc + d.fileSize, 0) / state.currentUser.storageLimit) * 100).toFixed(1)}%`, icon: TrendingUp, color: 'bg-green-500' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {state.currentUser.name}!</h1>
        <p className="text-gray-500">Manage your documents securely and easily.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-2 rounded-xl`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Recent Documents</h2>
              <Link to="/recent" className="text-blue-600 text-sm font-bold hover:underline">View all</Link>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <FileList 
                files={recentDocs} 
                onToggleStar={toggleStar}
                onDelete={softDelete}
              />
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Suggested</h2>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {['Insurance_Policy.pdf', 'Driving_License.jpg', 'Degree_Certificate.pdf'].map((item, i) => (
                <div key={i} className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-blue-200 cursor-pointer transition-colors">
                  <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                    <Folder className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="font-bold text-lg mb-2">Security Score</h3>
              <p className="text-blue-100 text-sm mb-4">Your account is 85% secure. Enable 2FA for maximum protection.</p>
              <button className="bg-white text-blue-600 font-bold px-4 py-2 rounded-xl text-sm hover:bg-blue-50 transition-colors">
                Improve Security
              </button>
            </div>
            <ShieldCheck className="absolute -right-4 -bottom-4 w-32 h-32 text-blue-500 opacity-30" />
          </section>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
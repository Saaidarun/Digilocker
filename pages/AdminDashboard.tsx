
import React, { useState } from 'react';
import {
  Users as UsersIcon,
  FileText,
  Activity,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { UserRole } from '../types';
import FileList from '../components/FileList';

interface AdminDashboardProps {
  store: any;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ store }) => {
  const { state, permanentDelete } = store;
  const [activeTab, setActiveTab] = useState<'users' | 'documents' | 'logs'>('users');

  const usersCount = state.users.filter((u: any) => u.role === UserRole.USER).length;
  const totalDocs = state.documents.filter((d: any) => !d.isDeleted).length;
  const totalStorageSize = state.documents.reduce((acc: number, d: any) => acc + d.fileSize, 0);

  const stats = [
    { label: 'Total Users', value: usersCount, icon: UsersIcon, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Stored Files', value: totalDocs, icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { label: 'System Storage', value: `${(totalStorageSize / (1024 * 1024 * 1024)).toFixed(2)} GB`, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'System Health', value: '100%', icon: Activity, color: 'text-green-600', bg: 'bg-green-100' },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500">System management and oversight.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className={`${stat.bg} p-3 rounded-xl`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 leading-tight">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-4 text-sm font-bold transition-colors border-b-2 ${activeTab === 'users' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            Users Management
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-6 py-4 text-sm font-bold transition-colors border-b-2 ${activeTab === 'documents' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            All Documents
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-6 py-4 text-sm font-bold transition-colors border-b-2 ${activeTab === 'logs' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            Activity Logs
          </button>
        </div>

        <div className="p-4">
          {activeTab === 'users' && (
            <div className="space-y-8">
              {/* Pending Approvals */}
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <ShieldCheck className="w-5 h-5 text-orange-500 mr-2" />
                  Pending Approvals
                </h3>
                {state.users.filter((u: any) => u.role === UserRole.USER && !u.isApproved).length === 0 ? (
                  <p className="text-gray-500 text-sm">No pending registration requests.</p>
                ) : (
                  <div className="overflow-x-auto bg-white rounded-lg border border-orange-100">
                    <table className="w-full text-left">
                      <thead className="bg-orange-50/50">
                        <tr className="text-gray-500 text-xs uppercase tracking-wider">
                          <th className="px-4 py-3 font-semibold">User</th>
                          <th className="px-4 py-3 font-semibold">Email</th>
                          <th className="px-4 py-3 font-semibold">Joined</th>
                          <th className="px-4 py-3 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {state.users.filter((u: any) => u.role === UserRole.USER && !u.isApproved).map((user: any) => (
                          <tr key={user.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">{user.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-500">{user.email}</td>
                            <td className="px-4 py-3 text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                            <td className="px-4 py-3 text-right space-x-2">
                              <button
                                onClick={() => store.approveUser(user.id)}
                                className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-700 transition"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => store.rejectUser(user.id)}
                                className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-700 transition"
                              >
                                Reject
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="overflow-x-auto">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Active Users</h3>
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b text-gray-400 text-xs uppercase tracking-wider">
                      <th className="px-4 py-3 font-semibold">User</th>
                      <th className="px-4 py-3 font-semibold">Email</th>
                      <th className="px-4 py-3 font-semibold">Joined</th>
                      <th className="px-4 py-3 font-semibold">Files</th>
                      <th className="px-4 py-3 font-semibold">Usage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.users.filter((u: any) => u.role === UserRole.USER && u.isApproved).map((user: any) => {
                      const docs = state.documents.filter((d: any) => d.userId === user.id);
                      const usage = docs.reduce((acc: number, d: any) => acc + d.fileSize, 0);
                      const perc = Math.round((usage / user.storageLimit) * 100);
                      return (
                        <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4 flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                              {user.name.charAt(0)}
                            </div>
                            <span className="font-medium text-gray-900">{user.name}</span>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500">{user.email}</td>
                          <td className="px-4 py-4 text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                          <td className="px-4 py-4 text-sm text-gray-500">{docs.length}</td>
                          <td className="px-4 py-4">
                            <div className="w-24 bg-gray-100 rounded-full h-1.5 mb-1">
                              <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${perc}%` }}></div>
                            </div>
                            <span className="text-[10px] text-gray-400 font-bold">{perc}%</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <FileList
              files={state.documents}
              isAdmin={true}
              onPermanentDelete={permanentDelete}
            />
          )}

          {activeTab === 'logs' && (
            <div className="space-y-4">
              {state.logs.map((log: any) => (
                <div key={log.id} className="flex items-start space-x-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <Activity className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      <span className="font-bold">{log.userName}</span> {log.action}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(log.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

'use client';

import { DashboardHeader } from '@/components/dashboard-header';
import { getUsers, createUser, deleteUser, updateUser, resetUserPassword } from '@/lib/actions/users';
import { Plus, Search, Trash2, Edit, Shield, UserCheck, X, Key } from 'lucide-react';
import { useState, useEffect } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'cashier';
  phone?: string;
  isActive: boolean;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'cashier' as 'manager' | 'cashier',
    phone: '',
  });

  const [resetPassword, setResetPassword] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async (search?: string, role?: string) => {
    try {
      setLoading(true);
      const data = await getUsers({ search, role });
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadUsers(searchQuery || undefined, roleFilter);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, roleFilter]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await createUser(formData);
      setSuccess('User created successfully');
      setShowCreateModal(false);
      setFormData({ name: '', email: '', password: '', role: 'cashier', phone: '' });
      loadUsers(searchQuery || undefined, roleFilter);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    }
  };

  const handleDelete = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) return;
    setError('');
    setSuccess('');

    try {
      await deleteUser(userId);
      setSuccess('User deleted successfully');
      loadUsers(searchQuery || undefined, roleFilter);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  const handleToggleActive = async (userId: string, isActive: boolean) => {
    setError('');
    try {
      await updateUser(userId, { isActive: !isActive });
      loadUsers(searchQuery || undefined, roleFilter);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showResetModal) return;
    setError('');
    setSuccess('');

    try {
      await resetUserPassword(showResetModal, resetPassword);
      setSuccess('Password reset successfully');
      setShowResetModal(null);
      setResetPassword('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
    }
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400';
      case 'manager': return 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400';
      case 'cashier': return 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400';
      default: return 'bg-slate-100 dark:bg-slate-500/20 text-slate-600 dark:text-slate-400';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300">
      <DashboardHeader title="User Management" userRole="admin" />

      <main className="p-8">
        {/* Alerts */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 px-5 py-4 rounded-2xl text-sm font-bold flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')}><X className="h-4 w-4" /></button>
          </div>
        )}
        {success && (
          <div className="mb-6 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-5 py-4 rounded-2xl text-sm font-bold flex items-center justify-between">
            <span>{success}</span>
            <button onClick={() => setSuccess('')}><X className="h-4 w-4" /></button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Users</p>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-2">{users.length}</h3>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-500/10 rounded-2xl">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Active Users</p>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-2">{users.filter(u => u.isActive).length}</h3>
              </div>
              <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl">
                <UserCheck className="h-8 w-8 text-emerald-600" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Managers</p>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-2">{users.filter(u => u.role === 'manager').length}</h3>
              </div>
              <div className="p-4 bg-orange-50 dark:bg-orange-500/10 rounded-2xl">
                <Edit className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users..."
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-semibold text-slate-900 dark:text-white outline-none"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="cashier">Cashier</option>
              </select>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add User</span>
            </button>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center">
                <div className="h-8 w-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
              </div>
            ) : users.length === 0 ? (
              <div className="p-12 text-center text-slate-400 font-semibold">No users found</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="text-left py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">User</th>
                    <th className="text-left py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Role</th>
                    <th className="text-left py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                    <th className="text-left py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Created</th>
                    <th className="text-right py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-5 px-8">
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{user.name}</p>
                          <p className="text-xs text-slate-400 font-medium">{user.email}</p>
                          {user.phone && <p className="text-xs text-slate-400 font-medium">{user.phone}</p>}
                        </div>
                      </td>
                      <td className="py-5 px-8">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getRoleBadgeClass(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-5 px-8">
                        <button
                          onClick={() => user.role !== 'admin' && handleToggleActive(user._id, user.isActive)}
                          disabled={user.role === 'admin'}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            user.isActive
                              ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                              : 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400'
                          } ${user.role !== 'admin' ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}`}
                        >
                          {user.isActive ? 'Active' : 'Disabled'}
                        </button>
                      </td>
                      <td className="py-5 px-8 text-xs font-bold text-slate-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-5 px-8 text-right">
                        {user.role !== 'admin' && (
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => { setShowResetModal(user._id); setResetPassword(''); }}
                              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-blue-600 transition-colors"
                              title="Reset Password"
                            >
                              <Key className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(user._id, user.name)}
                              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-red-600 transition-colors"
                              title="Delete User"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 max-w-md w-full border border-slate-200 dark:border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Create New User</h2>
              <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="user@example.com"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Min 6 characters"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as 'manager' | 'cashier' })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-semibold text-slate-900 dark:text-white outline-none"
                  >
                    <option value="cashier">Cashier</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="+234..."
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors mt-2"
              >
                Create User
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 max-w-md w-full border border-slate-200 dark:border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Reset Password</h2>
              <button onClick={() => setShowResetModal(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">New Password</label>
                <input
                  type="password"
                  value={resetPassword}
                  onChange={(e) => setResetPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Min 6 characters"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors"
              >
                Reset Password
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

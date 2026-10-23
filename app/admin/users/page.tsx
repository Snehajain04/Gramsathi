'use client';

import { useState, useMemo } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Shield,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Download,
  X,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import { DEMO_USERS } from '@/lib/mockData';
import { UserRole, Language } from '@/types';

interface ExtendedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  language: Language;
  phone: string;
  state: string;
  district: string;
  status: 'active' | 'suspended';
  createdAt: string;
  lastLogin: string;
}

const INITIAL_USERS: ExtendedUser[] = [
  ...DEMO_USERS.map(u => ({
    ...u,
    phone: u.phone || '+91-9876543210',
    state: u.state || 'Maharashtra',
    district: u.district || 'Pune',
    status: 'active' as const,
    lastLogin: 'Today, 10:20 AM',
  })),
  {
    id: 'u5',
    name: 'Anil Jadhav',
    email: 'anil.farmer@demo.com',
    role: 'farmer',
    language: 'mr',
    phone: '+91-9822114455',
    state: 'Maharashtra',
    district: 'Nashik',
    status: 'active',
    createdAt: '2024-04-12',
    lastLogin: 'Yesterday, 04:30 PM',
  },
  {
    id: 'u6',
    name: 'Sunita Reddy',
    email: 'sunita.reddy@gov.in',
    role: 'extension_worker',
    language: 'te',
    phone: '+91-9844332211',
    state: 'Telangana',
    district: 'Warangal',
    status: 'active',
    createdAt: '2024-02-18',
    lastLogin: 'Today, 08:45 AM',
  },
  {
    id: 'u7',
    name: 'Dr. Harpreet Singh',
    email: 'h.singh@icar.gov.in',
    role: 'expert',
    language: 'pa',
    phone: '+91-9811223344',
    state: 'Punjab',
    district: 'Ludhiana',
    status: 'active',
    createdAt: '2023-12-05',
    lastLogin: '2 days ago',
  },
  {
    id: 'u8',
    name: 'Kavita Deshmukh',
    email: 'kavita.deshmukh@demo.com',
    role: 'farmer',
    language: 'mr',
    phone: '+91-9988776655',
    state: 'Maharashtra',
    district: 'Aurangabad',
    status: 'suspended',
    createdAt: '2024-05-20',
    lastLogin: '1 week ago',
  },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<ExtendedUser[]>(INITIAL_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [stateFilter, setStateFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New user form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('farmer');
  const [newLanguage, setNewLanguage] = useState<Language>('hi');
  const [newState, setNewState] = useState('Maharashtra');
  const [newDistrict, setNewDistrict] = useState('Pune');

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.phone.includes(searchTerm);
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      const matchesState = stateFilter === 'all' || u.state === stateFilter;
      return matchesSearch && matchesRole && matchesState;
    });
  }, [users, searchTerm, roleFilter, stateFilter]);

  const stats = useMemo(() => {
    const total = users.length;
    const farmers = users.filter(u => u.role === 'farmer').length;
    const workers = users.filter(u => u.role === 'extension_worker').length;
    const experts = users.filter(u => u.role === 'expert').length;
    const admins = users.filter(u => u.role === 'admin').length;
    return { total, farmers, workers, experts, admins };
  }, [users]);

  const handleToggleStatus = (id: string) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === id) {
          const nextStatus = u.status === 'active' ? 'suspended' : 'active';
          toast.success(`User ${u.name} is now ${nextStatus}`);
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const handleResetPassword = (name: string) => {
    toast.success(`Temporary reset credential link sent via SMS to ${name}!`);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) {
      toast.error('Please provide name and email');
      return;
    }

    const newUser: ExtendedUser = {
      id: `u-${Date.now()}`,
      name: newName,
      email: newEmail,
      phone: newPhone || '+91-9800000000',
      role: newRole,
      language: newLanguage,
      state: newState,
      district: newDistrict,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: 'Never',
    };

    setUsers(prev => [newUser, ...prev]);
    toast.success(`Account created for ${newName} with role ${newRole}!`);
    setIsAddModalOpen(false);

    // Reset fields
    setNewName('');
    setNewEmail('');
    setNewPhone('');
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'farmer':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-green-950 text-green-400 border border-green-800">Farmer</span>;
      case 'extension_worker':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-950 text-blue-400 border border-blue-800">Extension Officer</span>;
      case 'expert':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-950 text-purple-400 border border-purple-800">Agronomy Expert</span>;
      case 'admin':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-950 text-amber-400 border border-amber-800">System Admin</span>;
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 lg:p-6 space-y-6 text-white max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-green-400" />
              User Governance & Access Control Directory
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">
              Manage accounts, role assignments, authentication policies, and regional field privileges.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toast.success('User directory exported to CSV!')}
              className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-green-900/30"
            >
              <UserPlus className="w-4 h-4" /> Add New User
            </button>
          </div>
        </div>

        {/* Role Distribution Stat Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div
            onClick={() => setRoleFilter('all')}
            className={`cursor-pointer bg-gray-900 border rounded-2xl p-3 transition-all ${
              roleFilter === 'all' ? 'border-green-500 bg-green-950/20' : 'border-gray-800 hover:border-gray-700'
            }`}
          >
            <p className="text-[11px] text-gray-400 font-medium uppercase">All Profiles</p>
            <p className="text-xl font-black text-white mt-1">{stats.total}</p>
          </div>
          <div
            onClick={() => setRoleFilter('farmer')}
            className={`cursor-pointer bg-gray-900 border rounded-2xl p-3 transition-all ${
              roleFilter === 'farmer' ? 'border-green-500 bg-green-950/20' : 'border-gray-800 hover:border-gray-700'
            }`}
          >
            <p className="text-[11px] text-green-400 font-medium uppercase">Farmers</p>
            <p className="text-xl font-black text-green-400 mt-1">{stats.farmers}</p>
          </div>
          <div
            onClick={() => setRoleFilter('extension_worker')}
            className={`cursor-pointer bg-gray-900 border rounded-2xl p-3 transition-all ${
              roleFilter === 'extension_worker' ? 'border-blue-500 bg-blue-950/20' : 'border-gray-800 hover:border-gray-700'
            }`}
          >
            <p className="text-[11px] text-blue-400 font-medium uppercase">Field Extension</p>
            <p className="text-xl font-black text-blue-400 mt-1">{stats.workers}</p>
          </div>
          <div
            onClick={() => setRoleFilter('expert')}
            className={`cursor-pointer bg-gray-900 border rounded-2xl p-3 transition-all ${
              roleFilter === 'expert' ? 'border-purple-500 bg-purple-950/20' : 'border-gray-800 hover:border-gray-700'
            }`}
          >
            <p className="text-[11px] text-purple-400 font-medium uppercase">Agronomy Experts</p>
            <p className="text-xl font-black text-purple-400 mt-1">{stats.experts}</p>
          </div>
          <div
            onClick={() => setRoleFilter('admin')}
            className={`cursor-pointer bg-gray-900 border rounded-2xl p-3 transition-all ${
              roleFilter === 'admin' ? 'border-amber-500 bg-amber-950/20' : 'border-gray-800 hover:border-gray-700'
            }`}
          >
            <p className="text-[11px] text-amber-400 font-medium uppercase">Administrators</p>
            <p className="text-xl font-black text-amber-400 mt-1">{stats.admins}</p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by name, email address, or mobile number..."
              className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-gray-950 border border-gray-800 px-3 py-2 rounded-xl text-xs">
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                className="bg-transparent text-white outline-none cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="farmer">Farmer</option>
                <option value="extension_worker">Extension Officer</option>
                <option value="expert">Agronomy Expert</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-gray-950 border border-gray-800 px-3 py-2 rounded-xl text-xs">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={stateFilter}
                onChange={e => setStateFilter(e.target.value)}
                className="bg-transparent text-white outline-none cursor-pointer"
              >
                <option value="all">All States</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Punjab">Punjab</option>
                <option value="Telangana">Telangana</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Karnataka">Karnataka</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-gray-800/80 uppercase text-[11px] text-gray-400 font-semibold tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">User Identity</th>
                  <th className="px-5 py-3.5">Role & Privileges</th>
                  <th className="px-5 py-3.5">Jurisdiction / Location</th>
                  <th className="px-5 py-3.5">Language</th>
                  <th className="px-5 py-3.5">Account Status</th>
                  <th className="px-5 py-3.5">Last Active</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredUsers.map(user => {
                  const initials = user.name
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2);

                  return (
                    <tr key={user.id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-green-900/60 border border-green-700/50 flex items-center justify-center font-bold text-xs text-green-300">
                            {initials}
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm">{user.name}</p>
                            <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                              <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {user.email}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {user.phone}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-white">{user.district}</p>
                        <p className="text-[11px] text-gray-400">{user.state}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="uppercase font-mono px-2 py-0.5 bg-gray-800 rounded text-gray-300 text-[11px]">
                          {user.language}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {user.status === 'active' ? (
                          <span className="inline-flex items-center gap-1 text-green-400 text-xs font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-400 text-xs font-semibold">
                            <XCircle className="w-3.5 h-3.5" /> Suspended
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-gray-400 text-[11px]">
                        {user.lastLogin}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleResetPassword(user.name)}
                            className="p-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs"
                            title="Send Password Reset Link"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(user.id)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                              user.status === 'active'
                                ? 'bg-red-950/40 text-red-400 border-red-800 hover:bg-red-900/60'
                                : 'bg-green-950/40 text-green-400 border-green-800 hover:bg-green-900/60'
                            }`}
                          >
                            {user.status === 'active' ? 'Suspend' : 'Activate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Add New User */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-3xl max-w-lg w-full p-6 space-y-4 relative shadow-2xl">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-600/20 border border-green-500/30 flex items-center justify-center text-green-400">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Create New User Account</h3>
                  <p className="text-xs text-gray-400">Assign role credentials and district jurisdiction</p>
                </div>
              </div>

              <form onSubmit={handleAddUser} className="space-y-3.5">
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder="e.g. Anand Shinde"
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={newEmail}
                      onChange={e => setNewEmail(e.target.value)}
                      placeholder="user@demo.com"
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={newPhone}
                      onChange={e => setNewPhone(e.target.value)}
                      placeholder="+91-9876543210"
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">System Role</label>
                    <select
                      value={newRole}
                      onChange={e => setNewRole(e.target.value as UserRole)}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-green-500"
                    >
                      <option value="farmer">Farmer</option>
                      <option value="extension_worker">Extension Worker</option>
                      <option value="expert">Agronomy Expert</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">Preferred Language</label>
                    <select
                      value={newLanguage}
                      onChange={e => setNewLanguage(e.target.value as Language)}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-green-500"
                    >
                      <option value="en">English</option>
                      <option value="hi">हिंदी (Hindi)</option>
                      <option value="mr">मराठी (Marathi)</option>
                      <option value="te">తెలుగు (Telugu)</option>
                      <option value="ta">தமிழ் (Tamil)</option>
                      <option value="kn">ಕನ್ನಡ (Kannada)</option>
                      <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">State</label>
                    <select
                      value={newState}
                      onChange={e => setNewState(e.target.value)}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-green-500"
                    >
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Odisha">Odisha</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">District</label>
                    <input
                      type="text"
                      value={newDistrict}
                      onChange={e => setNewDistrict(e.target.value)}
                      placeholder="e.g. Pune"
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-green-900/30"
                  >
                    <ShieldCheck className="w-4 h-4" /> Provision Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

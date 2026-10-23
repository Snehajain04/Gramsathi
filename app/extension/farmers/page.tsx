'use client';

import { useState } from 'react';
import ExtensionLayout from '@/components/layout/ExtensionLayout';
import { Users, Search, Phone, MapPin, Plus, X, Calendar, CheckCircle2, Tractor } from 'lucide-react';
import { toast } from 'sonner';
import { getRiskBgClass } from '@/lib/riskEngine';

interface FarmerEntry {
  id: string;
  name: string;
  phone: string;
  village: string;
  taluka: string;
  crop: string;
  acres: number;
  riskStatus: 'low' | 'medium' | 'high' | 'critical';
  lastVisit: string;
}

const INITIAL_FARMERS: FarmerEntry[] = [
  { id: 'F-001', name: 'Ramesh Patil', phone: '+91 98765 43210', village: 'Koregaon Bhima', taluka: 'Shirur', crop: 'Rice (IR-64)', acres: 3.5, riskStatus: 'high', lastVisit: '2024-08-01' },
  { id: 'F-002', name: 'Vijay More', phone: '+91 98765 43211', village: 'Shirur', taluka: 'Shirur', crop: 'Maize (DKC-9108)', acres: 2.0, riskStatus: 'high', lastVisit: '2024-07-29' },
  { id: 'F-003', name: 'Sanjay Deshmukh', phone: '+91 98765 43212', village: 'Daund', taluka: 'Daund', crop: 'Soybean (JS-335)', acres: 4.2, riskStatus: 'medium', lastVisit: '2024-07-25' },
  { id: 'F-004', name: 'Rekha Shinde', phone: '+91 98765 43214', village: 'Yavat', taluka: 'Daund', crop: 'Tomato (Abhinav)', acres: 1.5, riskStatus: 'medium', lastVisit: '2024-07-20' },
  { id: 'F-005', name: 'Anandrao Kadam', phone: '+91 98765 43215', village: 'Koregaon Bhima', taluka: 'Shirur', crop: 'Sugarcane (Co-86032)', acres: 5.0, riskStatus: 'low', lastVisit: '2024-07-15' },
  { id: 'F-006', name: 'Babanrao Shirole', phone: '+91 98765 43216', village: 'Supa', taluka: 'Parner', crop: 'Groundnut (TAG-24)', acres: 2.8, riskStatus: 'low', lastVisit: '2024-07-10' },
];

export default function ExtensionFarmersPage() {
  const [farmers, setFarmers] = useState(INITIAL_FARMERS);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newFarmer, setNewFarmer] = useState({
    name: '',
    phone: '',
    village: '',
    taluka: 'Shirur',
    crop: 'Rice',
    acres: 2,
  });

  const filtered = farmers.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.village.toLowerCase().includes(search.toLowerCase()) ||
    f.phone.includes(search) ||
    f.crop.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateFarmer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFarmer.name.trim() || !newFarmer.phone.trim()) {
      toast.error('Please enter farmer name and contact phone number.');
      return;
    }

    const created: FarmerEntry = {
      id: `F-00${farmers.length + 1}`,
      name: newFarmer.name.trim(),
      phone: newFarmer.phone.trim(),
      village: newFarmer.village.trim() || 'Shirur',
      taluka: newFarmer.taluka,
      crop: newFarmer.crop,
      acres: Number(newFarmer.acres) || 1,
      riskStatus: 'low',
      lastVisit: 'Pending first visit',
    };

    setFarmers([created, ...farmers]);
    toast.success(`Farmer ${created.name} registered into your field directory!`);
    setShowAdd(false);
    setNewFarmer({ name: '', phone: '', village: '', taluka: 'Shirur', crop: 'Rice', acres: 2 });
  };

  return (
    <ExtensionLayout>
      <div className="p-4 lg:p-6 space-y-6 max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-700" /> Assigned Farmer Directory
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Field jurisdiction records for Shirur & Daund blocks · Government of Maharashtra Agriculture Extension.
            </p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="btn-primary bg-blue-700 hover:bg-blue-800 flex items-center gap-2 text-sm shadow-sm self-start"
          >
            <Plus className="w-4 h-4" /> Enroll New Farmer
          </button>
        </div>

        {/* Search */}
        <div className="card p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex items-center gap-2 w-full sm:w-80 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3" />
            <input
              type="text"
              placeholder="Search by name, village, crop..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-9 py-2 text-sm"
            />
          </div>
          <p className="text-xs text-gray-500 font-medium">
            Showing {filtered.length} of {farmers.length} farmers
          </p>
        </div>

        {/* Farmer Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map(f => (
            <div key={f.id} className="card p-5 border border-gray-100 hover:border-blue-200 transition-colors space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-800 text-sm">
                    {f.name.split(' ').map(w => w[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">{f.name}</h3>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {f.village}, {f.taluka}
                    </p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getRiskBgClass(f.riskStatus)}`}>
                  {f.riskStatus.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 p-3 rounded-xl">
                <div>
                  <span className="text-gray-400 block">Cultivated Crop:</span>
                  <span className="font-semibold text-gray-800">{f.crop}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Land Area:</span>
                  <span className="font-semibold text-gray-800">{f.acres} Acres</span>
                </div>
                <div className="col-span-2 pt-1 border-t border-gray-200/60 flex justify-between">
                  <span className="text-gray-400">Last Extension Visit:</span>
                  <span className="font-medium text-gray-700">{f.lastVisit}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <a
                  href={`tel:${f.phone.replace(/\s+/g, '')}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
                >
                  <Phone className="w-3.5 h-3.5" /> Call ({f.phone})
                </a>
                <button
                  onClick={() => toast.success(`Field visit request created for ${f.name}!`)}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                >
                  Schedule Visit
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Enroll Farmer */}
        {showAdd && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 animate-slideUp">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <h3 className="text-lg font-bold text-gray-900">Enroll Farmer in Extension Area</h3>
                <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateFarmer} className="space-y-4 text-sm">
                <div>
                  <label className="field-label">Full Name *</label>
                  <input
                    required
                    value={newFarmer.name}
                    onChange={e => setNewFarmer({ ...newFarmer, name: e.target.value })}
                    placeholder="e.g., Anandrao Shinde"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="field-label">Phone Number *</label>
                  <input
                    required
                    type="tel"
                    value={newFarmer.phone}
                    onChange={e => setNewFarmer({ ...newFarmer, phone: e.target.value })}
                    placeholder="+91 98765 00000"
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="field-label">Village</label>
                    <input
                      required
                      value={newFarmer.village}
                      onChange={e => setNewFarmer({ ...newFarmer, village: e.target.value })}
                      placeholder="e.g., Koregaon"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="field-label">Taluka</label>
                    <input
                      value={newFarmer.taluka}
                      onChange={e => setNewFarmer({ ...newFarmer, taluka: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="field-label">Main Crop</label>
                    <input
                      value={newFarmer.crop}
                      onChange={e => setNewFarmer({ ...newFarmer, crop: e.target.value })}
                      placeholder="e.g., Rice, Soybean"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="field-label">Land Size (Acres)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={newFarmer.acres}
                      onChange={e => setNewFarmer({ ...newFarmer, acres: Number(e.target.value) })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 btn-primary bg-blue-700 hover:bg-blue-800 py-2.5">
                    Save Farmer
                  </button>
                  <button type="button" onClick={() => setShowAdd(false)} className="flex-1 btn-outline py-2.5">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ExtensionLayout>
  );
}

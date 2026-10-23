'use client';

import { useState } from 'react';
import ExtensionLayout from '@/components/layout/ExtensionLayout';
import { DEMO_CASES } from '@/lib/mockData';
import { getRiskBgClass } from '@/lib/riskEngine';
import { ClipboardList, Search, Filter, CheckCircle2, AlertTriangle, Clock, ArrowRight, X } from 'lucide-react';
import { toast } from 'sonner';
import type { Case } from '@/types';

export default function ExtensionCasesPage() {
  const [cases, setCases] = useState<Case[]>(DEMO_CASES);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [updateStatus, setUpdateStatus] = useState<Case['status']>('in_progress');
  const [fieldNotes, setFieldNotes] = useState('');

  const filtered = cases.filter(c => {
    const matchStatus = filterStatus === 'all' || c.status === filterStatus;
    const matchSearch = c.farmerName.toLowerCase().includes(search.toLowerCase()) ||
      c.crop.toLowerCase().includes(search.toLowerCase()) ||
      c.problem.toLowerCase().includes(search.toLowerCase()) ||
      c.village.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleUpdateCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase) return;

    const updated = cases.map(c => {
      if (c.id === selectedCase.id) {
        return {
          ...c,
          status: updateStatus,
          updatedAt: new Date().toISOString().split('T')[0],
        };
      }
      return c;
    });

    setCases(updated);
    toast.success(`Case ${selectedCase.id} status updated to "${updateStatus}"!`);
    setSelectedCase(null);
    setFieldNotes('');
  };

  const getStatusBadge = (status: Case['status']) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-700 border-red-200';
      case 'in_progress': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'resolved': return 'bg-green-100 text-green-700 border-green-200';
      case 'escalated': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <ExtensionLayout>
      <div className="p-4 lg:p-6 space-y-6 max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <ClipboardList className="w-6 h-6 text-blue-700" /> Extension Case Tracking
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Triage and resolve farmer reported crop infections, pest warnings, and field verification requests.
            </p>
          </div>
          <div className="flex gap-2">
            <span className="text-xs bg-red-100 text-red-700 font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {cases.filter(c => c.status === 'open').length} Open Cases
            </span>
          </div>
        </div>

        {/* Filter controls */}
        <div className="card p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex items-center gap-2 w-full sm:w-72 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3" />
            <input
              type="text"
              placeholder="Search case, problem, farmer..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-9 py-2 text-sm"
            />
          </div>
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
            {['all', 'open', 'in_progress', 'resolved', 'escalated'].map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                  filterStatus === st
                    ? 'bg-blue-700 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Case List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="card p-12 text-center">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h3 className="font-bold text-gray-800 text-base">No cases matching this criteria</h3>
              <p className="text-gray-400 text-xs mt-1">All reports in this view have been processed.</p>
            </div>
          ) : (
            filtered.map(c => (
              <div
                key={c.id}
                className="card p-5 border border-gray-100 hover:border-blue-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{c.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(c.status)}`}>
                      {c.status.toUpperCase().replace('_', ' ')}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getRiskBgClass(c.riskLevel)}`}>
                      {c.riskLevel.toUpperCase()} RISK
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-base">{c.problem}</h3>
                  <p className="text-xs text-gray-500">
                    Farmer: <strong className="text-gray-800">{c.farmerName}</strong> · Village: <span className="text-gray-700">{c.village}</span> · Crop: <span className="text-gray-700 font-medium">{c.crop}</span>
                  </p>
                  <p className="text-[11px] text-gray-400">Created: {c.createdAt.split('T')[0]} · Last Update: {c.updatedAt.split('T')[0]}</p>
                </div>

                <div className="flex items-center gap-2 self-start md:self-auto">
                  <button
                    onClick={() => {
                      setSelectedCase(c);
                      setUpdateStatus(c.status);
                    }}
                    className="btn-primary bg-blue-700 hover:bg-blue-800 text-xs py-2 px-4 shadow-sm"
                  >
                    Manage Case →
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal: Update Case */}
        {selectedCase && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 animate-slideUp">
              <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Update Case {selectedCase.id}</h3>
                  <p className="text-xs text-gray-500">{selectedCase.farmerName} — {selectedCase.crop}</p>
                </div>
                <button onClick={() => setSelectedCase(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateCase} className="space-y-4 text-sm">
                <div>
                  <label className="field-label">Workflow Status</label>
                  <select
                    value={updateStatus}
                    onChange={e => setUpdateStatus(e.target.value as any)}
                    className="input-field"
                  >
                    <option value="open">Open (Awaiting inspection)</option>
                    <option value="in_progress">In Progress (Field visit scheduled)</option>
                    <option value="resolved">Resolved (Advisory applied)</option>
                    <option value="escalated">Escalated (Referred to KVK expert)</option>
                  </select>
                </div>

                <div>
                  <label className="field-label">Field Notes / Extension Log</label>
                  <textarea
                    rows={3}
                    value={fieldNotes}
                    onChange={e => setFieldNotes(e.target.value)}
                    placeholder="Enter visit observations, IPM measures advised, or lab sample IDs..."
                    className="input-field"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button type="submit" className="flex-1 btn-primary bg-blue-700 hover:bg-blue-800 py-2.5">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCase(null)}
                    className="flex-1 btn-outline py-2.5"
                  >
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

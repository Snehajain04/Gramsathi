'use client';

import { useState } from 'react';
import ExtensionLayout from '@/components/layout/ExtensionLayout';
import { DEMO_FIELD_VISITS, DEMO_FARMS } from '@/lib/mockData';
import { FileText, Plus, CheckCircle2, Calendar, MapPin, UserCheck, X } from 'lucide-react';
import { toast } from 'sonner';
import type { FieldVisit } from '@/types';

export default function ExtensionReportsPage() {
  const [visits, setVisits] = useState<FieldVisit[]>(DEMO_FIELD_VISITS);
  const [showModal, setShowModal] = useState(false);
  const [farmerName, setFarmerName] = useState('Ramesh Patil');
  const [farmName, setFarmName] = useState('Patil Rice Farm');
  const [observations, setObservations] = useState('');
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe'>('moderate');
  const [notes, setNotes] = useState('');

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!observations.trim()) {
      toast.error('Please enter field observations.');
      return;
    }

    const created: FieldVisit = {
      id: `fv_${Date.now()}`,
      extensionWorkerId: 'u2',
      extensionWorkerName: 'Suresh Kumar',
      farmId: 'f1',
      farmName,
      farmerName,
      status: 'completed',
      scheduledDate: new Date().toISOString().split('T')[0],
      completedDate: new Date().toISOString().split('T')[0],
      observations: observations.trim(),
      severity,
      images: [],
      notes: notes.trim() || 'Routine inspection completed.',
    };

    setVisits([created, ...visits]);
    toast.success(`Field visit report submitted for ${farmerName}!`);
    setShowModal(false);
    setObservations('');
    setNotes('');
  };

  return (
    <ExtensionLayout>
      <div className="p-4 lg:p-6 space-y-6 max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-700" /> Field Visit Reports & Logs
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Submit farm observation audits, crop progress notes, and diagnostic ground-truthing records.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary bg-blue-700 hover:bg-blue-800 flex items-center gap-2 text-sm shadow-sm self-start"
          >
            <Plus className="w-4 h-4" /> Log Field Inspection
          </button>
        </div>

        {/* Visit Logbook */}
        <div className="space-y-3">
          {visits.map(v => (
            <div key={v.id} className="card p-5 border border-gray-100 hover:border-blue-200 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs text-gray-400">{v.id}</span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      v.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : v.status === 'scheduled'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {v.status.toUpperCase()}
                    </span>
                    {v.completedDate && <span className="text-xs text-gray-400">📅 Completed: {v.completedDate}</span>}
                  </div>
                  <h3 className="font-bold text-gray-900 text-base">{v.farmerName} — {v.farmName}</h3>
                  <p className="text-xs text-gray-600">
                    Observation: <span className="text-gray-800 font-medium">{v.observations || 'Field visit completed. No acute crop disease observed.'}</span>
                  </p>
                  <p className="text-xs text-blue-700">Notes: {v.notes}</p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    onClick={() => toast.success(`Report ${v.id} downloaded`)}
                    className="text-xs px-3 py-1.5 bg-gray-50 text-gray-700 font-semibold rounded-lg hover:bg-gray-100"
                  >
                    Download Log
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Log Visit */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 animate-slideUp">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <h3 className="text-lg font-bold text-gray-900">Submit Field Inspection Report</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateReport} className="space-y-4 text-sm">
                <div>
                  <label className="field-label">Farmer Name *</label>
                  <input
                    required
                    value={farmerName}
                    onChange={e => setFarmerName(e.target.value)}
                    placeholder="e.g., Ramesh Patil"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="field-label">Farm Parcel</label>
                  <input
                    required
                    value={farmName}
                    onChange={e => setFarmName(e.target.value)}
                    placeholder="e.g., Patil Rice Field"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="field-label">Field Observations & Symptoms *</label>
                  <textarea
                    required
                    rows={3}
                    value={observations}
                    onChange={e => setObservations(e.target.value)}
                    placeholder="Record leaf condition, pest count on traps, soil moisture..."
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="field-label">Assessed Severity</label>
                  <select
                    value={severity}
                    onChange={e => setSeverity(e.target.value as any)}
                    className="input-field"
                  >
                    <option value="mild">Mild (&lt;5% crop affected)</option>
                    <option value="moderate">Moderate (5-20% crop affected)</option>
                    <option value="severe">Severe (&gt;20% crop affected)</option>
                  </select>
                </div>

                <div>
                  <label className="field-label">Recommended Action / Follow-up</label>
                  <input
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="e.g., Bio-fungicide spray advised; revisit in 5 days"
                    className="input-field"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 btn-primary bg-blue-700 hover:bg-blue-800 py-2.5">
                    Save Field Report
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 btn-outline py-2.5">
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

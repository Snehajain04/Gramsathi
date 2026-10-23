'use client';

import { useState } from 'react';
import ExpertLayout from '@/components/layout/ExpertLayout';
import { BookOpen, Plus, Send, CheckCircle2, AlertCircle, X, Shield, Filter } from 'lucide-react';
import { toast } from 'sonner';

const INITIAL_ADVISORIES = [
  { id: 'ADV-201', title: 'Managing Rice Leaf Blast in Tillering Phase', crop: 'Rice', region: 'Pune, Nashik', priority: 'HIGH', date: '2024-08-05', author: 'Dr. Priya Sharma', status: 'Published', reach: '2,840 farmers' },
  { id: 'ADV-198', title: 'Fall Armyworm Cultural & Biocontrol Protocol', crop: 'Maize', region: 'All Maharashtra', priority: 'HIGH', date: '2024-08-03', author: 'Dr. Priya Sharma', status: 'Published', reach: '4,120 farmers' },
  { id: 'ADV-194', title: 'Early Blight Management on Staked Tomatoes', crop: 'Tomato', region: 'Western Maharashtra', priority: 'MEDIUM', date: '2024-07-29', author: 'Dr. A. K. Verma', status: 'Published', reach: '1,350 farmers' },
  { id: 'ADV-190', title: 'Preventing Tikka Disease in Groundnut Crops', crop: 'Groundnut', region: 'Marathwada', priority: 'LOW', date: '2024-07-22', author: 'Dr. Priya Sharma', status: 'Archived', reach: '980 farmers' },
];

export default function ExpertAdvisoriesPage() {
  const [advisories, setAdvisories] = useState(INITIAL_ADVISORIES);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [crop, setCrop] = useState('Rice');
  const [region, setRegion] = useState('Pune, Maharashtra');
  const [priority, setPriority] = useState('HIGH');
  const [content, setContent] = useState('');

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error('Please provide advisory title and management guidelines.');
      return;
    }

    const created = {
      id: `ADV-${Date.now().toString().slice(-3)}`,
      title: title.trim(),
      crop,
      region,
      priority,
      date: new Date().toISOString().split('T')[0],
      author: 'Dr. Priya Sharma',
      status: 'Published',
      reach: '~1,500 farmers',
    };

    setAdvisories([created, ...advisories]);
    toast.success(`Advisory "${created.title}" published to farmers in ${region}!`);
    setShowModal(false);
    setTitle('');
    setContent('');
  };

  return (
    <ExpertLayout>
      <div className="p-4 lg:p-6 space-y-6 max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-purple-700" /> Agricultural Advisories
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Draft and broadcast scientific IPM management advisories to registered farmers and field workers.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary bg-purple-700 hover:bg-purple-800 flex items-center gap-2 text-sm shadow-sm self-start"
          >
            <Plus className="w-4 h-4" /> Issue New Advisory
          </button>
        </div>

        {/* Advisory List */}
        <div className="space-y-3">
          {advisories.map(adv => (
            <div key={adv.id} className="card p-5 border border-gray-100 hover:border-purple-200 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-gray-400">{adv.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      adv.priority === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {adv.priority} PRIORITY
                    </span>
                    <span className="text-xs text-gray-400">📅 {adv.date}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-base">{adv.title}</h3>
                  <p className="text-xs text-gray-500">
                    Crop: <strong className="text-gray-700">{adv.crop}</strong> · Target Region: <strong className="text-gray-700">{adv.region}</strong>
                  </p>
                  <p className="text-xs text-purple-700 font-medium">Issued by: {adv.author} · Reach: {adv.reach}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toast.info(`Viewing advisory ${adv.id}...`)}
                    className="text-xs px-3 py-1.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => toast.success(`Advisory broadcast refreshed for ${adv.region}`)}
                    className="text-xs px-3 py-1.5 bg-purple-100 text-purple-700 font-semibold rounded-lg hover:bg-purple-200"
                  >
                    Re-broadcast
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: New Advisory */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 animate-slideUp my-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <h3 className="text-lg font-bold text-gray-900">Issue Expert Crop Advisory</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handlePublish} className="space-y-4 text-sm">
                <div>
                  <label className="field-label">Advisory Headline *</label>
                  <input
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g., Immediate Preventive Action for Leaf Blast"
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="field-label">Target Crop</label>
                    <select
                      value={crop}
                      onChange={e => setCrop(e.target.value)}
                      className="input-field"
                    >
                      <option>Rice</option>
                      <option>Maize</option>
                      <option>Cotton</option>
                      <option>Soybean</option>
                      <option>Tomato</option>
                      <option>Wheat</option>
                    </select>
                  </div>
                  <div>
                    <label className="field-label">Priority</label>
                    <select
                      value={priority}
                      onChange={e => setPriority(e.target.value)}
                      className="input-field"
                    >
                      <option value="HIGH">HIGH (Urgent)</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="LOW">LOW (Routine)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="field-label">Target Districts / Region *</label>
                  <input
                    required
                    value={region}
                    onChange={e => setRegion(e.target.value)}
                    placeholder="e.g., Pune, Nashik, Ahmednagar"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="field-label">Scientific Management Guidelines *</label>
                  <textarea
                    required
                    rows={4}
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder="Detail step-by-step cultural, mechanical, and bio-control actions..."
                    className="input-field"
                  />
                </div>

                <div className="bg-purple-50 rounded-xl p-3 text-xs text-purple-800 flex items-start gap-2">
                  <Shield className="w-4 h-4 flex-shrink-0 mt-0.5 text-purple-700" />
                  <p>Advisories are automatically translated into 9 Indian languages and delivered to farmer notification centers and extension teams.</p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 btn-primary bg-purple-700 hover:bg-purple-800 py-2.5">
                    Publish Advisory
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
    </ExpertLayout>
  );
}

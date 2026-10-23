'use client';

import { useState, useEffect } from 'react';
import FarmerLayout from '@/components/layout/FarmerLayout';
import { DEMO_FARMS, DEMO_CROPS, ALL_CROPS, CROP_STAGES } from '@/lib/mockData';
import { getRiskBgClass } from '@/lib/riskEngine';
import { toast } from 'sonner';
import { Tractor, Plus, MapPin, Droplets, Layers, Calendar, Wheat, CheckCircle2, X } from 'lucide-react';
import SoilIntelligenceCard from '@/components/SoilIntelligenceCard';
import AIFarmPredictionCard from '@/components/AIFarmPredictionCard';
import type { Farm, Crop, RiskLevel } from '@/types';

const STORAGE_KEY_FARMS = 'gramsathi_custom_farms';
const STORAGE_KEY_CROPS = 'gramsathi_custom_crops';

export default function MyFarmsPage() {
  const [farms, setFarms] = useState<Farm[]>(DEMO_FARMS);
  const [crops, setCrops] = useState<Crop[]>(DEMO_CROPS);
  const [showAddCrop, setShowAddCrop] = useState(false);
  const [showAddFarm, setShowAddFarm] = useState(false);
  const [selectedFarmId, setSelectedFarmId] = useState<string>(DEMO_FARMS[0].id);

  // New Farm Form State
  const [newFarm, setNewFarm] = useState({
    name: '',
    district: 'Pune',
    taluka: '',
    village: '',
    area: 2.5,
    areaUnit: 'acres' as 'acres' | 'hectares',
    soilType: 'Black Cotton Soil',
    irrigationType: 'Drip',
  });

  // New Crop Form State
  const [newCrop, setNewCrop] = useState({
    name: 'Rice',
    variety: 'IR-64',
    growthStage: 'Tillering',
    plantingDate: new Date().toISOString().split('T')[0],
    expectedHarvestDate: '',
  });

  useEffect(() => {
    try {
      const storedFarms = localStorage.getItem(STORAGE_KEY_FARMS) || localStorage.getItem('cropshield_custom_farms');
      if (storedFarms) {
        const parsed: Farm[] = JSON.parse(storedFarms);
        setFarms([...DEMO_FARMS, ...parsed]);
      }
      const storedCrops = localStorage.getItem(STORAGE_KEY_CROPS) || localStorage.getItem('cropshield_custom_crops');
      if (storedCrops) {
        const parsed: Crop[] = JSON.parse(storedCrops);
        setCrops([...DEMO_CROPS, ...parsed]);
      }
    } catch {
      // fallback to mock data
    }
  }, []);

  const handleCreateFarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFarm.name.trim()) {
      toast.error('Please enter a farm name');
      return;
    }

    const created: Farm = {
      id: `farm_${Date.now()}`,
      farmerId: 'u1',
      name: newFarm.name.trim(),
      location: `${newFarm.village || 'Village'}, ${newFarm.district}, Maharashtra`,
      lat: 18.5204 + (Math.random() - 0.5) * 0.5,
      lng: 73.8567 + (Math.random() - 0.5) * 0.5,
      area: Number(newFarm.area) || 1,
      areaUnit: newFarm.areaUnit,
      soilType: newFarm.soilType,
      irrigationType: newFarm.irrigationType,
      state: 'Maharashtra',
      district: newFarm.district,
      taluka: newFarm.taluka || 'Haveli',
      village: newFarm.village || 'Koregaon',
      healthStatus: 'low' as RiskLevel,
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updated = [...farms, created];
    setFarms(updated);
    try {
      const customOnly = updated.filter(f => !DEMO_FARMS.some(df => df.id === f.id));
      localStorage.setItem(STORAGE_KEY_FARMS, JSON.stringify(customOnly));
    } catch {}

    toast.success(`Farm "${created.name}" added successfully!`);
    setShowAddFarm(false);
    setSelectedFarmId(created.id);
    setNewFarm({
      name: '',
      district: 'Pune',
      taluka: '',
      village: '',
      area: 2.5,
      areaUnit: 'acres',
      soilType: 'Black Cotton Soil',
      irrigationType: 'Drip',
    });
  };

  const handleCreateCrop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCrop.name) {
      toast.error('Please choose a crop');
      return;
    }

    const created: Crop = {
      id: `crop_${Date.now()}`,
      farmId: selectedFarmId,
      name: newCrop.name,
      variety: newCrop.variety || 'Standard Variety',
      growthStage: newCrop.growthStage || 'Vegetative',
      plantingDate: newCrop.plantingDate,
      expectedHarvestDate: newCrop.expectedHarvestDate || new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
      status: 'active',
    };

    const updated = [...crops, created];
    setCrops(updated);
    try {
      const customOnly = updated.filter(c => !DEMO_CROPS.some(dc => dc.id === c.id));
      localStorage.setItem(STORAGE_KEY_CROPS, JSON.stringify(customOnly));
    } catch {}

    toast.success(`Crop ${created.name} added to selected farm!`);
    setShowAddCrop(false);
  };

  const activeFarm = farms.find(f => f.id === selectedFarmId) || farms[0];
  const farmCrops = crops.filter(c => c.farmId === activeFarm?.id);
  const totalAcres = farms.reduce((acc, f) => acc + (f.areaUnit === 'acres' ? f.area : f.area * 2.47), 0);

  return (
    <FarmerLayout>
      <div className="p-4 lg:p-6 space-y-6 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Tractor className="w-6 h-6 text-green-600" /> My Farm Parcels
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Manage farm land, irrigation, soil profiles, and standing crop lifecycle.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddFarm(true)}
              className="btn-primary flex items-center gap-2 shadow-sm text-sm"
            >
              <Plus className="w-4 h-4" /> Add Farm
            </button>
            <button
              onClick={() => setShowAddCrop(true)}
              className="btn-outline flex items-center gap-2 text-sm"
            >
              <Wheat className="w-4 h-4" /> Add Crop
            </button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="card p-4 border border-green-100 bg-green-50/50">
            <p className="text-xs text-green-700 font-semibold uppercase">Total Parcels</p>
            <p className="text-2xl font-black text-green-900 mt-1">{farms.length}</p>
            <p className="text-xs text-green-600 mt-0.5">Registered plots</p>
          </div>
          <div className="card p-4 border border-blue-100 bg-blue-50/50">
            <p className="text-xs text-blue-700 font-semibold uppercase">Total Land Area</p>
            <p className="text-2xl font-black text-blue-900 mt-1">{totalAcres.toFixed(1)} <span className="text-sm font-normal">Acres</span></p>
            <p className="text-xs text-blue-600 mt-0.5">Under cultivation</p>
          </div>
          <div className="card p-4 border border-amber-100 bg-amber-50/50">
            <p className="text-xs text-amber-700 font-semibold uppercase">Standing Crops</p>
            <p className="text-2xl font-black text-amber-900 mt-1">{crops.filter(c => c.status === 'active').length}</p>
            <p className="text-xs text-amber-600 mt-0.5">Active monitoring</p>
          </div>
          <div className="card p-4 border border-purple-100 bg-purple-50/50">
            <p className="text-xs text-purple-700 font-semibold uppercase">Overall Health</p>
            <p className="text-2xl font-black text-purple-900 mt-1">78%</p>
            <p className="text-xs text-purple-600 mt-0.5">AI crop index</p>
          </div>
        </div>

        {/* Farm Selector Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-200">
          {farms.map(f => (
            <button
              key={f.id}
              onClick={() => setSelectedFarmId(f.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
                selectedFarmId === f.id
                  ? 'bg-green-700 text-white shadow-sm'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Tractor className="w-4 h-4" />
              <span>{f.name}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${selectedFarmId === f.id ? 'bg-white/20 text-white' : getRiskBgClass(f.healthStatus)}`}>
                {f.healthStatus.toUpperCase()}
              </span>
            </button>
          ))}
        </div>

        {/* Active Farm Detail Card */}
        {activeFarm && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left: Farm metadata */}
            <div className="lg:col-span-1 space-y-4">
              <div className="card p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{activeFarm.name}</h2>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      {activeFarm.location}
                    </p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getRiskBgClass(activeFarm.healthStatus)}`}>
                    {activeFarm.healthStatus.toUpperCase()} RISK
                  </span>
                </div>

                <div className="border-t border-gray-100 pt-3 space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 flex items-center gap-1.5"><Layers className="w-4 h-4 text-gray-400" /> Parcel Size:</span>
                    <span className="font-semibold text-gray-800">{activeFarm.area} {activeFarm.areaUnit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 flex items-center gap-1.5"><Wheat className="w-4 h-4 text-gray-400" /> Soil Type:</span>
                    <span className="font-semibold text-gray-800">{activeFarm.soilType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 flex items-center gap-1.5"><Droplets className="w-4 h-4 text-gray-400" /> Irrigation:</span>
                    <span className="font-semibold text-gray-800">{activeFarm.irrigationType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 flex items-center gap-1.5"><Calendar className="w-4 h-4 text-gray-400" /> Added Date:</span>
                    <span className="font-semibold text-gray-800">{activeFarm.createdAt}</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-500 space-y-1">
                  <p><strong>GPS Coordinates:</strong> {activeFarm.lat.toFixed(4)}° N, {activeFarm.lng.toFixed(4)}° E</p>
                  <p><strong>District:</strong> {activeFarm.district} · <strong>Taluka:</strong> {activeFarm.taluka}</p>
                </div>
              </div>

              <div className="card p-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
                <h3 className="font-bold text-green-900 text-sm flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-green-700" /> KVK Field Support
                </h3>
                <p className="text-green-800 text-xs leading-relaxed">
                  This plot is linked to Krishi Vigyan Kendra Pune for automated pest threshold monitoring and free soil testing support.
                </p>
              </div>
            </div>

            {/* Right: Crops & Soil AI Predictions */}
            <div className="lg:col-span-2 space-y-4">
              {/* Feature 1 & 17: Crop Health Digital Twin & Multi-Factor Risk Index */}
              <div className="card p-5 border border-emerald-200 bg-gradient-to-br from-white to-emerald-50/40 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                      🌱 Crop Health Digital Twin — {activeFarm.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Combines crop stage ({farmCrops[0]?.growthStage || 'Tillering'}) + variety ({farmCrops[0]?.variety || 'IR-64'}) + soil ({activeFarm.soilType}) + weather + history.
                    </p>
                  </div>
                  <div className="text-right bg-emerald-100 px-3 py-1.5 rounded-2xl border border-emerald-200">
                    <span className="text-[10px] text-emerald-800 font-bold block uppercase">Field Health Index</span>
                    <span className="text-xl font-black text-emerald-950">78<span className="text-xs text-emerald-700 font-normal">/100</span></span>
                  </div>
                </div>

                {/* Multi-Factor Risk Index Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                  <div className="p-2.5 bg-red-50 rounded-xl border border-red-200">
                    <span className="text-[10px] text-red-600 block uppercase font-medium">Disease Risk</span>
                    <span className="font-extrabold text-red-900 text-sm">72/100</span>
                  </div>
                  <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200">
                    <span className="text-[10px] text-amber-600 block uppercase font-medium">Pest Risk</span>
                    <span className="font-extrabold text-amber-900 text-sm">48/100</span>
                  </div>
                  <div className="p-2.5 bg-red-50 rounded-xl border border-red-200">
                    <span className="text-[10px] text-red-600 block uppercase font-medium">Weather Risk</span>
                    <span className="font-extrabold text-red-900 text-sm">81/100</span>
                  </div>
                  <div className="p-2.5 bg-green-50 rounded-xl border border-green-200">
                    <span className="text-[10px] text-green-600 block uppercase font-medium">Soil Health</span>
                    <span className="font-extrabold text-green-900 text-sm">35/100</span>
                  </div>
                  <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-amber-600 block uppercase font-medium">Crop Stress</span>
                    <span className="font-extrabold text-amber-900 text-sm">59/100</span>
                  </div>
                </div>

                {/* Feature 8: Smart Advisory 7-Day Action Plan Timeline */}
                <div className="pt-2 space-y-2 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide flex items-center gap-1.5">
                    👨‍🌾 Smart 7-Day Action Plan & Follow-Up Timeline:
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px]">
                    <div className="p-2 bg-white rounded-xl border border-gray-200">
                      <span className="font-bold text-emerald-700 block">Today</span>
                      <span>📷 Inspect 5 random tillers</span>
                    </div>
                    <div className="p-2 bg-white rounded-xl border border-gray-200">
                      <span className="font-bold text-blue-700 block">Tomorrow</span>
                      <span>🌧️ Check field drainage</span>
                    </div>
                    <div className="p-2 bg-white rounded-xl border border-gray-200">
                      <span className="font-bold text-amber-700 block">Day 3</span>
                      <span>🔍 Re-scan leaf spots</span>
                    </div>
                    <div className="p-2 bg-white rounded-xl border border-gray-200">
                      <span className="font-bold text-purple-700 block">Day 5</span>
                      <span>📸 Upload follow-up photo</span>
                    </div>
                    <div className="p-2 bg-white rounded-xl border border-gray-200 col-span-2 sm:col-span-1">
                      <span className="font-bold text-teal-700 block">Day 7</span>
                      <span>✅ Health reassessment</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Prediction & Telemetry Card */}
              <AIFarmPredictionCard
                farmName={activeFarm.name}
                soilType={activeFarm.soilType}
                cropName={farmCrops[0]?.name || 'Rice'}
                area={activeFarm.area}
                areaUnit={activeFarm.areaUnit}
                district={activeFarm.district}
              />

              {/* AI Soil Health Predictions & Precautions */}
              <SoilIntelligenceCard
                soilType={activeFarm.soilType}
                irrigationType={activeFarm.irrigationType}
                district={activeFarm.district}
                farmName={activeFarm.name}
              />

              <div className="card p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Crops on this parcel</h3>
                    <p className="text-gray-500 text-xs">Lifecycle progress and predicted harvest dates</p>
                  </div>
                  <button
                    onClick={() => setShowAddCrop(true)}
                    className="text-xs px-3 py-1.5 bg-green-50 text-green-700 font-semibold rounded-lg hover:bg-green-100 transition-colors"
                  >
                    + Plant New Crop
                  </button>
                </div>

                {farmCrops.length === 0 ? (
                  <div className="text-center py-10 border border-dashed border-gray-200 rounded-2xl">
                    <Wheat className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="font-medium text-gray-600 text-sm">No crops recorded on this parcel yet.</p>
                    <button
                      onClick={() => setShowAddCrop(true)}
                      className="mt-3 btn-primary text-xs py-2 px-4"
                    >
                      Plant a Crop Now
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {farmCrops.map(c => (
                      <div key={c.id} className="border border-gray-200 rounded-2xl p-4 hover:border-green-300 transition-colors bg-white">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-xl">
                              🌾
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-800 text-base">{c.name}</h4>
                              <p className="text-gray-500 text-xs">Variety: <span className="font-medium text-gray-700">{c.variety}</span></p>
                            </div>
                          </div>
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                            {c.growthStage}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 pt-3 border-t border-gray-100 text-xs">
                          <div>
                            <span className="text-gray-400 block">Sowing Date:</span>
                            <span className="font-semibold text-gray-700">{c.plantingDate}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block">Expected Harvest:</span>
                            <span className="font-semibold text-gray-700">{c.expectedHarvestDate}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block">Status:</span>
                            <span className="font-semibold text-green-700 capitalize">{c.status}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal: Add Farm */}
        {showAddFarm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl animate-slideUp">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Add New Farm Parcel</h3>
                <button onClick={() => setShowAddFarm(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateFarm} className="space-y-4 text-sm">
                <div>
                  <label className="field-label">Farm Name *</label>
                  <input
                    required
                    value={newFarm.name}
                    onChange={e => setNewFarm({ ...newFarm, name: e.target.value })}
                    placeholder="e.g., Koregaon East Plot"
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="field-label">Area Size *</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={newFarm.area}
                      onChange={e => setNewFarm({ ...newFarm, area: Number(e.target.value) })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="field-label">Unit</label>
                    <select
                      value={newFarm.areaUnit}
                      onChange={e => setNewFarm({ ...newFarm, areaUnit: e.target.value as any })}
                      className="input-field"
                    >
                      <option value="acres">Acres</option>
                      <option value="hectares">Hectares</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="field-label">Soil Type</label>
                    <select
                      value={newFarm.soilType}
                      onChange={e => setNewFarm({ ...newFarm, soilType: e.target.value })}
                      className="input-field"
                    >
                      <option>Black Cotton Soil</option>
                      <option>Red Laterite Soil</option>
                      <option>Alluvial Loam</option>
                      <option>Sandy Loam</option>
                    </select>
                  </div>
                  <div>
                    <label className="field-label">Irrigation Type</label>
                    <select
                      value={newFarm.irrigationType}
                      onChange={e => setNewFarm({ ...newFarm, irrigationType: e.target.value })}
                      className="input-field"
                    >
                      <option>Drip Irrigation</option>
                      <option>Canal Water</option>
                      <option>Sprinkler</option>
                      <option>Rainfed</option>
                      <option>Borewell</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="field-label">District</label>
                    <input
                      value={newFarm.district}
                      onChange={e => setNewFarm({ ...newFarm, district: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="field-label">Taluka</label>
                    <input
                      value={newFarm.taluka}
                      onChange={e => setNewFarm({ ...newFarm, taluka: e.target.value })}
                      placeholder="e.g., Shirur"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="field-label">Village</label>
                    <input
                      value={newFarm.village}
                      onChange={e => setNewFarm({ ...newFarm, village: e.target.value })}
                      placeholder="e.g., Yavat"
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 btn-primary py-2.5">Save Farm Parcel</button>
                  <button type="button" onClick={() => setShowAddFarm(false)} className="flex-1 btn-outline py-2.5">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Add Crop */}
        {showAddCrop && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-slideUp">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Plant New Crop</h3>
                <button onClick={() => setShowAddCrop(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCrop} className="space-y-4 text-sm">
                <div>
                  <label className="field-label">Target Farm</label>
                  <select
                    value={selectedFarmId}
                    onChange={e => setSelectedFarmId(e.target.value)}
                    className="input-field"
                  >
                    {farms.map(f => (
                      <option key={f.id} value={f.id}>{f.name} ({f.district})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="field-label">Crop Type *</label>
                  <select
                    value={newCrop.name}
                    onChange={e => setNewCrop({ ...newCrop, name: e.target.value, growthStage: (CROP_STAGES[e.target.value] || [])[0] || 'Vegetative' })}
                    className="input-field"
                  >
                    {ALL_CROPS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="field-label">Variety / Seed Hybrid</label>
                  <input
                    value={newCrop.variety}
                    onChange={e => setNewCrop({ ...newCrop, variety: e.target.value })}
                    placeholder="e.g., JS-335, IR-64"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="field-label">Current Growth Stage</label>
                  <select
                    value={newCrop.growthStage}
                    onChange={e => setNewCrop({ ...newCrop, growthStage: e.target.value })}
                    className="input-field"
                  >
                    {(CROP_STAGES[newCrop.name] || ['Vegetative', 'Flowering', 'Maturity']).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="field-label">Planting Date</label>
                    <input
                      type="date"
                      value={newCrop.plantingDate}
                      onChange={e => setNewCrop({ ...newCrop, plantingDate: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="field-label">Expected Harvest</label>
                    <input
                      type="date"
                      value={newCrop.expectedHarvestDate}
                      onChange={e => setNewCrop({ ...newCrop, expectedHarvestDate: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 btn-primary py-2.5">Add to Farm</button>
                  <button type="button" onClick={() => setShowAddCrop(false)} className="flex-1 btn-outline py-2.5">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </FarmerLayout>
  );
}

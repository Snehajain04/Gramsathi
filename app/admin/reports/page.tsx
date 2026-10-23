'use client';

import { useState, useMemo } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import {
  FileText,
  Download,
  Filter,
  PlusCircle,
  Calendar,
  Building2,
  TrendingUp,
  ShieldCheck,
  Share2,
  CheckCircle,
  Clock,
  Sparkles,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { toast } from 'sonner';
import { exportToPDF } from '@/lib/pdfExport';

interface AdminReport {
  id: string;
  title: string;
  category: 'Epidemiological' | 'Economic Impact' | 'Field Extension Audit' | 'Meteorological';
  period: string;
  dateGenerated: string;
  fileSize: string;
  author: string;
  status: 'published' | 'draft';
  summary: string;
}

const INITIAL_REPORTS: AdminReport[] = [
  {
    id: 'REP-2024-W32',
    title: 'Kharif 2024 State Epidemiological Surveillance Bulletin #32',
    category: 'Epidemiological',
    period: 'Aug 01 - Aug 07, 2024',
    dateGenerated: '2024-08-07',
    fileSize: '4.8 MB',
    author: 'ICAR-GramSathi Surveillance Cell',
    status: 'published',
    summary: 'Comprehensive analysis of Rice Blast vectors in Pune/Nashik and Fall Armyworm ETL breaches in Marathwada.',
  },
  {
    id: 'REP-2024-ECO',
    title: 'Seasonal Crop Loss Prevention & Economic Impact Assessment',
    category: 'Economic Impact',
    period: 'Kharif 2024 Mid-Season',
    dateGenerated: '2024-08-05',
    fileSize: '6.2 MB',
    author: 'State Directorate of Economics & Statistics',
    status: 'published',
    summary: 'Calculated ₹18.42 Cr protected yield value through early AI diagnosis and 48-hour IPM advisory deployments.',
  },
  {
    id: 'REP-2024-EXT-Q2',
    title: 'Extension Officer Visit SLA & Field Remediation Audit (Q2)',
    category: 'Field Extension Audit',
    period: 'May 01 - Jul 31, 2024',
    dateGenerated: '2024-08-02',
    fileSize: '3.1 MB',
    author: 'Department of Agricultural Extension, MH',
    status: 'published',
    summary: '94.2% on-site visit SLA compliance rate across 420 active field workers. 8,420 physical farm inspections audited.',
  },
  {
    id: 'REP-2024-MET',
    title: 'IMD Agro-Meteorological Risk & Spore Dispersion Model',
    category: 'Meteorological',
    period: 'Aug 08 - Aug 15, 2024 (Forecast)',
    dateGenerated: '2024-08-06',
    fileSize: '2.5 MB',
    author: 'India Meteorological Department (Agri-Met Unit)',
    status: 'published',
    summary: '7-day precipitation and high humidity trajectory forecasting elevated fungal spore transmission in Western Ghats.',
  },
  {
    id: 'REP-2024-RICE',
    title: 'District Rice Blast Hotspot Containment Dossier',
    category: 'Epidemiological',
    period: 'Jul 15 - Aug 05, 2024',
    dateGenerated: '2024-08-05',
    fileSize: '3.9 MB',
    author: 'Pune District Agriculture Taskforce',
    status: 'published',
    summary: 'Detailed GIS cluster mapping, fungicide stock distribution, and farmer advisory compliance tracking in Shirur & Haveli.',
  },
];

export default function AdminReportsPage() {
  const [reports, setReports] = useState<AdminReport[]>(INITIAL_REPORTS);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

  // Form State
  const [reportTitle, setReportTitle] = useState('');
  const [reportCategory, setReportCategory] = useState<AdminReport['category']>('Epidemiological');
  const [reportRegion, setReportRegion] = useState('Maharashtra (All)');
  const [includeAI, setIncludeAI] = useState(true);
  const [includeEconomics, setIncludeEconomics] = useState(true);

  const filteredReports = useMemo(() => {
    if (categoryFilter === 'All') return reports;
    return reports.filter(r => r.category === categoryFilter);
  }, [reports, categoryFilter]);

  const handleDownloadCSV = (report: AdminReport) => {
    const headers = ['Report ID', 'Title', 'Category', 'Period', 'Date Generated', 'File Size', 'Author', 'Status', 'Summary'];
    const row = [
      report.id,
      `"${report.title.replace(/"/g, '""')}"`,
      report.category,
      `"${report.period}"`,
      report.dateGenerated,
      report.fileSize,
      `"${report.author}"`,
      report.status,
      `"${report.summary.replace(/"/g, '""')}"`,
    ];
    const csvContent = [headers.join(','), row.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.id}-GramSathi-Report.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`CSV downloaded: ${report.id}`);
  };

  const handleDownloadPDF = (report: AdminReport) => {
    exportToPDF({
      title: report.title,
      subtitle: report.summary,
      category: report.category,
      author: report.author,
      date: report.dateGenerated,
      filename: `${report.id}-GramSathi-Dossier.pdf`,
      sections: [
        {
          heading: 'Dossier Information & Metadata',
          items: [
            `Report ID: ${report.id}`,
            `Reporting Period: ${report.period}`,
            `Date Generated: ${report.dateGenerated}`,
            `File Size: ${report.fileSize}`,
            `Authoring Body: ${report.author}`
          ]
        },
        {
          heading: 'Executive Agricultural Summary',
          content: report.summary
        },
        {
          heading: 'Surveillance & Remediation Telemetry',
          table: {
            headers: ['District / Region', 'Target Crop', 'Risk Level', 'Field Compliance'],
            rows: [
              ['Pune', 'Rice', 'HIGH (88%)', '94.2% KVK Compliance'],
              ['Nashik', 'Soybean', 'MEDIUM (62%)', '88.5% KVK Compliance'],
              ['Aurangabad', 'Cotton', 'CRITICAL (91%)', '91.0% KVK Compliance']
            ]
          }
        }
      ]
    });
    toast.success(`PDF dossier generated: ${report.id}`);
  };

  const handleDownloadArchive = () => {
    const headers = ['Report ID', 'Title', 'Category', 'Period', 'Date Generated', 'File Size', 'Author', 'Status', 'Summary'];
    const rows = reports.map(r => [
      r.id,
      `"${r.title.replace(/"/g, '""')}"`,
      r.category,
      `"${r.period}"`,
      r.dateGenerated,
      r.fileSize,
      `"${r.author}"`,
      r.status,
      `"${r.summary.replace(/"/g, '""')}"`,
    ].join(','));
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GramSathi-All-Reports-Archive.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Archive downloaded: ${reports.length} dossiers exported`);
  };

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle.trim()) {
      toast.error('Please enter a title for the dossier');
      return;
    }

    const newReport: AdminReport = {
      id: `REP-${Date.now().toString().slice(-6)}`,
      title: reportTitle.trim(),
      category: reportCategory,
      period: 'Custom Date Range',
      dateGenerated: new Date().toISOString().split('T')[0],
      fileSize: '3.4 MB',
      author: 'Govt Administrator (On-Demand)',
      status: 'published',
      summary: `Automated agricultural intelligence compiled for ${reportRegion}. Includes AI telemetric analysis and loss valuations.`,
    };

    setReports(prev => [newReport, ...prev]);
    toast.success(`Dossier "${reportTitle}" compiled and ready for download!`);
    setIsGenerateModalOpen(false);
    setReportTitle('');
  };

  return (
    <AdminLayout>
      <div className="p-4 lg:p-6 space-y-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
              <FileText className="w-6 h-6 text-indigo-600" />
              Statutory Agricultural Dossiers & Impact Reports
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Official ICAR/Government epidemiological bulletins, crop loss mitigation audits, and field compliance reports.
            </p>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleDownloadArchive}
              className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Download className="w-4 h-4 text-slate-500" /> Download Archive (CSV)
            </button>
            <button
              onClick={() => setIsGenerateModalOpen(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all hover:shadow"
            >
              <PlusCircle className="w-4 h-4" /> Generate Custom Dossier
            </button>
          </div>
        </div>

        {/* Economic Impact & Governance Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-xs hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Crop Loss Prevented</p>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-emerald-600 mt-2">₹18.42 Cr</p>
            <p className="text-xs text-slate-500 mt-1 font-medium">Across 14,200 verified interventions</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-xs hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Field Visits Audited</p>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">8,420</p>
            <p className="text-xs text-indigo-600 mt-1 font-semibold">94.2% SLA adherence (&lt;48h response)</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-xs hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Emergency Bulletins</p>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">16 Issued</p>
            <p className="text-xs text-amber-600 mt-1 font-semibold">240,000+ farmers reached via SMS/app</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-xs hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Hotspots Neutralized</p>
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">23 Clusters</p>
            <p className="text-xs text-purple-600 mt-1 font-semibold">Containment confirmed by KVK audits</p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-between flex-wrap gap-2.5 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            {['All', 'Epidemiological', 'Economic Impact', 'Field Extension Audit', 'Meteorological'].map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  categoryFilter === cat
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-500 font-semibold">
            Showing {filteredReports.length} published dossiers
          </span>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReports.map(report => (
            <div
              key={report.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-5 flex flex-col justify-between hover:border-indigo-300 hover:shadow-md transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {report.category}
                  </span>
                  <span className="font-mono text-[11px] text-slate-500 font-medium flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> {report.dateGenerated}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                    {report.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-normal">
                    {report.summary}
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 pt-2 border-t border-slate-100 font-medium">
                  <span>Author: <strong className="text-slate-800 font-semibold">{report.author}</strong></span>
                  <span>•</span>
                  <span>Size: <strong className="text-slate-800 font-semibold">{report.fileSize}</strong></span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-4 mt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
                  <CheckCircle className="w-4 h-4 text-emerald-600" /> Official Validated Dossier
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownloadCSV(report)}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 border border-slate-300 shadow-xs transition-colors"
                    title="Export CSV dataset"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
                    <span>CSV</span>
                  </button>
                  <button
                    onClick={() => handleDownloadPDF(report)}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
                  >
                    <Download className="w-3.5 h-3.5" /> Download PDF
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Generate Custom Dossier */}
        {isGenerateModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-4 relative shadow-2xl">
              <button
                onClick={() => setIsGenerateModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Generate Custom Dossier</h3>
                  <p className="text-xs text-slate-500">Compile automated ICAR-grade intelligence report</p>
                </div>
              </div>

              <form onSubmit={handleGenerateReport} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Dossier Title</label>
                  <input
                    type="text"
                    required
                    value={reportTitle}
                    onChange={e => setReportTitle(e.target.value)}
                    placeholder="e.g. Pune Division Kharif Blast Containment Report"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Dossier Category</label>
                    <select
                      value={reportCategory}
                      onChange={e => setReportCategory(e.target.value as AdminReport['category'])}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                    >
                      <option value="Epidemiological">Epidemiological</option>
                      <option value="Economic Impact">Economic Impact</option>
                      <option value="Field Extension Audit">Field Extension Audit</option>
                      <option value="Meteorological">Meteorological</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Target Division</label>
                    <select
                      value={reportRegion}
                      onChange={e => setReportRegion(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                    >
                      <option value="Maharashtra (All)">Maharashtra (All)</option>
                      <option value="Pune Division">Pune Division</option>
                      <option value="Nashik Division">Nashik Division</option>
                      <option value="Marathwada Division">Marathwada Division</option>
                      <option value="Vidarbha Division">Vidarbha Division</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <p className="text-xs font-bold text-slate-700">Sections to Include</p>
                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeAI}
                      onChange={e => setIncludeAI(e.target.checked)}
                      className="rounded accent-indigo-600"
                    />
                    <span>AI Diagnostic Telemetry & Model Confidence Metrics</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeEconomics}
                      onChange={e => setIncludeEconomics(e.target.checked)}
                      className="rounded accent-indigo-600"
                    />
                    <span>Yield Value Protection & Economic Loss Mitigation Modeling</span>
                  </label>
                </div>

                <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsGenerateModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Sparkles className="w-4 h-4" /> Compile & Publish
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

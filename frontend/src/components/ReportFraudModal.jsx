import React, { useState } from 'react';
import { X, ShieldAlert, AlertTriangle, CheckCircle2, FileText } from 'lucide-react';
import { api } from '../services/api';

export default function ReportFraudModal({ ngo, isOpen, onClose }) {
  const [reason, setReason] = useState('Misuse of Donated Funds');
  const [details, setDetails] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [ticket, setTicket] = useState('');

  if (!isOpen || !ngo) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!details.trim()) {
      setError('Please provide specific details or evidence regarding the irregularity.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await api.submitFraudReport({
        ngoId: ngo.id,
        reason,
        details: details.trim(),
        reporterName: reporterName.trim() || 'Anonymous Citizen',
        reporterEmail: reporterEmail.trim() || null
      });
      setTicket(res.ticket);
    } catch (err) {
      setError(err.message || 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setTicket('');
    setDetails('');
    setReporterName('');
    setReporterEmail('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-rose-600 text-white">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-white/20 rounded-lg">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Whistleblower Scam Report</h3>
              <p className="text-xs text-rose-100">{ngo.name}</p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="p-1 text-rose-200 hover:text-white rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {ticket ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">Report Lodged with Audit Desk</h4>
              <p className="text-xs text-slate-600 mt-1">
                Your report regarding <strong>{ngo.name}</strong> has been assigned to our statutory investigation queue.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 inline-block font-mono text-xs font-bold text-slate-800">
              Tracking Ticket: <span className="text-rose-600">{ticket}</span>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-xl shadow-xs transition"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Irregularity Category</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500"
              >
                <option value="Misuse of Donated Funds">Misuse or Diversion of Donated Funds</option>
                <option value="Fake or Expired 80G Receipt">Refusal / Fake 80G Tax Exemption Receipt</option>
                <option value="Fictitious Address / Inactive Grounds">Fictitious Address / No Ground Operations</option>
                <option value="Unauthorized Personal UPI Collection">Unauthorized Personal UPI / Bank Collection</option>
                <option value="FCRA Violation / Undisclosed Foreign Inflow">FCRA Violation / Undisclosed Foreign Inflow</option>
                <option value="Other Non-Compliance">Other Non-Compliance</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Details & Evidence Description *
              </label>
              <textarea
                rows="4"
                required
                placeholder="Provide dates, transaction IDs, communication transcripts, or specific discrepancies observed..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500 transition"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Your Name (Optional)</label>
                <input
                  type="text"
                  placeholder="Anonymous"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Your Email (Optional)</label>
                <input
                  type="email"
                  placeholder="For audit updates"
                  value={reporterEmail}
                  onChange={(e) => setReporterEmail(e.target.value)}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-tight">
              Reports are treated confidentially and cross-verified against official audit registries before any status change is published.
            </p>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-xs transition"
            >
              {submitting ? 'Submitting Report...' : 'File Whistleblower Report'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

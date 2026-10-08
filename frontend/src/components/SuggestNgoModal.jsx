import React, { useState } from 'react';
import { X, PlusCircle, Building2, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { INDIA_LOCATIONS, ALL_INDIAN_STATES, ALL_INDIAN_CITIES } from '../data/indiaLocations';
import { useTranslation } from '../context/LanguageContext';

export default function SuggestNgoModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [category, setCategory] = useState('Education');
  const [darpanId, setDarpanId] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [website, setWebsite] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [submitterName, setSubmitterName] = useState('');
  const [submitterEmail, setSubmitterEmail] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !city.trim() || !state.trim()) {
      setError('Please provide the NGO Name, City, and State.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await api.submitSuggestion({
        name: name.trim(),
        city: city.trim(),
        state: state.trim(),
        category,
        darpanId: darpanId.trim() || null,
        registrationNumber: registrationNumber.trim() || null,
        website: website.trim() || null,
        phone: phone.trim() || null,
        email: email.trim() || null,
        reason: reason.trim() || null,
        submitterName: submitterName.trim() || 'Anonymous Contributor',
        submitterEmail: submitterEmail.trim() || null
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to submit suggestion');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSuccess(false);
    setName('');
    setCity('');
    setState('');
    setDarpanId('');
    setRegistrationNumber('');
    setWebsite('');
    setPhone('');
    setEmail('');
    setReason('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-700 text-white">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-white/20 rounded-lg">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">{t('suggest.title')}</h3>
              <p className="text-xs text-emerald-100">{t('suggest.subtitle')}</p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="p-1 text-emerald-200 hover:text-white rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">{t('suggest.success')}</h4>
              <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                Thank you for contributing <strong>{name}</strong>. Our audit officers will cross-check public records on NGO Darpan and Income Tax e-filing before indexing this entity.
              </p>
            </div>
            <button
              onClick={handleReset}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl shadow-xs transition"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-3.5 max-h-[80vh] overflow-y-auto">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('suggest.ngoName')}
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Robin Hood Army"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t('suggest.state')}</label>
                <select
                  required
                  value={state}
                  onChange={(e) => {
                    setState(e.target.value);
                    setCity('');
                  }}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                >
                  <option value="">Select State / UT</option>
                  {ALL_INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t('suggest.city')}</label>
                <input
                  type="text"
                  required
                  list="suggest-cities-list"
                  placeholder="Type or select city..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500"
                />
                <datalist id="suggest-cities-list">
                  {(state ? (INDIA_LOCATIONS.find(s => s.name === state)?.cities || []) : ALL_INDIAN_CITIES).map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t('suggest.category')}</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                >
                  <option value="Education">{t('categories.education')}</option>
                  <option value="Health & Nutrition">{t('categories.health')}</option>
                  <option value="Disaster Relief">{t('categories.disaster')}</option>
                  <option value="Elderly Care">{t('categories.elderly')}</option>
                  <option value="Animal Welfare">{t('categories.animal')}</option>
                  <option value="Women Empowerment">{t('categories.women')}</option>
                  <option value="Rural Development">{t('categories.rural')}</option>
                  <option value="Environment & Wildlife">{t('categories.environment')}</option>
                  <option value="Poverty Alleviation">{t('categories.poverty')}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t('suggest.darpan')}</label>
                <input
                  type="text"
                  placeholder="e.g. MH/2018/0199221"
                  value={darpanId}
                  onChange={(e) => setDarpanId(e.target.value)}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Registration Number</label>
                <input
                  type="text"
                  placeholder="Trust or Society Number"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t('suggest.website')}</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Why should this NGO be listed?
              </label>
              <textarea
                rows="2"
                placeholder="Mention impact, grassroots work, or why you recommend verifying this entity..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Your Name (Optional)</label>
                <input
                  type="text"
                  placeholder="Anonymous"
                  value={submitterName}
                  onChange={(e) => setSubmitterName(e.target.value)}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Your Email (Optional)</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={submitterEmail}
                  onChange={(e) => setSubmitterEmail(e.target.value)}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition mt-2"
            >
              {submitting ? 'Submitting NGO...' : t('suggest.submit')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

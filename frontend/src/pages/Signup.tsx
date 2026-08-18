import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { HeartPulse, ArrowRight, ShieldCheck, UserCheck, User, Lock, Mail, UserPlus, CheckCircle2 } from 'lucide-react';

export const SignupPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setErrorMsg('Please fill in all required registration fields.');
      return;
    }

    setSuccessMsg('Account created successfully! Logging you in...');
    setTimeout(() => {
      login(email, password, selectedRole, fullName);
      if (selectedRole === 'admin') navigate('/admin/dashboard');
      else if (selectedRole === 'doctor') navigate('/doctor/dashboard');
      else navigate('/dashboard');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-3xl border border-slate-700/80 bg-white/95 p-8 shadow-2xl backdrop-blur-xl space-y-6">
        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white shadow-lg shadow-teal-500/30 mx-auto">
            <HeartPulse className="h-7 w-7 animate-pulse" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">CAREflow <span className="text-teal-600">AI</span></h1>
          <p className="text-xs text-slate-500 font-semibold">Create New Portal Account</p>
        </div>

        {/* ROLE SELECTION TABS */}
        <div className="space-y-2">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
            Select Your User Role
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSelectedRole('patient')}
              className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                selectedRole === 'patient'
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300 ring-2 ring-emerald-500/50 font-bold shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className={`p-2 rounded-xl ${selectedRole === 'patient' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                <User className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-black">Patient Role</div>
                <div className="text-[10px] text-slate-500">Triage & Slot Booking</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('doctor')}
              className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                selectedRole === 'doctor'
                  ? 'bg-teal-50 text-teal-900 border-teal-300 ring-2 ring-teal-500/50 font-bold shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className={`p-2 rounded-xl ${selectedRole === 'doctor' ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-black">Doctor Role</div>
                <div className="text-[10px] text-slate-500">Calendar & Slot Mgmt</div>
              </div>
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="rounded-2xl bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-800 font-bold text-center">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs text-emerald-800 font-bold text-center flex items-center justify-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            {successMsg}
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Full Name</label>
            <input
              type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required
              placeholder="e.g. Dr. Sarah Jenkins or Alex Morgan"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Email Address</label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              placeholder="e.g. user@careflow.ai"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Password</label>
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              placeholder="Create a secure password"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 py-3.5 text-xs font-black text-white shadow-lg shadow-teal-600/30 hover:from-teal-700 hover:to-emerald-700 transition-all"
          >
            Create Account & Enter Portal
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-teal-600 hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

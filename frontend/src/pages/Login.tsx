import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { HeartPulse, ArrowRight, ShieldCheck, UserCheck, User, Lock, Mail, KeyRound } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMsg(null);
    if (role === 'admin') {
      setEmail('admin@careflow.ai');
      setPassword('admin123');
    } else if (role === 'doctor') {
      setEmail('doctor@careflow.ai');
      setPassword('doctor123');
    } else {
      setEmail('patient@careflow.ai');
      setPassword('patient123');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email address and password.');
      return;
    }

    const success = login(email, password, selectedRole);
    if (success) {
      let targetRole = selectedRole;
      if (email.includes('admin')) targetRole = 'admin';
      else if (email.includes('doctor') || email.includes('dr.')) targetRole = 'doctor';

      if (targetRole === 'admin') navigate('/admin/dashboard');
      else if (targetRole === 'doctor') navigate('/doctor/dashboard');
      else navigate('/dashboard');
    } else {
      setErrorMsg('Invalid login credentials.');
    }
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
          <p className="text-xs text-slate-500 font-semibold">Healthcare Clinical Triage & Slot Management Portal</p>
        </div>

        {/* ROLE SELECTION TAB BAR */}
        <div className="space-y-2">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
            Select Role to Access Portal
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleRoleSelect('patient')}
              className={`p-3 rounded-2xl border text-center transition-all ${
                selectedRole === 'patient'
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300 ring-2 ring-emerald-500/50 font-bold shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <User className="h-4 w-4 text-emerald-600 mx-auto mb-1" />
              <div className="text-xs font-black">Patient</div>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('doctor')}
              className={`p-3 rounded-2xl border text-center transition-all ${
                selectedRole === 'doctor'
                  ? 'bg-teal-50 text-teal-900 border-teal-300 ring-2 ring-teal-500/50 font-bold shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <UserCheck className="h-4 w-4 text-teal-600 mx-auto mb-1" />
              <div className="text-xs font-black">Doctor</div>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('admin')}
              className={`p-3 rounded-2xl border text-center transition-all ${
                selectedRole === 'admin'
                  ? 'bg-purple-50 text-purple-900 border-purple-300 ring-2 ring-purple-500/50 font-bold shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="h-4 w-4 text-purple-600 mx-auto mb-1" />
              <div className="text-xs font-black">Admin</div>
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="rounded-2xl bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-800 font-bold text-center">
            {errorMsg}
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Email Address</label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              placeholder="e.g. patient@careflow.ai, doctor@careflow.ai, admin@careflow.ai"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Password</label>
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              placeholder="Enter your password"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 py-3.5 text-xs font-black text-white shadow-lg shadow-teal-600/30 hover:from-teal-700 hover:to-emerald-700 transition-all"
          >
            Sign In as {selectedRole.toUpperCase()}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-1">
          Don't have an account?{' '}
          <Link to="/signup" className="font-bold text-teal-600 hover:underline">
            Create Account & Sign Up
          </Link>
        </div>

        {/* Role Credentials Reference Card */}
        <div className="rounded-2xl bg-slate-100 p-4 border border-slate-200 text-[11px] text-slate-600 space-y-2">
          <div className="font-bold text-slate-900 flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-slate-600" />
            Official Role Credentials Reference:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[10px]">
            <div className="p-2 rounded-xl bg-purple-50/80 border border-purple-200 text-purple-950">
              <strong className="block text-purple-800">Admin Role</strong>
              admin@careflow.ai<br/>
              pass: admin123
            </div>
            <div className="p-2 rounded-xl bg-teal-50/80 border border-teal-200 text-teal-950">
              <strong className="block text-teal-800">Doctor Role</strong>
              doctor@careflow.ai<br/>
              pass: doctor123
            </div>
            <div className="p-2 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-950">
              <strong className="block text-emerald-800">Patient Role</strong>
              patient@careflow.ai<br/>
              pass: patient123
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

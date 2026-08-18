import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HeartPulse, LogOut, ShieldCheck, Wifi, Sparkles, User, ChevronDown } from 'lucide-react';
import { UserRole } from '../types';
import { apiClient } from '../api/client';

export const Header: React.FC = () => {
  const { user, role, logout, switchRole } = useAuth();
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkApi = async () => {
      try {
        await apiClient.get('/health');
        setApiOnline(true);
      } catch (err) {
        setApiOnline(false);
      }
    };
    checkApi();
    const interval = setInterval(checkApi, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/90 px-6 backdrop-blur-md transition-all shadow-xs">
      {/* Brand & System Status */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white shadow-md shadow-teal-500/20">
          <HeartPulse className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-slate-900">CAREflow <span className="text-teal-600">AI</span></span>
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-0.5 text-[11px] font-semibold text-teal-700 border border-teal-200">
              <Sparkles className="h-3 w-3 text-teal-500" />
              v1.0 Production Triage
            </span>
          </div>
        </div>
      </div>

      {/* Center Server Status & Role Switcher */}
      <div className="flex items-center gap-4">
        {/* Backend API Ping */}
        <div className="hidden md:flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 text-xs text-slate-600 border border-slate-200">
          <span className={`h-2 w-2 rounded-full ${apiOnline === true ? 'bg-emerald-500 animate-pulse' : apiOnline === false ? 'bg-rose-500' : 'bg-amber-400'}`} />
          <span className="font-medium text-[11px]">
            {apiOnline === true ? 'FastAPI Connected' : apiOnline === false ? 'API Offline' : 'Connecting...'}
          </span>
        </div>

        {/* Interactive Role Switcher Pill */}
        <div className="flex items-center gap-1 rounded-xl border border-slate-200/80 bg-slate-100/70 p-1">
          {(['patient', 'doctor', 'admin'] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => switchRole(r)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                role === r
                  ? 'bg-white text-teal-700 shadow-sm border border-slate-200/50 font-bold'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="h-6 w-[1px] bg-slate-200" />

        {/* User Profile & Working Logout Button */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white font-bold text-xs shadow-sm">
            {user?.full_name?.charAt(0) || 'U'}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-slate-900">{user?.full_name || 'Guest'}</div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-teal-600">{role || 'Logged Out'} Account</div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 px-3 py-1.5 text-xs font-bold text-slate-600 transition-all border border-slate-200/80"
            title="Log Out of Portal"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};

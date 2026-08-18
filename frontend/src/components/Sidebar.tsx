import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Activity, Calendar, FileText, UserCheck,
  Cpu, BarChart3, ShieldCheck, Sparkles, CheckCircle2, Sliders
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { role } = useAuth();

  return (
    <aside className="w-64 border-r border-slate-200/80 bg-white min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between shadow-xs">
      <div className="space-y-6">
        <div>
          <div className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-3">
            {role.toUpperCase()} PORTAL NAVIGATION
          </div>
          <nav className="space-y-1.5">
            {role === 'patient' && (
              <>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-800 shadow-xs border border-teal-200/60 font-bold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  <Activity className="h-4 w-4 text-teal-600 group-hover:scale-110 transition-transform" />
                  Health & AI Triage Intake
                </NavLink>

                <NavLink
                  to="/appointments"
                  className={({ isActive }) =>
                    `group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-800 shadow-xs border border-teal-200/60 font-bold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  <Calendar className="h-4 w-4 text-teal-600 group-hover:scale-110 transition-transform" />
                  Appointments & Slots
                </NavLink>
              </>
            )}

            {role === 'doctor' && (
              <>
                <NavLink
                  to="/doctor/dashboard"
                  className={({ isActive }) =>
                    `group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-800 shadow-xs border border-teal-200/60 font-bold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  <UserCheck className="h-4 w-4 text-teal-600 group-hover:scale-110 transition-transform" />
                  Doctor Triage Overview
                </NavLink>

                <NavLink
                  to="/appointments"
                  className={({ isActive }) =>
                    `group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-800 shadow-xs border border-teal-200/60 font-bold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  <Calendar className="h-4 w-4 text-teal-600 group-hover:scale-110 transition-transform" />
                  Patient Consultations
                </NavLink>
              </>
            )}

            {role === 'admin' && (
              <>
                <NavLink
                  to="/admin/dashboard"
                  className={({ isActive }) =>
                    `group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-800 shadow-xs border border-teal-200/60 font-bold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  <BarChart3 className="h-4 w-4 text-teal-600 group-hover:scale-110 transition-transform" />
                  Platform Analytics
                </NavLink>

                <NavLink
                  to="/admin/models"
                  className={({ isActive }) =>
                    `group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-800 shadow-xs border border-teal-200/60 font-bold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  <Cpu className="h-4 w-4 text-teal-600 group-hover:scale-110 transition-transform" />
                  Current ML Models & Testing
                </NavLink>

                <NavLink
                  to="/predict"
                  className={({ isActive }) =>
                    `group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-800 shadow-xs border border-teal-200/60 font-bold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  <Sliders className="h-4 w-4 text-teal-600 group-hover:scale-110 transition-transform" />
                  Admin Model Sandbox Test
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Model Governance Card (Admin view) */}
      {role === 'admin' && (
        <div className="rounded-2xl border border-teal-200/80 bg-gradient-to-br from-teal-50/80 to-emerald-50/50 p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-bold text-teal-900">
              <ShieldCheck className="h-4 w-4 text-teal-600" />
              Admin Model Registry
            </span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <p className="text-[11px] text-teal-800 leading-relaxed font-medium">
            4 Machine Learning pipelines active. Access to model cards & test suites.
          </p>
        </div>
      )}
    </aside>
  );
};

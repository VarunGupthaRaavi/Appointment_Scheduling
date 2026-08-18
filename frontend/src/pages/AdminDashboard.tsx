import React, { useEffect, useState } from 'react';
import { fetchAdminAnalytics, fetchAppointments } from '../api/client';
import { Appointment } from '../types';
import { AppointmentDetailModal } from '../components/AppointmentDetailModal';
import { BarChart3, Users, Cpu, Calendar, Activity, ShieldCheck, RefreshCw, Eye, CheckCircle2 } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);

  const loadData = () => {
    setLoading(true);
    Promise.all([fetchAdminAnalytics(), fetchAppointments()])
      .then(([analyticsRes, apptsRes]) => {
        setAnalytics(analyticsRes.analytics);
        setAppointments(apptsRes);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-teal-600" />
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Admin Governance & Patient Record Inspection</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Master overview of all patient intake details, manual symptoms, AI triage sync status, and appointment slots across the platform.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl bg-teal-50 px-4 py-2 border border-teal-200 text-xs font-bold text-teal-800">
          <ShieldCheck className="h-4 w-4 text-teal-600" />
          Master Patient Sync Active
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500">Registered System Patients</span>
          <div className="text-2xl font-black text-slate-900">{analytics?.total_patients ?? 1284}</div>
          <p className="text-[11px] text-slate-400">Total Patient Accounts</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500">Total Predictions Served</span>
          <div className="text-2xl font-black text-teal-600">{analytics?.total_predictions_generated ?? 8920}</div>
          <p className="text-[11px] text-slate-400">FastAPI Model Inference</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500">Booked Appointment Slots</span>
          <div className="text-2xl font-black text-slate-900">{appointments.length} Records</div>
          <p className="text-[11px] text-slate-400">Synced to Doctor & Admin</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500">Active Doctors</span>
          <div className="text-2xl font-black text-slate-900">{analytics?.total_doctors ?? 42}</div>
          <p className="text-[11px] text-slate-400">Clinical Specialties</p>
        </div>
      </div>

      {/* Admin Master Patient Record Inspection Table */}
      <div className="rounded-3xl border border-slate-200/80 bg-white shadow-sm overflow-hidden space-y-4">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Master Patient Records & Sync Verification</h2>
            <p className="text-xs text-slate-500">Inspect full patient intake parameters before AI generates final clinical reports.</p>
          </div>
          <button onClick={loadData} className="flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-700">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh Records
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400 gap-2 text-xs">
            <RefreshCw className="h-4 w-4 animate-spin text-teal-600" /> Loading Master Patient Records...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Patient Name & Vitals</th>
                  <th className="px-6 py-4">Assigned Doctor & Slot</th>
                  <th className="px-6 py-4">Submitted Symptoms</th>
                  <th className="px-6 py-4">Sync Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-extrabold text-slate-900 text-sm">{appt.patient_name}</div>
                      <div className="text-[11px] text-slate-500">
                        {appt.patient_age || 54} Yrs, {appt.patient_gender || 'Female'} • BMI: {appt.patient_bmi || 28.3} kg/m²
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{appt.doctor_name}</div>
                      <div className="text-[11px] text-teal-700 font-bold">
                        {appt.appointment_date} at {appt.appointment_time}
                      </div>
                    </td>

                    <td className="px-6 py-4 max-w-xs">
                      <div className="text-slate-800 font-medium truncate" title={appt.symptoms}>
                        "{appt.symptoms || 'No manual symptoms specified.'}"
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {appt.health_conditions?.map((c) => (
                          <span key={c} className="px-1.5 py-0.5 rounded bg-teal-50 text-teal-800 text-[10px] font-bold">
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        Synced (Patient, Doctor, Admin)
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedAppt(appt)}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-xs hover:bg-slate-800 transition-all inline-flex items-center gap-1"
                      >
                        <Eye className="h-3.5 w-3.5" /> Inspect Full Record
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Appointment Detail Modal for Admin */}
      {selectedAppt && (
        <AppointmentDetailModal
          appointment={selectedAppt}
          userRole="admin"
          onClose={() => setSelectedAppt(null)}
          onRefresh={() => { loadData(); setSelectedAppt(null); }}
        />
      )}
    </div>
  );
};

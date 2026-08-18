import React, { useEffect, useState } from 'react';
import { fetchAppointments, updateAppointmentStatus } from '../api/client';
import { Appointment } from '../types';
import { useAuth } from '../context/AuthContext';
import { AppointmentDetailModal } from '../components/AppointmentDetailModal';
import { Calendar, Clock, Plus, CheckCircle, XCircle, AlertCircle, RefreshCw, Eye, Stethoscope, Sparkles } from 'lucide-react';

export const AppointmentsPage: React.FC = () => {
  const { role } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);

  const loadData = () => {
    setLoading(true);
    fetchAppointments()
      .then((data) => setAppointments(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCancelClick = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await updateAppointmentStatus(id, 'Cancelled');
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Appointment Records & Intake Details</h1>
          <p className="text-sm text-slate-500 mt-1">
            Review booked appointment date, time, patient vitals, manual symptoms, and AI generated triage report.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-400 gap-2 text-xs">
          <RefreshCw className="h-4 w-4 animate-spin text-teal-600" /> Loading Appointments...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {appointments.map((appt) => (
            <div key={appt.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <div className="text-xs font-bold text-slate-900">{appt.patient_name}</div>
                  <div className="text-[11px] text-slate-500">{appt.department} • {appt.doctor_name}</div>
                </div>

                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black ${
                  appt.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                  appt.status === 'Scheduled' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                  appt.status === 'Rescheduled' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                  appt.status === 'Cancelled' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {appt.status === 'Confirmed' ? 'Confirmed ✓' :
                   appt.status === 'Cancelled' ? 'Cancelled ✕' :
                   appt.status}
                </span>
              </div>

              {/* Date & Time Slot Callout */}
              <div className="rounded-2xl bg-teal-50/70 border border-teal-200/60 p-3.5 flex items-center justify-between text-xs">
                <div>
                  <div className="text-[10px] font-bold text-teal-800 uppercase tracking-wider">Booked Date & Time Slot</div>
                  <div className="font-extrabold text-teal-950 flex items-center gap-2 mt-0.5">
                    <Calendar className="h-4 w-4 text-teal-600" /> {appt.appointment_date}
                    <Clock className="h-4 w-4 text-teal-600 ml-2" /> {appt.appointment_time}
                  </div>
                </div>
              </div>

              {/* Manual Symptoms Preview */}
              <div className="space-y-1 text-xs">
                <span className="font-bold text-slate-500 text-[10px] uppercase tracking-wider">Patient Symptoms:</span>
                <p className="text-slate-800 font-medium line-clamp-2">
                  "{appt.symptoms || 'No manual symptoms specified.'}"
                </p>
              </div>

              {/* AI Risk Triage Preview */}
              {appt.ai_risk_category && (
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 text-xs flex items-center justify-between">
                  <span className="text-slate-500 text-[11px]">AI Risk Triage:</span>
                  <span className="font-bold text-slate-900">{appt.ai_risk_category}</span>
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setSelectedAppt(appt)}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-2xl bg-teal-600 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-teal-700 transition-all"
                >
                  <Eye className="h-4 w-4" /> View Full Record
                </button>

                {/* Patient Cancellation Button */}
                {appt.status !== 'Cancelled' && appt.status !== 'Completed' && (
                  <button
                    onClick={(e) => handleCancelClick(appt.id, e)}
                    className="px-4 py-2.5 rounded-2xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold transition-all flex items-center gap-1"
                  >
                    <XCircle className="h-4 w-4" /> Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Appointment Detail Modal */}
      {selectedAppt && (
        <AppointmentDetailModal
          appointment={selectedAppt}
          userRole={role || 'patient'}
          onClose={() => setSelectedAppt(null)}
          onRefresh={() => { loadData(); setSelectedAppt(null); }}
        />
      )}
    </div>
  );
};

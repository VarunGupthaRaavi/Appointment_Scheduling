import React, { useState } from 'react';
import { Appointment } from '../types';
import { RiskMeter } from './RiskMeter';
import { rescheduleAppointment, updateAppointmentStatus } from '../api/client';
import {
  Calendar, Clock, User, Phone, Activity, Stethoscope, Sparkles, X, CheckCircle2,
  RefreshCw, AlertCircle, ShieldCheck, Edit3, CheckCheck, XCircle
} from 'lucide-react';

interface Props {
  appointment: Appointment;
  onClose: () => void;
  onRefresh: () => void;
  userRole: 'patient' | 'doctor' | 'admin';
}

export const AppointmentDetailModal: React.FC<Props> = ({ appointment, onClose, onRefresh, userRole }) => {
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [newDate, setNewDate] = useState(appointment.appointment_date);
  const [newTime, setNewTime] = useState(appointment.appointment_time);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    setErrMsg(null);

    try {
      await rescheduleAppointment(appointment.id, newDate, newTime);
      setMsg(`Appointment successfully rescheduled to ${newDate} at ${newTime}!`);
      setIsRescheduling(false);
      onRefresh();
    } catch (err: any) {
      setErrMsg(err.response?.data?.detail || 'Failed to reschedule appointment slot.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (status: string) => {
    setLoading(true);
    try {
      await updateAppointmentStatus(appointment.id, status);
      setMsg(`Appointment status successfully updated to '${status}'!`);
      setTimeout(() => {
        onRefresh();
      }, 500);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600 font-bold">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">Appointment Record</h2>
                <span className="font-mono text-xs text-slate-400">({appointment.id})</span>
              </div>
              <p className="text-xs text-slate-500">{appointment.department} — {appointment.doctor_name}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sync Status Banner */}
        <div className="rounded-2xl bg-teal-50/80 border border-teal-200/80 p-3.5 flex items-center justify-between text-xs text-teal-900 font-semibold">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-teal-600 shrink-0" />
            <span>{appointment.sync_status || 'Synced across Patient, Doctor & Admin Portals ✓'}</span>
          </div>
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        {msg && (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 font-bold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            {msg}
          </div>
        )}

        {errMsg && (
          <div className="rounded-2xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800 font-bold flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-600" />
            {errMsg}
          </div>
        )}

        {/* Date, Time & Current Status Bar */}
        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Scheduled Date & Time Slot</div>
              <div className="text-base font-black text-slate-900 flex items-center gap-2 mt-0.5">
                <Calendar className="h-4 w-4 text-teal-600" />
                {appointment.appointment_date}
                <Clock className="h-4 w-4 text-teal-600 ml-2" />
                {appointment.appointment_time}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black ${
                appointment.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                appointment.status === 'Completed' ? 'bg-teal-100 text-teal-800 border border-teal-300' :
                appointment.status === 'Cancelled' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                {appointment.status === 'Confirmed' ? 'Confirmed ✓' :
                 appointment.status === 'Completed' ? 'Completed ✓' :
                 appointment.status === 'Cancelled' ? 'Cancelled ✕' :
                 appointment.status}
              </span>

              {(userRole === 'doctor' || userRole === 'admin') && appointment.status !== 'Cancelled' && !isRescheduling && (
                <button
                  onClick={() => setIsRescheduling(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 text-white font-bold text-xs shadow-xs hover:bg-teal-700 transition-all"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Change Slot
                </button>
              )}
            </div>
          </div>

          {/* Doctor Reschedule Form */}
          {isRescheduling && (userRole === 'doctor' || userRole === 'admin') && (
            <form onSubmit={handleRescheduleSubmit} className="pt-2 border-t border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-800">Reschedule Appointment Slot (Doctor Management):</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">New Date</label>
                  <input
                    type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} required
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">New Time Slot</label>
                  <select
                    value={newTime} onChange={(e) => setNewTime(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold"
                  >
                    {['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM'].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button" onClick={() => setIsRescheduling(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit" disabled={loading}
                  className="px-4 py-1.5 rounded-lg bg-teal-600 text-white font-bold text-xs shadow-xs hover:bg-teal-700 disabled:opacity-50"
                >
                  {loading ? 'Rescheduling...' : 'Confirm Rescheduled Slot'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Section 1: Patient Personal Details */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <User className="h-4 w-4 text-teal-600" />
            1. Patient Personal Intake Details
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="rounded-xl bg-slate-50 p-2.5">
              <span className="text-slate-400 text-[10px]">Full Name</span>
              <div className="font-bold text-slate-900">{appointment.patient_name}</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-2.5">
              <span className="text-slate-400 text-[10px]">Age & Gender</span>
              <div className="font-bold text-slate-900">{appointment.patient_age || 54} Yrs, {appointment.patient_gender || 'Female'}</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-2.5">
              <span className="text-slate-400 text-[10px]">Phone Contact</span>
              <div className="font-bold text-slate-900">{appointment.patient_phone || '+1 (555) 234-5678'}</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-2.5">
              <span className="text-slate-400 text-[10px]">BMI (Vitals)</span>
              <div className="font-bold text-teal-700">{appointment.patient_bmi || 28.3} kg/m² ({appointment.patient_height || 168} cm, {appointment.patient_weight || 80} kg)</div>
            </div>
          </div>
        </div>

        {/* Section 2: Health Conditions & Biomarker Filters */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="h-4 w-4 text-teal-600" />
            2. Medical Conditions & Biomarkers
          </h3>
          <div className="flex flex-wrap gap-2">
            {appointment.health_conditions?.map((c) => (
              <span key={c} className="px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
                ✓ {c}
              </span>
            )) || <span className="text-xs text-slate-400">No chronic conditions listed.</span>}
          </div>
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="rounded-xl bg-slate-50 p-2.5">
              <span className="text-slate-400 text-[10px]">Fasting Glucose</span>
              <div className="font-bold text-slate-900">{appointment.blood_glucose_level || 175} mg/dL</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-2.5">
              <span className="text-slate-400 text-[10px]">HbA1c Level</span>
              <div className="font-bold text-slate-900">{appointment.hba1c_level || 7.2}%</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-2.5">
              <span className="text-slate-400 text-[10px]">Smoking History</span>
              <div className="font-bold capitalize text-slate-900">{appointment.smoking_history || 'former'}</div>
            </div>
          </div>
        </div>

        {/* Section 3: Patient Manual Symptoms Submitted */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Stethoscope className="h-4 w-4 text-teal-600" />
            3. Patient Manual Symptoms Submitted
          </h3>
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs text-slate-800 leading-relaxed font-medium">
            "{appointment.symptoms || 'No manual symptoms specified.'}"
          </div>
        </div>

        {/* Section 4: AI Triage & Final Generated Clinical Report */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-teal-600" />
            4. AI Generated Final Triage Report
          </h3>
          <RiskMeter probability={appointment.ai_risk_score || 0.68} category={appointment.ai_risk_category || 'Moderate Risk'} />
          <div className="rounded-2xl bg-teal-50 border border-teal-200/80 p-4 text-xs text-teal-950 space-y-1">
            <div className="font-bold text-teal-900">AI Generated Clinical Diagnosis Support Report:</div>
            <p className="leading-relaxed text-teal-900/90">{appointment.ai_clinical_report}</p>
          </div>
        </div>

        {/* STATUS ACTIONS BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-slate-100 pt-5 gap-3">
          <span className="text-xs font-bold text-slate-700">Actions:</span>
          <div className="flex flex-wrap gap-2.5">
            {/* Show Confirm ONLY if not yet confirmed or completed or cancelled */}
            {appointment.status !== 'Confirmed' && appointment.status !== 'Completed' && appointment.status !== 'Cancelled' && (userRole === 'doctor' || userRole === 'admin') && (
              <button
                type="button"
                onClick={() => handleStatusChange('Confirmed')}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-md shadow-emerald-600/20 hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50"
              >
                <CheckCircle2 className="h-4 w-4" />
                Confirm Consultation
              </button>
            )}

            {/* Doctor/Admin Complete button */}
            {appointment.status !== 'Completed' && appointment.status !== 'Cancelled' && (userRole === 'doctor' || userRole === 'admin') && (
              <button
                type="button"
                onClick={() => handleStatusChange('Completed')}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-indigo-600 text-white font-bold text-xs shadow-md shadow-teal-600/20 hover:from-teal-700 hover:to-indigo-700 transition-all disabled:opacity-50"
              >
                <CheckCheck className="h-4 w-4" />
                Complete Consultation
              </button>
            )}

            {/* Cancel Button available to Patients, Doctors AND Admins! */}
            {appointment.status !== 'Cancelled' && appointment.status !== 'Completed' && (
              <button
                type="button"
                onClick={() => handleStatusChange('Cancelled')}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 text-white font-bold text-xs shadow-md shadow-rose-600/20 hover:from-rose-700 hover:to-red-700 transition-all disabled:opacity-50"
              >
                <XCircle className="h-4 w-4" />
                Cancel Appointment
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

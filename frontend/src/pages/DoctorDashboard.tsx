import React, { useEffect, useState } from 'react';
import { fetchAppointments } from '../api/client';
import { Appointment } from '../types';
import { AppointmentDetailModal } from '../components/AppointmentDetailModal';
import {
  UserCheck, Calendar, Clock, Activity, FileText, Edit3, ShieldCheck, RefreshCw, AlertCircle,
  CheckCircle2, ChevronLeft, ChevronRight, User
} from 'lucide-react';

const MASTER_TIMESLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
];

export const DoctorDashboardPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-20');
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

  // Filter appointments for selected calendar date
  const dateAppointments = appointments.filter(a => a.appointment_date === selectedDate);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="h-6 w-6 text-teal-600" />
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Doctor Schedule & Slot Management Calendar</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage your daily appointment slots, inspect full patient intake details, and reschedule patient appointments.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl bg-teal-50 px-4 py-2 border border-teal-200 text-xs font-bold text-teal-800">
          <ShieldCheck className="h-4 w-4 text-teal-600" />
          Doctor Slot Control Active
        </div>
      </div>

      {/* DOCTOR APPOINTMENT SLOT CALENDAR & TIMESLOT GRID */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600 font-bold">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Doctor Slot Calendar Schedule</h2>
              <p className="text-xs text-slate-500">Select a date to view booked & available time slots.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-600">Select Schedule Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-bold text-slate-800"
            />
          </div>
        </div>

        {/* Timeslots Matrix for Selected Date */}
        <div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Time Slots Schedule for {selectedDate} ({dateAppointments.length} Booked)
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {MASTER_TIMESLOTS.map((slot) => {
              const bookedAppt = dateAppointments.find(a => a.appointment_time === slot);
              const isBooked = !!bookedAppt;

              return (
                <button
                  key={slot}
                  onClick={() => isBooked && setSelectedAppt(bookedAppt)}
                  className={`p-3 rounded-2xl text-left transition-all duration-200 border ${
                    isBooked
                      ? 'bg-teal-50 border-teal-300 text-teal-950 shadow-xs hover:border-teal-400 hover:shadow-md cursor-pointer'
                      : 'bg-slate-50/70 border-slate-200 text-slate-400 opacity-80 cursor-default'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-extrabold flex items-center gap-1">
                      <Clock className="h-3 w-3 text-teal-600" /> {slot}
                    </span>
                    <span className={`h-2 w-2 rounded-full ${isBooked ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  </div>
                  {isBooked ? (
                    <div>
                      <div className="text-[11px] font-bold text-slate-900 truncate">{bookedAppt.patient_name}</div>
                      <div className="text-[9px] font-semibold text-teal-700 mt-0.5">{bookedAppt.ai_risk_category || 'Moderate Risk'}</div>
                    </div>
                  ) : (
                    <div className="text-[10px] font-medium text-slate-400">Available Slot</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Patient Intake Records List */}
      <div className="rounded-3xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">All Patient Intake Records & Rescheduling</h2>
          <button onClick={loadData} className="flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-700">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh List
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400 gap-2 text-xs">
            <RefreshCw className="h-4 w-4 animate-spin text-teal-600" /> Loading Patient Intake Records...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Patient Name & Vitals</th>
                  <th className="px-6 py-4">Date & Time Slot</th>
                  <th className="px-6 py-4">Manual Symptoms</th>
                  <th className="px-6 py-4">AI Triage Category</th>
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
                      <div className="font-bold text-slate-900 flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-teal-600" /> {appt.appointment_date}
                      </div>
                      <div className="text-[11px] text-teal-700 font-bold flex items-center gap-1 mt-0.5">
                        <Clock className="h-3.5 w-3.5" /> {appt.appointment_time}
                      </div>
                    </td>

                    <td className="px-6 py-4 max-w-xs">
                      <div className="text-slate-800 font-medium truncate" title={appt.symptoms}>
                        "{appt.symptoms || 'No manual symptoms submitted.'}"
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
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
                        appt.ai_risk_category?.includes('High')
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : appt.ai_risk_category?.includes('Moderate')
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}>
                        {appt.ai_risk_category || 'Moderate Risk'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedAppt(appt)}
                        className="px-3 py-1.5 rounded-xl bg-teal-600 text-white font-bold text-xs shadow-xs hover:bg-teal-700 transition-all inline-flex items-center gap-1"
                      >
                        <Edit3 className="h-3.5 w-3.5" /> View Details & Reschedule
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Appointment Details & Doctor Reschedule Modal */}
      {selectedAppt && (
        <AppointmentDetailModal
          appointment={selectedAppt}
          userRole="doctor"
          onClose={() => setSelectedAppt(null)}
          onRefresh={() => { loadData(); setSelectedAppt(null); }}
        />
      )}
    </div>
  );
};

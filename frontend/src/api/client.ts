import axios from 'axios';
import { PredictionResult, ModelCardInfo, Appointment } from '../types';

const rawEnvUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
const cleanUrl = rawEnvUrl.replace(/\/+$/, '');
const API_BASE_URL = cleanUrl.endsWith('/api/v1') ? cleanUrl : `${cleanUrl}/api/v1`;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('careflow_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ML Prediction Services
export const predictDiabetes = async (data: Record<string, any>): Promise<PredictionResult> => {
  const res = await apiClient.post<PredictionResult>('/predict/diabetes', data);
  return res.data;
};

export const predictNoShow = async (data: Record<string, any>): Promise<PredictionResult> => {
  const res = await apiClient.post<PredictionResult>('/predict/appointment-no-show', data);
  return res.data;
};

export const predictReservation = async (data: Record<string, any>): Promise<PredictionResult> => {
  const res = await apiClient.post<PredictionResult>('/predict/appointment-reservation', data);
  return res.data;
};

export const predictReadmission = async (data: Record<string, any>): Promise<PredictionResult> => {
  const res = await apiClient.post<PredictionResult>('/predict/readmission', data);
  return res.data;
};

export const analyzePatientUnified = async (data: Record<string, any>) => {
  const res = await apiClient.post('/patient/analyze', data);
  return res.data;
};

// Admin & System APIs
export const fetchAdminModels = async (): Promise<ModelCardInfo[]> => {
  const res = await apiClient.get<{ models: ModelCardInfo[] }>('/admin/models');
  return res.data.models;
};

export const trainAdminModel = async (
  modelId: string,
  payload?: { sample_size?: number | null; optimize?: boolean }
) => {
  const cleanId = modelId.replace(/-/g, '_');
  const res = await apiClient.post(`/admin/models/${cleanId}/train`, payload || {});
  return res.data;
};

export const addAdminModelData = async (
  modelId: string,
  payload?: { records_count?: number; custom_records?: any[] }
) => {
  const cleanId = modelId.replace(/-/g, '_');
  const res = await apiClient.post(`/admin/models/${cleanId}/add-data`, payload || { records_count: 5000 });
  return res.data;
};

export const uploadAdminModelDataset = async (
  modelId: string,
  file: File
) => {
  const cleanId = modelId.replace(/-/g, '_');
  const formData = new FormData();
  formData.append('file', file);
  // Do NOT pass explicit Content-Type: multipart/form-data so Axios and the browser generate the correct multipart boundary
  const res = await apiClient.post(`/admin/models/${cleanId}/upload-dataset`, formData);
  return res.data;
};

export const trainAllAdminModels = async (
  payload?: { sample_size?: number | null; optimize?: boolean }
) => {
  const res = await apiClient.post('/admin/models/train-all', payload || {});
  return res.data;
};

export const fetchAdminAnalytics = async () => {
  const res = await apiClient.get('/admin/analytics');
  return res.data;
};

// Appointments API
export const fetchAppointments = async (): Promise<Appointment[]> => {
  const res = await apiClient.get<{ appointments: Appointment[] }>('/appointments');
  return res.data.appointments;
};

export const checkSlotAvailability = async (date: string, time: string) => {
  const res = await apiClient.get('/appointments/check-availability', {
    params: { date, time }
  });
  return res.data;
};

export const createAppointment = async (data: Record<string, any>): Promise<Appointment> => {
  const res = await apiClient.post('/appointments', data);
  return res.data.appointment;
};

export const rescheduleAppointment = async (id: string, newDate: string, newTime: string) => {
  const res = await apiClient.patch(`/appointments/${id}/reschedule`, {
    new_date: newDate,
    new_time: newTime
  });
  return res.data;
};

export const updateAppointmentStatus = async (id: string, status: string) => {
  const res = await apiClient.patch(`/appointments/${id}`, { status });
  return res.data;
};

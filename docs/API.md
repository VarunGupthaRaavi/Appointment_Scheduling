# CAREflow AI — API Endpoint Reference

## Base URL
`/api/v1`

## Health & System Endpoints
- `GET /api/v1/health`: Basic system status.
- `GET /api/v1/health/models`: Returns loading status and verified benchmark metrics for all 4 models.

## Machine Learning Prediction Endpoints
- `POST /api/v1/predict/diabetes`: XGBoost Diabetes Risk Classifier.
- `POST /api/v1/predict/appointment-no-show`: LightGBM Appointment Attendance Predictor.
- `POST /api/v1/predict/appointment-reservation`: Extra Trees Reservation Completion Model.
- `POST /api/v1/predict/readmission`: XGBoost Multiclass Inpatient Readmission Model.
- `POST /api/v1/patient/analyze`: Unified Triage Analysis Endpoint (executes only provided model payloads).

## Clinical Operations Endpoints
- `POST /api/v1/auth/login`: Authenticate user and issue JWT token.
- `POST /api/v1/auth/register`: Register new user profile.
- `GET /api/v1/appointments`: Fetch appointments list.
- `POST /api/v1/appointments`: Book new appointment.
- `PATCH /api/v1/appointments/{id}`: Update appointment status (Scheduled, Confirmed, Completed, Cancelled, No Show).
- `GET /api/v1/admin/models`: Fetch admin model cards & true benchmark metrics.
- `GET /api/v1/admin/analytics`: Platform analytics dashboard.

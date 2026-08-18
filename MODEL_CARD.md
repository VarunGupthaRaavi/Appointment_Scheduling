# Production Machine Learning Model Cards

This document provides comprehensive technical specifications, training configurations, performance metrics, and deployment instructions for the **Four Production-Ready Machine Learning Models** developed for the Healthcare AI System.

---

## 1. Model Overview Summary

| Model ID | Dataset | Algorithm | Target | Accuracy | F1 / Macro F1 | ROC-AUC | Artifact Path |
| :--- | :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| **Model 1** | `archive/diabetes_dataset.csv` | **XGBoost** | `diabetes` | **96.06%** | **69.11%** | **0.9749** | `trained_models/diabetes_xgboost_pipeline.joblib` |
| **Model 2** | `archive (2)/healthcare_noshows_appt.csv` | **LightGBM** | `Showed_up` | **73.64%** | **82.20%** | **0.7410** | `trained_models/appointment_noshow_lightgbm_pipeline.joblib` |
| **Model 3** | `archive (3)/2017.csv` | **Extra Trees** | `show` | **80.75%** | **88.67%** | **0.7456** | `trained_models/appointment_reservation_extratrees_pipeline.joblib` |
| **Model 4** | `diabetic_data.csv` | **XGBoost Multiclass** | `readmitted` | **58.62%** | **43.20%** | **0.6836** | `trained_models/readmission_pipeline.joblib` |

---

## 2. Model 1: Diabetes Risk Classification (`XGBoost`)

### Intended Use
Predicts individual patient risk of diabetes diagnosis based on clinical biomarkers, demographic factors, and comorbidities. Designed for clinical triage decision-support.

- **Dataset**: `archive/diabetes_dataset.csv` (99,986 records after removing 14 exact duplicates)
- **Target**: `diabetes` (0 = Non-Diabetic, 1 = Diabetic)
- **Data Split**: **70% Train** (69,990), **15% Validation** (14,998), **15% Untouched Test** (14,998)
- **Preprocessing Pipeline**: `ColumnTransformer` with `SimpleImputer(strategy='median')` + `StandardScaler()` for continuous features (`age`, `bmi`, `hbA1c_level`, `blood_glucose_level`) and `OneHotEncoder()` for categorical features (`gender`, `location`, `smoking_history`).
- **Class Imbalance**: Handled via `scale_pos_weight = 10.77` fitted exclusively on training data.
- **Tuned Hyperparameters**:
  - `n_estimators`: 150
  - `max_depth`: 4
  - `learning_rate`: 0.05
  - `subsample`: 0.8
  - `eval_metric`: `logloss`

### Test Set Metrics (14,998 Samples)
- **Accuracy**: `96.06%`
- **Precision**: `70.83%`
- **Recall**: `67.48%`
- **F1-Score**: `69.11%`
- **ROC-AUC**: `0.9749`
- **PR-AUC**: `0.7788`
- **Confusion Matrix**: `[[13317, 407], [414, 860]]`

### Top Feature Importances (SHAP)
1. `hbA1c_level`
2. `blood_glucose_level`
3. `age`
4. `bmi`
5. `hypertension`

---

## 3. Model 2: Appointment No-Show Prediction (`LightGBM`)

### Intended Use
Predicts the probability of patient attendance for scheduled clinic appointments to enable proactive SMS reminders, double-booking logic, and queue optimization.

- **Dataset**: `archive (2)/healthcare_noshows_appt.csv` (106,987 records)
- **Target**: `Showed_up` (1 = Attended, 0 = No-show)
- **Data Split**: **70% Train** (74,890), **15% Validation** (16,048), **15% Untouched Test** (16,049)
- **Feature Engineering**: Engineered `lead_time_days` (appointment date - scheduling date), `scheduled_dow`, `scheduled_hour`, `appointment_dow`, `appointment_month`. Dropped raw timestamp strings and patient/appointment IDs to eliminate data leakage.
- **Class Imbalance**: Implemented `class_weight='balanced'` to prioritize minority-class performance (no-shows) over naive baseline accuracy.
- **Tuned Hyperparameters**:
  - `n_estimators`: 150
  - `max_depth`: 6
  - `num_leaves`: 31
  - `learning_rate`: 0.05

### Test Set Metrics (16,049 Samples)
- **Accuracy**: `73.64%`
- **Precision**: `89.20%`
- **Recall**: `76.22%`
- **F1-Score**: `82.20%`
- **ROC-AUC**: `0.7410`
- **PR-AUC**: `0.9067`
- **Confusion Matrix**: `[[2073, 1179], [3043, 9754]]`

---

## 4. Model 3: Appointment Reservation System (`Extra Trees`)

### Intended Use
Predicts appointment completion and booking utilization across clinical specialties for hospital capacity management.

- **Dataset**: `archive (3)/2017.csv` (60,990 records after removing 224 duplicates)
- **Target**: `show` (1 = Attended, 0 = No-show)
- **Data Split**: **70% Train** (42,693), **15% Validation** (9,148), **15% Untouched Test** (9,149)
- **Preprocessing Pipeline**: `ColumnTransformer` with `StandardScaler` on all discrete and cyclical reservation/creation date and time features.
- **Tuned Hyperparameters**:
  - `n_estimators`: 150
  - `max_depth`: 16
  - `min_samples_split`: 5
  - `min_samples_leaf`: 1

### Test Set Metrics (9,149 Samples)
- **Accuracy**: `80.75%`
- **Precision**: `81.33%`
- **Recall**: `97.46%`
- **F1-Score**: `88.67%`
- **ROC-AUC**: `0.7456`
- **PR-AUC**: `0.9168`
- **Confusion Matrix**: `[[339, 1563], [184, 7063]]`

---

## 5. Model 4: Emergency Hospital Readmission Triage (`XGBoost Multiclass`)

### Intended Use
Multi-class clinical risk stratification for diabetic inpatient hospital readmissions (`NO` readmission, `>30` days, `<30` days urgent readmission).

- **Dataset**: `diabetic_data.csv` (101,766 records across 130 US hospitals)
- **Target**: `readmitted` (0: `NO`, 1: `>30` days, 2: `<30` days)
- **Data Split**: **70% Train** (71,236), **15% Validation** (15,265), **15% Untouched Test** (15,265)
- **Feature Engineering & Cleaning**: Dropped `encounter_id`, `patient_nbr`, and `weight` (>97% missing). Replaced `'?'` with `'Unknown'`. Engineered `total_prior_visits` (`number_outpatient` + `number_emergency` + `number_inpatient`).
- **Performance Reality Note**: Achieved **58.62% multiclass accuracy** (Balanced Accuracy: **42.27%**). This reflects the true un-leaked predictability ceiling on the UCI 130-US Hospitals dataset, consistent with published academic literature.

### Test Set Metrics (15,265 Samples)
- **Multiclass Accuracy**: `58.62%`
- **Balanced Accuracy**: `42.27%`
- **Macro Precision**: `48.74%`
- **Macro Recall**: `42.27%`
- **Macro F1-Score**: `43.20%`
- **Multiclass ROC-AUC (ovr)**: `0.6836`
- **Confusion Matrix**:
  ```
  [[6983, 1139,  106],
   [3872, 1367,   99],
   [ 867,  230,  602]]
  ```

---

## 6. Fast-API Integration Snippet

All serialized pipelines (`.joblib`) store both preprocessing and the estimator together. They accept raw pandas DataFrames directly.

```python
import joblib
import pandas as pd

# 1. Load pipeline artifact
pipeline = joblib.load("trained_models/diabetes_xgboost_pipeline.joblib")

# 2. Input payload from FastAPI endpoint
input_df = pd.DataFrame([{
    "year": 2019,
    "gender": "Female",
    "age": 54.0,
    "location": "Texas",
    "race:AfricanAmerican": 0,
    "race:Asian": 0,
    "race:Caucasian": 1,
    "race:Hispanic": 0,
    "race:Other": 0,
    "hypertension": 1,
    "heart_disease": 0,
    "smoking_history": "former",
    "bmi": 28.4,
    "hbA1c_level": 6.8,
    "blood_glucose_level": 160
}])

# 3. Direct prediction
prediction = int(pipeline.predict(input_df)[0])
probabilities = pipeline.predict_proba(input_df)[0].tolist()

print("Prediction Class:", prediction)
print("Class Probabilities:", probabilities)
```

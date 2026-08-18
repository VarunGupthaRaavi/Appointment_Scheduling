# CAREflow AI — Machine Learning Model Documentation

## Verified Production Benchmark Metrics

| Model ID | Dataset | Algorithm | Target | Untouched Test Samples | Accuracy | Precision | Recall | F1-Score | ROC-AUC | PR-AUC | Artifact Path |
| :--- | :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **diabetes_risk** | `archive/diabetes_dataset.csv` | **XGBoost** | `diabetes` | 14,998 | **91.59%** | 50.31% | 89.49% | **64.41%** | **0.9781** | **0.8830** | `trained_models/diabetes_xgboost_pipeline.joblib` |
| **appointment_noshow** | `archive (2)/healthcare_noshows_appt.csv` | **LightGBM** | `Showed_up` | 16,047 | **61.07%** | 92.10% | 55.97% | **69.63%** | **0.7438** | **0.9209** | `trained_models/appointment_noshow_lightgbm_pipeline.joblib` |
| **appointment_reservation** | `archive (3)/2017.csv` | **Extra Trees** | `show` | 9,149 | **79.79%** | 79.91% | 99.39% | **88.59%** | **0.6317** | **0.8551** | `trained_models/appointment_reservation_extratrees_pipeline.joblib` |
| **hospital_readmission** | `diabetic_data.csv` | **XGBoost Multiclass** | `readmitted` | 15,265 | **59.41%** | 54.09% | 41.88% | **40.14%** | **0.6852** | N/A | `trained_models/readmission_pipeline.joblib` |

---

## Model Academic & Scientific Limitations

1. **Model 1 (Diabetes Risk)**:
   - High ROC-AUC (0.9781) and Recall (89.49%). Precision is 50.31% due to `scale_pos_weight = 10.76` optimization for high recall clinical screening.

2. **Model 2 (Appointment No-Show)**:
   - Accuracy is 61.07% because the model was trained with `class_weight='balanced'` to optimize minority-class attendance prediction. Performance should be interpreted using F1-Score (69.63%) and PR-AUC (0.9209).

3. **Model 3 (Appointment Reservation)**:
   - Test sample count is 9,149. High F1-Score (88.59%) and Recall (99.39%) with overall accuracy of 79.79%.

4. **Model 4 (Hospital Readmission)**:
   - Multiclass accuracy is 59.41% (Balanced Accuracy: 41.88%). This reflects the un-leaked predictability ceiling on the UCI 130-US Hospitals dataset. It must be treated as an experimental decision-support component.

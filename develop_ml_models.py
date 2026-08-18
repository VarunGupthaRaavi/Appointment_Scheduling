import os
import sys
import json
import time
import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix

from xgboost import XGBClassifier
from lightgbm import LGBMClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.ensemble import RandomForestClassifier, ExtraTreesClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LogisticRegression

# Set random seed for reproducibility
SEED = 42

FOLDER = r'c:\Users\amman\Downloads\New folder'

def remove_outliers_iqr(df, num_cols):
    """
    Removes outliers from continuous numerical columns using the Interquartile Range (IQR) method.
    Outlier boundaries: Q1 - 1.5*IQR to Q3 + 1.5*IQR.
    """
    initial_rows = len(df)
    df_clean = df.copy()
    for col in num_cols:
        if col in df_clean.columns:
            q1 = df_clean[col].quantile(0.25)
            q3 = df_clean[col].quantile(0.75)
            iqr = q3 - q1
            if iqr > 0:
                lower = q1 - 1.5 * iqr
                upper = q3 + 1.5 * iqr
                df_clean = df_clean[(df_clean[col] >= lower) & (df_clean[col] <= upper)]
    final_rows = len(df_clean)
    print(f"  Outlier Removal: Removed {initial_rows - final_rows:,} rows ({(initial_rows - final_rows)/initial_rows*100:.2f}%). Cleaned dataset shape: {df_clean.shape}")
    return df_clean

def get_models(is_multiclass=False):
    """
    Returns a dictionary of ML algorithms requested in PPT 4.pptx (XGBoost, Neural Networks, Random Forest, LightGBM, etc.).
    """
    if is_multiclass:
        models = {
            "XGBoost": XGBClassifier(n_estimators=100, max_depth=6, learning_rate=0.1, random_state=SEED, n_jobs=-1, eval_metric="mlogloss"),
            "Neural Network (MLP)": MLPClassifier(hidden_layer_sizes=(128, 64), max_iter=250, random_state=SEED, early_stopping=True),
            "LightGBM": LGBMClassifier(n_estimators=100, max_depth=6, learning_rate=0.1, random_state=SEED, n_jobs=-1, verbose=-1),
            "Random Forest": RandomForestClassifier(n_estimators=100, max_depth=12, random_state=SEED, n_jobs=-1),
            "Extra Trees": ExtraTreesClassifier(n_estimators=100, max_depth=12, random_state=SEED, n_jobs=-1),
            "Decision Tree": DecisionTreeClassifier(max_depth=10, random_state=SEED),
            "Logistic Regression": LogisticRegression(max_iter=500, random_state=SEED)
        }
    else:
        models = {
            "XGBoost": XGBClassifier(n_estimators=100, max_depth=6, learning_rate=0.1, random_state=SEED, n_jobs=-1, eval_metric="logloss"),
            "Neural Network (MLP)": MLPClassifier(hidden_layer_sizes=(128, 64), max_iter=250, random_state=SEED, early_stopping=True),
            "LightGBM": LGBMClassifier(n_estimators=100, max_depth=6, learning_rate=0.1, random_state=SEED, n_jobs=-1, verbose=-1),
            "Random Forest": RandomForestClassifier(n_estimators=100, max_depth=12, random_state=SEED, n_jobs=-1),
            "Extra Trees": ExtraTreesClassifier(n_estimators=100, max_depth=12, random_state=SEED, n_jobs=-1),
            "Decision Tree": DecisionTreeClassifier(max_depth=10, random_state=SEED),
            "Logistic Regression": LogisticRegression(max_iter=500, random_state=SEED)
        }
    return models

def evaluate_models(X_train, X_test, y_train, y_test, dataset_name, is_multiclass=False):
    print(f"\n=======================================================")
    print(f"TRAINING & EVALUATING ML MODELS FOR: {dataset_name}")
    print(f"Split: 70% Train ({X_train.shape[0]:,} samples), 30% Test ({X_test.shape[0]:,} samples)")
    print(f"Number of Features: {X_train.shape[1]}")
    print(f"=======================================================")

    models = get_models(is_multiclass)
    results = []

    for name, model in models.items():
        start_time = time.time()
        print(f"  Training {name}...", end="", flush=True)
        model.fit(X_train, y_train)
        train_time = time.time() - start_time

        y_pred = model.predict(X_test)
        
        acc = accuracy_score(y_test, y_pred)
        
        if is_multiclass:
            prec = precision_score(y_test, y_pred, average="macro", zero_division=0)
            rec = recall_score(y_test, y_pred, average="macro", zero_division=0)
            f1 = f1_score(y_test, y_pred, average="macro", zero_division=0)
            auc_val = "N/A (Multiclass)"
            try:
                y_proba = model.predict_proba(X_test)
                auc_val = round(roc_auc_score(y_test, y_proba, multi_class="ovr"), 4)
            except Exception:
                pass
        else:
            prec = precision_score(y_test, y_pred, zero_division=0)
            rec = recall_score(y_test, y_pred, zero_division=0)
            f1 = f1_score(y_test, y_pred, zero_division=0)
            auc_val = "N/A"
            try:
                y_proba = model.predict_proba(X_test)[:, 1]
                auc_val = round(roc_auc_score(y_test, y_proba), 4)
            except Exception:
                pass

        cm = confusion_matrix(y_test, y_pred).tolist()

        res_dict = {
            "Dataset": dataset_name,
            "Model": name,
            "Accuracy": round(acc * 100, 2),
            "Precision": round(prec * 100, 2),
            "Recall": round(rec * 100, 2),
            "F1_Score": round(f1 * 100, 2),
            "ROC_AUC": auc_val,
            "Train_Time_Sec": round(train_time, 2),
            "Confusion_Matrix": cm
        }
        results.append(res_dict)
        print(f" Done in {train_time:.2f}s | Accuracy: {acc*100:.2f}% | F1: {f1*100:.2f}% | AUC: {auc_val}")

    return results

def process_dataset1():
    print("\n-------------------------------------------------------")
    print("DATASET 1: archive/diabetes_dataset.csv (Diabetes Risk)")
    print("-------------------------------------------------------")
    path = os.path.join(FOLDER, "archive", "diabetes_dataset.csv")
    df = pd.read_csv(path)
    
    # Continuous columns for outlier removal
    num_cols = ['age', 'bmi', 'hbA1c_level', 'blood_glucose_level']
    df_clean = remove_outliers_iqr(df, num_cols)

    # Encode categorical variables
    cat_cols = ['gender', 'location', 'smoking_history']
    for col in cat_cols:
        le = LabelEncoder()
        df_clean[col] = le.fit_transform(df_clean[col].astype(str))

    X = df_clean.drop(columns=['diabetes'])
    y = df_clean['diabetes'].values

    # Feature Scaling
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # 70-30 Train-Test Split (Stratified)
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.30, random_state=SEED, stratify=y)
    
    return evaluate_models(X_train, X_test, y_train, y_test, "Dataset 1: Diabetes Risk", is_multiclass=False)

def process_dataset2():
    print("\n-------------------------------------------------------")
    print("DATASET 2: archive (2)/healthcare_noshows_appt.csv (Appointment No-Shows)")
    print("-------------------------------------------------------")
    path = os.path.join(FOLDER, "archive (2)", "healthcare_noshows_appt.csv")
    df = pd.read_csv(path)

    # Remove invalid age values
    df = df[(df['Age'] >= 0) & (df['Age'] <= 100)]
    
    # Outlier removal on Age and Date.diff
    df_clean = remove_outliers_iqr(df, ['Age', 'Date.diff'])

    # Drop non-predictive identifier & timestamp columns
    drop_cols = ['PatientId', 'AppointmentID', 'ScheduledDay', 'AppointmentDay']
    df_clean = df_clean.drop(columns=[c for c in drop_cols if c in df_clean.columns])

    # Convert boolean / binary flags to int
    bool_cols = ['Scholarship', 'Hipertension', 'Diabetes', 'Alcoholism', 'Handcap', 'SMS_received', 'Showed_up']
    for col in bool_cols:
        if col in df_clean.columns:
            df_clean[col] = df_clean[col].astype(int)

    # Encode remaining categorical variables (Gender, Neighbourhood)
    cat_cols = ['Gender', 'Neighbourhood']
    for col in cat_cols:
        if col in df_clean.columns:
            le = LabelEncoder()
            df_clean[col] = le.fit_transform(df_clean[col].astype(str))

    X = df_clean.drop(columns=['Showed_up'])
    y = df_clean['Showed_up'].values

    # Feature Scaling
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # 70-30 Train-Test Split (Stratified)
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.30, random_state=SEED, stratify=y)

    return evaluate_models(X_train, X_test, y_train, y_test, "Dataset 2: Appointment No-Shows", is_multiclass=False)

def process_dataset3():
    print("\n-------------------------------------------------------")
    print("DATASET 3: archive (3)/2017.csv (Appointment Reservation)")
    print("-------------------------------------------------------")
    path = os.path.join(FOLDER, "archive (3)", "2017.csv")
    df = pd.read_csv(path)

    # Remove outliers on continuous features (edad, latencia)
    df_clean = remove_outliers_iqr(df, ['edad', 'latencia'])

    X = df_clean.drop(columns=['show'])
    y = df_clean['show'].values

    # Feature Scaling
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # 70-30 Train-Test Split (Stratified)
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.30, random_state=SEED, stratify=y)

    return evaluate_models(X_train, X_test, y_train, y_test, "Dataset 3: Appointment Reservation System", is_multiclass=False)

def process_dataset4():
    print("\n-------------------------------------------------------")
    print("DATASET 4: diabetes+130-us+hospitals+for+years+1999-2008/diabetic_data.csv (Hospital Readmissions)")
    print("-------------------------------------------------------")
    path = os.path.join(FOLDER, "diabetes+130-us+hospitals+for+years+1999-2008", "diabetic_data.csv")
    df = pd.read_csv(path)

    # Drop high missing / uninformative columns
    if 'weight' in df.columns:
        df = df.drop(columns=['weight'])
    drop_cols = ['encounter_id', 'patient_nbr']
    df = df.drop(columns=[c for c in drop_cols if c in df.columns])

    # Replace '?' missing values with 'Unknown'
    df = df.replace('?', 'Unknown')

    # Remove outliers on continuous numerical clinical columns
    num_cols = ['time_in_hospital', 'num_lab_procedures', 'num_procedures', 'num_medications', 'number_diagnoses']
    df_clean = remove_outliers_iqr(df, num_cols)

    # Encode target: readmitted (NO=0, >30=1, <30=2)
    le_target = LabelEncoder()
    df_clean['readmitted_encoded'] = le_target.fit_transform(df_clean['readmitted'])

    X = df_clean.drop(columns=['readmitted', 'readmitted_encoded'])
    y = df_clean['readmitted_encoded'].values

    # Label encode all categorical columns
    cat_cols = X.select_dtypes(include=['object', 'str']).columns
    for col in cat_cols:
        le = LabelEncoder()
        X[col] = le.fit_transform(X[col].astype(str))

    # Feature Scaling
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # 70-30 Train-Test Split (Stratified)
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.30, random_state=SEED, stratify=y)

    return evaluate_models(X_train, X_test, y_train, y_test, "Dataset 4: Hospital Readmission Triage", is_multiclass=True)

def main():
    all_results = []
    
    r1 = process_dataset1()
    all_results.extend(r1)

    r2 = process_dataset2()
    all_results.extend(r2)

    r3 = process_dataset3()
    all_results.extend(r3)

    r4 = process_dataset4()
    all_results.extend(r4)

    # Save results to JSON file
    json_path = os.path.join(FOLDER, "ml_model_results.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(all_results, f, indent=2)

    print("\n=======================================================")
    print(f"ALL ML MODELS SUCCESSFULLY TRAINED & EVALUATED!")
    print(f"Results saved to: {json_path}")
    print("=======================================================")

if __name__ == "__main__":
    main()

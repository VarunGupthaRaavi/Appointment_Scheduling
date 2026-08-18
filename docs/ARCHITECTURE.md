# CAREflow AI — System Architecture & Component Design

## Overview
**CAREflow AI** is a production-grade healthcare AI triage, appointment scheduling, and decision-support system built around **four trained & validated machine learning model pipelines**.

```
+-----------------------------------------------------------------------------------+
|                            CAREflow AI SYSTEM LAYERS                              |
+-----------------------------------------------------------------------------------+
|  Layer 1: React 18 + TypeScript + Vite + Tailwind CSS Single Page App             |
|  Layer 2: FastAPI (Python 3.12, Uvicorn, Pydantic v2, Joblib Singleton Loader)    |
|  Layer 3: Supabase Cloud Database (PostgreSQL, Supabase Auth, Row Level Security) |
|  Layer 4: Serialized Production Model Artifacts (.joblib Pipelines)               |
+-----------------------------------------------------------------------------------+
```

## Key Architectural Principles
1. **Zero Data Leakage**: Preprocessing transformers (`StandardScaler`, `OneHotEncoder`) were fitted exclusively on 70% training splits. Validation (15%) and Test (15%) splits were evaluated untouched.
2. **Scikit-Learn Pipeline Serialization**: All models are saved as complete `sklearn.pipeline.Pipeline` objects, allowing raw input DataFrames to pass directly to `.predict()` and `.predict_proba()`.
3. **Singleton Model Loading**: Models are loaded ONCE during FastAPI application startup via `ModelLoader`, preventing redundant I/O per API call.
4. **Data Isolation (RLS)**: Patient and Doctor records are isolated using Supabase Row Level Security policies.

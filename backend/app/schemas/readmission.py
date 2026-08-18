from pydantic import BaseModel, Field

class HospitalReadmissionInput(BaseModel):
    race: str = Field("Caucasian", description="Race category")
    gender: str = Field("Female", description="Gender (Female, Male)")
    age: str = Field("[60-70)", description="Age bracket e.g. [50-60), [60-70)")
    admission_type_id: int = Field(1, description="Admission type ID")
    discharge_disposition_id: int = Field(1, description="Discharge disposition ID")
    admission_source_id: int = Field(7, description="Admission source ID")
    time_in_hospital: int = Field(4, ge=1, le=14, description="Days spent in hospital")
    payer_code: str = Field("MC", description="Payer code e.g. MC, HM, Unknown")
    medical_specialty: str = Field("InternalMedicine", description="Medical specialty")
    num_lab_procedures: int = Field(43, description="Number of lab procedures performed")
    num_procedures: int = Field(1, description="Number of non-lab procedures")
    num_medications: int = Field(18, description="Number of distinct medications")
    number_outpatient: int = Field(0, description="Number of prior outpatient visits")
    number_emergency: int = Field(0, description="Number of prior emergency visits")
    number_inpatient: int = Field(1, description="Number of prior inpatient visits")
    diag_1: str = Field("250.02", description="Primary ICD-9 diagnosis code")
    diag_2: str = Field("401", description="Secondary ICD-9 diagnosis code")
    diag_3: str = Field("272", description="Tertiary ICD-9 diagnosis code")
    number_diagnoses: int = Field(7, description="Total recorded diagnoses count")
    max_glu_serum: str = Field("None", description="Glucose serum test result")
    A1Cresult: str = Field(">8", description="A1C lab test result")
    metformin: str = Field("No", description="Metformin dosage change")
    repaglinide: str = Field("No", description="Repaglinide dosage change")
    nateglinide: str = Field("No", description="Nateglinide dosage change")
    chlorpropamide: str = Field("No", description="Chlorpropamide dosage change")
    glimepiride: str = Field("No", description="Glimepiride dosage change")
    acetohexamide: str = Field("No", description="Acetohexamide dosage change")
    glipizide: str = Field("Steady", description="Glipizide dosage change")
    glyburide: str = Field("No", description="Glyburide dosage change")
    tolbutamide: str = Field("No", description="Tolbutamide dosage change")
    pioglitazone: str = Field("No", description="Pioglitazone dosage change")
    rosiglitazone: str = Field("No", description="Rosiglitazone dosage change")
    acarbose: str = Field("No", description="Acarbose dosage change")
    miglitol: str = Field("No", description="Miglitol dosage change")
    troglitazone: str = Field("No", description="Troglitazone dosage change")
    tolazamide: str = Field("No", description="Tolazamide dosage change")
    examide: str = Field("No", description="Examide dosage change")
    citoglipton: str = Field("No", description="Citoglipton dosage change")
    insulin: str = Field("Steady", description="Insulin dosage change")
    glyburide_metformin: str = Field("No", alias="glyburide-metformin", description="Glyburide-metformin dosage")
    glipizide_metformin: str = Field("No", alias="glipizide-metformin", description="Glipizide-metformin dosage")
    glimepiride_pioglitazone: str = Field("No", alias="glimepiride-pioglitazone", description="Glimepiride-pioglitazone dosage")
    metformin_rosiglitazone: str = Field("No", alias="metformin-rosiglitazone", description="Metformin-rosiglitazone dosage")
    metformin_pioglitazone: str = Field("No", alias="metformin-pioglitazone", description="Metformin-pioglitazone dosage")
    change: str = Field("Ch", description="Medication change indicator (Ch, No)")
    diabetesMed: str = Field("Yes", description="Diabetes medication prescribed (Yes, No)")
    total_prior_visits: int = Field(1, description="Aggregated prior visit count")

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "race": "Caucasian",
                "gender": "Female",
                "age": "[60-70)",
                "admission_type_id": 1,
                "discharge_disposition_id": 1,
                "admission_source_id": 7,
                "time_in_hospital": 4,
                "payer_code": "MC",
                "medical_specialty": "InternalMedicine",
                "num_lab_procedures": 43,
                "num_procedures": 1,
                "num_medications": 18,
                "number_outpatient": 0,
                "number_emergency": 0,
                "number_inpatient": 1,
                "diag_1": "250.02",
                "diag_2": "401",
                "diag_3": "272",
                "number_diagnoses": 7,
                "max_glu_serum": "None",
                "A1Cresult": ">8",
                "metformin": "No",
                "repaglinide": "No",
                "nateglinide": "No",
                "chlorpropamide": "No",
                "glimepiride": "No",
                "acetohexamide": "No",
                "glipizide": "Steady",
                "glyburide": "No",
                "tolbutamide": "No",
                "pioglitazone": "No",
                "rosiglitazone": "No",
                "acarbose": "No",
                "miglitol": "No",
                "troglitazone": "No",
                "tolazamide": "No",
                "examide": "No",
                "citoglipton": "No",
                "insulin": "Steady",
                "glyburide-metformin": "No",
                "glipizide-metformin": "No",
                "glimepiride-pioglitazone": "No",
                "metformin-rosiglitazone": "No",
                "metformin-pioglitazone": "No",
                "change": "Ch",
                "diabetesMed": "Yes",
                "total_prior_visits": 1
            }
        }

from fastapi import FastAPI
from pydantic import BaseModel, condecimal, conint
import pandas as pd
import numpy as np
from scipy.stats import norm
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

who_df = pd.read_csv("data/who_bmi_clean.csv")
lms_all_df = pd.read_csv("data/who_lms_all_clean.csv")

class EvaluationInput(BaseModel):
    sex: str
    age_months: conint(ge=0, le=228) # type: ignore
    weight: condecimal(gt=0) # type: ignore
    height: condecimal(gt=0) # type: ignore
    
class EvaluationResult(BaseModel):
    type: str
    value: float
    zscore: float
    percentile: float
    classification: str
    
def calculate_zscore(value, L, M, S):
    if L == 0:
        return np.log(value / M) / S
    else:
        return ((value / M) ** L - 1) / (L * S)
    
def zscore_to_percentile(z):
    return float(norm.cdf(z) * 100)

def classify_bmi(percentile):
    if percentile < 5:
        return "Bajo peso"
    elif percentile < 85:
        return "Peso normal"
    elif percentile < 95: 
        return "Sobrepeso"
    else:
        return "Obesidad"
    
def classify_hfa(z):
    if z < -2:
        return "Talla baja"
    elif z > 2:
        return "Talla alta"
    else:
        return "Talla normal"
    
def classify_wfa(z):
    if z < -3:
        return "Muy bajo peso"
    elif z < -2:
        return "Bajo peso"
    elif z > 2:
        return "Sobrepeso"
    else:
        return "Peso normal"
    
@app.post("/evaluate", response_model=EvaluationResult)
def evaluate(input: EvaluationInput):
    sex_code = 1 if input.sex.upper() == "M" else 2
    weight = float(input.weight)
    height = float(input.height)
    age_months = input.age_months
    
    imc = weight / (height ** 2)
    
    df = who_df[who_df["Sex"] == sex_code]
    row = df.iloc[(df["Month"] - age_months).abs().argsort().iloc[0]]

    L, M, S = row["L"], row["M"], row["S"]
    z = calculate_zscore(imc, L, M, S)
    p = zscore_to_percentile(z)
    category = classify_bmi(p)

    return EvaluationResult(
        type="IMC (WHO)",
        value=round(imc, 2),
        zscore=round(z, 2),
        percentile=round(p, 1),
        classification=category,
    )
    
@app.post("/evaluate-wfa", response_model=EvaluationResult)
def evaluate_wfa(input: EvaluationInput):
    sex_code = 1 if input.sex.upper() == "M" else 2
    weight = float(input.weight)
    age_months = input.age_months
    
    df = lms_all_df[(lms_all_df["Type"] == "WFA") & (lms_all_df["Sex"] == sex_code)]
    row = df.iloc[(df["Month"] - age_months).abs().argsort().iloc[0]]
    
    L, M, S = row["L"], row["M"], row["S"]
    z = calculate_zscore(weight, L, M, S)
    p = zscore_to_percentile(z)
    category = classify_wfa(z)
    
    return EvaluationResult(
        type="Peso por edad",
        value=round(weight, 2),
        zscore=round(z, 2),
        percentile=round(p, 1),
        classification=category
    )
    
@app.post("/evaluate-hfa", response_model=EvaluationResult)
def evaluate_hfa(input: EvaluationInput):
    sex_code = 1 if input.sex.upper() == "M" else 2
    height = float(input.height)
    age_months = input.age_months
    
    df = lms_all_df[(lms_all_df["Type"] == "HFA") & (lms_all_df["Sex"] == sex_code)]
    row = df.iloc[(df["Month"] - age_months).abs().argsort().iloc[0]]
    
    L, M, S = row["L"], row["M"], row["S"]
    z = calculate_zscore(height * 100, L, M, S)
    p = zscore_to_percentile(z)
    category = classify_hfa(z)
    
    return EvaluationResult(
        type="Altura por edad",
        value=round(height * 100, 1),
        zscore=round(z, 2),
        percentile=round(p, 1),
        classification=category
    )
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

def classify(percentile):
    if percentile < 5:
        return "Bajo peso"
    elif percentile < 85:
        return "Peso normal"
    elif percentile < 95: 
        return "Sobrepeso"
    else:
        return "Obesidad"
    
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
    category = classify(p)

    return EvaluationResult(
        type="IMC (WHO)",
        value=round(imc, 2),
        zscore=round(z, 2),
        percentile=round(p, 1),
        classification=category,
    )
from fastapi import FastAPI, Query
from pydantic import BaseModel, condecimal, conint, Field
from typing import Literal
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
    sex: str = Field(alias="sexo")
    age_months: conint(ge=0, le=228) = Field(alias="edad_meses") # type: ignore
    weight: condecimal(gt=0) = Field(alias="peso") # type: ignore
    height: condecimal(gt=0) = Field(alias="altura") # type: ignore

    class Config:
        allow_population_by_field_name = True
    
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
    
@app.post("/evaluate-calories")
def calculate_calories(
    input: EvaluationInput,
    actividad: Literal["sedentario", "moderado", "activo"] = Query("moderado")
):
    age_years = input.age_months / 12
    weight = float(input.weight)
    height = float(input.height)
    sex = input.sex
    age_months = input.age_months
    sex_code = 1 if sex == "M" else 2

    def schofield(weight, age, sex):
        if sex == "M":
            if age < 3:
                return 59.48 * weight - 30.33
            elif age < 10:
                return 22.7 * weight + 505
            else:
                return 13.4 * weight + 693
        else:
            if age < 3:
                return 58.29 * weight - 31.05
            elif age < 10:
                return 20.3 * weight + 486
            else:
                return 17.7 * weight + 659

    def oms(weight, age, sex):
        if sex == "M":
            if age < 3:
                return 60.9 * weight - 54
            elif age < 10:
                return 22.7 * weight + 495
            else:
                return 17.5 * weight + 651
        else:
            if age < 3:
                return 61 * weight - 51
            elif age < 10:
                return 22.4 * weight + 499
            else:
                return 12.2 * weight + 746

    tmb_schofield = schofield(weight, age_years, sex)
    tmb_oms = oms(weight, age_years, sex)

    fa_dict = {
        "sedentario": 1.3,
        "moderado": 1.5,
        "activo": 1.75
    }
    fa = fa_dict[actividad]
    get_schofield = tmb_schofield * fa
    get_oms = tmb_oms * fa

    imc = weight / (height ** 2)
    
    df = who_df[who_df["Sex"] == sex_code]
    row = df.iloc[(df["Month"] - age_months).abs().argsort().iloc[0]]
    
    L, M, S = row["L"], row["M"], row["S"]
    z = calculate_zscore(imc, L, M, S)
    p = zscore_to_percentile(z)
    category = classify_bmi(p)

    suggestion = None
    if category in ["Sobrepeso", "Obesidad"]:
        suggestion = f"Se sugiere un déficit suave de 200 kcal: {round(get_oms - 200, 2)} kcal/día como objetivo."

    return {
        "TMB (Schofield)": round(tmb_schofield, 2),
        "TMB (OMS)": round(tmb_oms, 2),
        "GET (Schofield)": round(get_schofield, 2),
        "GET (OMS)": round(get_oms, 2),
        "IMC": round(imc, 2),
        "Percentil IMC": round(p, 1),
        "Clasificación OMS": category,
        "Factor de actividad": fa,
        "Nivel de actividad": actividad,
        "Sugerencia": suggestion
    }

@app.post("/evaluate-all")
def evaluate_all(
    input: EvaluationInput,
    actividad: Literal["sedentario", "moderado", "activo"] = Query("moderado")
):
    from fastapi import Request
    
    def get_bmi_result():
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
        
        return {
            "type": "IMC (OMS)",
            "value": round(imc, 2),
            "zscore": round(z, 2),
            "percentile": round(p, 1),
            "classification": classify_bmi(p)
        }

    def get_hfa_result():
        sex_code = 1 if input.sex.upper() == "M" else 2
        height = float(input.height)
        age_months = input.age_months
        
        df = lms_all_df[(lms_all_df["Type"] == "HFA") & (lms_all_df["Sex"] == sex_code)]
        row = df.iloc[(df["Month"] - age_months).abs().argsort().iloc[0]]
        
        L, M, S = row["L"], row["M"], row["S"]
        z = calculate_zscore(height * 100, L, M, S)
        p = zscore_to_percentile(z)
        
        return {
            "type": "Altura por edad",
            "value": round(height * 100, 1),
            "zscore": round(z, 2),
            "percentile": round(p, 1),
            "classification": classify_hfa(z)
        }

    def get_wfa_result():
        sex_code = 1 if input.sex.upper() == "M" else 2
        weight = float(input.weight)
        age_months = input.age_months
        
        df = lms_all_df[(lms_all_df["Type"] == "WFA") & (lms_all_df["Sex"] == sex_code)]
        row = df.iloc[(df["Month"] - age_months).abs().argsort().iloc[0]]
        
        L, M, S = row["L"], row["M"], row["S"]
        z = calculate_zscore(weight, L, M, S)
        p = zscore_to_percentile(z)
        
        return {
            "type": "Peso por edad",
            "value": round(weight, 2),
            "zscore": round(z, 2),
            "percentile": round(p, 1),
            "classification": classify_wfa(z)
        }

    def get_caloric_result():
        edad = input.age_months / 12
        peso = float(input.weight)
        altura = float(input.height)
        sexo = input.sex
        edad_meses = input.age_months
        sex_code = 1 if sexo == "M" else 2

        def schofield(peso, edad, sexo):
            if sexo == "M":
                if edad < 3:
                    return 59.48 * peso - 30.33
                elif edad < 10:
                    return 22.7 * peso + 505
                else:
                    return 13.4 * peso + 693
            else:
                if edad < 3:
                    return 58.29 * peso - 31.05
                elif edad < 10:
                    return 20.3 * peso + 486
                else:
                    return 17.7 * peso + 659

        def oms(peso, edad, sexo):
            if sexo == "M":
                if edad < 3:
                    return 60.9 * peso - 54
                elif edad < 10:
                    return 22.7 * peso + 495
                else:
                    return 17.5 * peso + 651
            else:
                if edad < 3:
                    return 61 * peso - 51
                elif edad < 10:
                    return 22.4 * peso + 499
                else:
                    return 12.2 * peso + 746

        tmb_schofield = schofield(peso, edad, sexo)
        tmb_oms = oms(peso, edad, sexo)

        fa_dict = {
            "sedentario": 1.3,
            "moderado": 1.5,
            "activo": 1.75
        }
        fa = fa_dict[actividad]
        get_schofield = tmb_schofield * fa
        get_oms = tmb_oms * fa

        imc = peso / (altura ** 2)
        df = who_df[who_df["Sex"] == sex_code]
        row = df.iloc[(df["Month"] - edad_meses).abs().argsort().iloc[0]]
        L, M, S = row["L"], row["M"], row["S"]
        z = calculate_zscore(imc, L, M, S)
        p = zscore_to_percentile(z)
        clasificacion = classify_bmi(p)

        sugerencia = None
        if clasificacion in ["Sobrepeso", "Obesidad"]:
            sugerencia = f"Se sugiere un déficit suave de 200 kcal: {round(get_oms - 200, 2)} kcal/día como objetivo."

        return {
            "TMB (Schofield)": round(tmb_schofield, 2),
            "TMB (OMS)": round(tmb_oms, 2),
            "GET (Schofield)": round(get_schofield, 2),
            "GET (OMS)": round(get_oms, 2),
            "IMC": round(imc, 2),
            "Percentil IMC": round(p, 1),
            "Clasificación OMS": clasificacion,
            "Factor de actividad": fa,
            "Nivel de actividad": actividad,
            "Sugerencia": sugerencia
        }

    return {
        "imc": get_bmi_result(),
        "peso_por_edad": get_wfa_result(),
        "altura_por_edad": get_hfa_result(),
        "calorias": get_caloric_result()
    }
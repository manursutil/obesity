from fastapi import FastAPI, Query
from pydantic import BaseModel, condecimal, conint, Field
from typing import Literal
import pandas as pd
import numpy as np
from scipy.stats import norm
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv  # type: ignore
import os
import json
import re
from google import genai  # type: ignore
from google.genai import types  # type: ignore

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

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
    age_months: conint(ge=0, le=228) = Field(alias="edad_meses")  # type: ignore
    weight: condecimal(gt=0) = Field(alias="peso")  # type: ignore
    height: condecimal(gt=0) = Field(alias="altura")  # type: ignore

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
    p = float(norm.cdf(z) * 100)
    if p > 97:
        return {"percentile": p, "label": "Por encima del percentil 97"}
    elif p < 3:
        return {"percentile": p, "label": "Por debajo del percentil 3"}
    return {"percentile": p, "label": None}


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


def get_nutritional_reference(age_months: int, sex: str):
    edad = age_months / 12
    reference = {
        "4-5": {
            "kcal": 1700, "proteinas_g": 30, "Ca_mg": 700, "Fe_mg": 9,
            "Zn_mg": 10, "Vitamina_C_mg": 55, "Vitamina_D_ug": 15
        },
        "6-9": {
            "kcal": 2000, "proteinas_g": 36, "Ca_mg": 800, "Fe_mg": 9,
            "Zn_mg": 10, "Vitamina_C_mg": 55, "Vitamina_D_ug": 15
        },
        "10-12_M": {
            "kcal": 2450, "proteinas_g": 43, "Ca_mg": 1300, "Fe_mg": 12,
            "Zn_mg": 15, "Vitamina_C_mg": 60, "Vitamina_D_ug": 15
        },
        "10-12_F": {
            "kcal": 2300, "proteinas_g": 41, "Ca_mg": 1300, "Fe_mg": 18,
            "Zn_mg": 15, "Vitamina_C_mg": 60, "Vitamina_D_ug": 15
        },
        "13-15_M": {
            "kcal": 2750, "proteinas_g": 54, "Ca_mg": 1300, "Fe_mg": 12,
            "Zn_mg": 15, "Vitamina_C_mg": 60, "Vitamina_D_ug": 15
        },
        "13-15_F": {
            "kcal": 2500, "proteinas_g": 45, "Ca_mg": 1300, "Fe_mg": 18,
            "Zn_mg": 15, "Vitamina_C_mg": 60, "Vitamina_D_ug": 15
        },
        "16-19_M": {
            "kcal": 3000, "proteinas_g": 56, "Ca_mg": 1300, "Fe_mg": 15,
            "Zn_mg": 15, "Vitamina_C_mg": 60, "Vitamina_D_ug": 15
        },
        "16-19_F": {
            "kcal": 2300, "proteinas_g": 43, "Ca_mg": 1300, "Fe_mg": 18,
            "Zn_mg": 15, "Vitamina_C_mg": 60, "Vitamina_D_ug": 15
        }
    }
    if 4 <= edad < 6:
        return reference["4-5"]
    elif 6 <= edad < 10:
        return reference["6-9"]
    elif 10 <= edad < 13:
        return reference[f"10-12_{'M' if sex.upper() == 'M' else 'F'}"]
    elif 13 <= edad < 16:
        return reference[f"13-15_{'M' if sex.upper() == 'M' else 'F'}"]
    else:
        return reference[f"16-19_{'M' if sex.upper() == 'M' else 'F'}"]


@app.post("/evaluate-all")
def evaluate_all(
    input: EvaluationInput,
    actividad: Literal["sedentario", "moderado", "activo"] = Query("moderado")
):
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
        p_result = zscore_to_percentile(z)
        p = p_result["percentile"]
        label = p_result["label"]
        clasificacion = classify_bmi(p)

        return {
            "type": "IMC (OMS)",
            "value": round(imc, 2),
            "zscore": round(z, 2),
            "percentile": p,
            "classification": clasificacion,
            "percentile_label": label
        }

    def get_hfa_result():
        sex_code = 1 if input.sex.upper() == "M" else 2
        height = float(input.height)
        age_months = input.age_months

        df = lms_all_df[(lms_all_df["Type"] == "HFA") & (lms_all_df["Sex"] == sex_code)]
        row = df.iloc[(df["Month"] - age_months).abs().argsort().iloc[0]]

        L, M, S = row["L"], row["M"], row["S"]
        z = calculate_zscore(height * 100, L, M, S)
        p_result = zscore_to_percentile(z)
        p = p_result["percentile"]

        classification = classify_hfa(z)

        return {
            "type": "Altura por edad",
            "value": round(height * 100, 1),
            "zscore": round(z, 2),
            "percentile": round(p, 1),
            "classification": classification
        }

    def get_wfa_result():
        sex_code = 1 if input.sex.upper() == "M" else 2
        weight = float(input.weight)
        age_months = input.age_months

        df = lms_all_df[(lms_all_df["Type"] == "WFA") & (lms_all_df["Sex"] == sex_code)]
        row = df.iloc[(df["Month"] - age_months).abs().argsort().iloc[0]]

        L, M, S = row["L"], row["M"], row["S"]
        z = calculate_zscore(weight, L, M, S)
        p_result = zscore_to_percentile(z)
        p = p_result["percentile"]

        classification = classify_wfa(z)

        return {
            "type": "Peso por edad",
            "value": round(weight, 2),
            "zscore": round(z, 2),
            "percentile": round(p, 1),
            "classification": classification
        }

    def get_caloric_result():
        edad = input.age_months / 12
        peso = float(input.weight)
        altura = float(input.height)
        sexo = input.sex
        edad_meses = input.age_months
        sex_code = 1 if sexo.upper() == "M" else 2

        def schofield(peso, edad, sexo):
            if sexo.upper() == "M":
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
            if sexo.upper() == "M":
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
        p_result = zscore_to_percentile(z)
        p = p_result["percentile"]
        label = p_result["label"]
        clasificacion = classify_bmi(p)

        def caloric_target(get_oms_val, age_years, bmi_class):
            if bmi_class in ["Sobrepeso", "Obesidad"]:
                if age_years < 6:
                    target = get_oms_val
                    return target, f"Mantener peso; posible déficit suave de 100-200 kcal solo si el clínico lo indica. Objetivo: {round(target, 2)} kcal/día"
                elif age_years < 12:
                    target = max(get_oms_val - 150, get_oms_val * 0.9)
                    return target, f"Déficit moderado de ~150 kcal/día con seguimiento del crecimiento. Objetivo: {round(target, 2)} kcal/día"
                else:
                    target = max(get_oms_val - 250, get_oms_val * 0.85)
                    return target, f"Déficit de 250-500 kcal/día con objetivo ≤0.9 kg/semana. Objetivo: {round(target, 2)} kcal/día"
            else:
                target = get_oms_val
                return target, f"No se requiere déficit; mantener un patrón saludable. Objetivo: {round(target, 2)} kcal/día"

        target_kcal, sugerencia_text = caloric_target(get_oms, edad, clasificacion)

        return {
            "TMB (Schofield)": round(tmb_schofield, 2),
            "TMB (OMS)": round(tmb_oms, 2),
            "GET (Schofield)": round(get_schofield, 2),
            "GET (OMS)": round(get_oms, 2),
            "IMC": round(imc, 2),
            "Percentil IMC": p,
            "Clasificación OMS": clasificacion,
            "percentile_label": label,
            "Factor de actividad": fa,
            "Nivel de actividad": actividad,
            "Sugerencia": sugerencia_text
        }

    return {
        "imc": get_bmi_result(),
        "peso_por_edad": get_wfa_result(),
        "altura_por_edad": get_hfa_result(),
        "calorias": get_caloric_result()
    }


@app.post("/generate-mealplan")
def generate_mealplan(input: EvaluationInput, actividad: Literal["sedentario", "moderado", "activo"] = Query("moderado")):
    results = evaluate_all(input, actividad)
    get_oms_kcal = results["calorias"]["GET (OMS)"]
    sugerencia_str = results["calorias"].get("Sugerencia") or ""

    objetivo_kcal = None
    m = re.search(r"Objetivo:\s*([0-9]+(?:\.[0-9]+)?)\s*kcal", sugerencia_str, re.IGNORECASE)
    if m:
        try:
            objetivo_kcal = float(m.group(1))
        except ValueError:
            objetivo_kcal = None

    objetivo_kcal = objetivo_kcal or get_oms_kcal

    referencias = get_nutritional_reference(input.age_months, input.sex)

    response_format = {
        "plan": {
            day: {
                "calorias_totales": 0,
                "macros": {
                    "carbohidratos": 0,
                    "proteinas": 0,
                    "grasas": 0
                },
                "comidas": {
                    "desayuno": [],
                    "media_manana": [],
                    "almuerzo": [],
                    "merienda": [],
                    "cena": []
                }
            } for day in ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"]
        }
    }

    prompt = f"""
        Eres un nutricionista pediátrico. Genera un menú semanal con 3 comidas principales y 2 meriendas para un niño con los siguientes datos:
        - Sexo: {input.sex}
        - Edad en meses: {input.age_months}
        - Peso: {input.weight} kg
        - Altura: {input.height} m
        - Clasificación OMS: {results['calorias']['Clasificación OMS']}
        - GET diario (OMS): {get_oms_kcal} kcal
        - Sugerencia (texto + objetivo): {sugerencia_str}
        - Objetivo kcal/día a usar para el plan: {objetivo_kcal} kcal

        Reglas:
        - Ajusta cada día a ~{objetivo_kcal} kcal/día (tolerancia ±5%).
        - Reparte macros de forma razonable acorde a la edad y referencias.
        - Usa alimentos comunes y sencillos de preparar.
        - Mantén variedad entre días.
        - No incluyas texto explicativo fuera del JSON.
        - La dieta debe ser adaptada a un público predominantemente canario, latinoamericano y marroquí.

        Guía nutricional de referencia:
        {json.dumps(referencias, indent=2, ensure_ascii=False)}

        Devuelve únicamente un JSON válido, sin texto adicional, con el siguiente formato:
        {json.dumps(response_format, indent=2, ensure_ascii=False)}
    """

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                thinking_config=types.ThinkingConfig(thinking_budget=0)
            )
        )

        text = response.text.strip()

        if text.startswith("```json"):
            text = text.lstrip("```json").rstrip("```").strip()
        elif text.startswith("```"):
            text = text.lstrip("```").rstrip("```").strip()

        try:
            return json.loads(text)
        except json.JSONDecodeError:
            return {
                "error": "La respuesta no es JSON válido.",
                "raw_output": text
            }

    except Exception as e:
        return {"error": str(e)}

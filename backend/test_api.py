import httpx # type: ignore

BASE_URL = "http://localhost:8000"

payload = {
    "sexo": "M",
    "edad_meses": 96,
    "peso": 30.5,
    "altura": 1.34
}

def test_evaluate_all():
    response = httpx.post(f"{BASE_URL}/evaluate-all", json=payload)
    print("POST (/evaluate-all):")
    print("Status:", response.status_code)
    print("Response:", response.json())
    print()

def test_generate_mealplan():
    response = httpx.post(f"{BASE_URL}/generate-mealplan", json=payload, timeout=50)
    print("POST (/evaluate-mealplan):")
    print("Status:", response.status_code)
    try:
        data = response.json()
        print("Plan keys:", list(data["plan"].keys()))
    except Exception as e:
        print("Failed to parse JSON:", e)
        print("Raw response:", response.text)

if __name__ == "__main__":
    test_evaluate_all()
    test_generate_mealplan()

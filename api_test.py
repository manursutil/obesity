import requests

BASE_URL = "http://localhost:8000"

data = {
    "sex": "F",           # Female
    "age_months": 60,      # 5 years
    "weight": 18,            # kg
    "height": 1.05         # m
}

def print_response(endpoint, response):
    print(f"\nTesting {endpoint}")
    if response.status_code == 200:
        result = response.json()
        for key, value in result.items():
            print(f"{key.capitalize()}: {value}")
    else:
        print("Error:", response.status_code, response.text)

# Test BMI (IMC)
r_bmi = requests.post(f"{BASE_URL}/evaluate", json=data)
print_response("BMI (/evaluate)", r_bmi)

# Test Height-for-Age
r_hfa = requests.post(f"{BASE_URL}/evaluate-hfa", json=data)
print_response("Height-for-age (/evaluate-hfa)", r_hfa)

# Test Weight-for-Age
r_wfa = requests.post(f"{BASE_URL}/evaluate-wfa", json=data)
print_response("Weight-for-age (/evaluate-wfa)", r_wfa)

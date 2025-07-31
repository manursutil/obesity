import requests

API_URL = "http://localhost:8000/evaluate"

input = {
    "sex": "F",
    "age_months": 60,
    "weight": 18,
    "height": 1.05
}

response = requests.post(API_URL, json=input)

if response.status_code == 200:
    data = response.json()
    print("API Response:")
    for key, value in data.items():
        print(f"{key.capitalize()}: {value}")
else:
    print("API Error:", response.status_code)
    print(response.text)
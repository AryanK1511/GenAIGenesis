# Backend

## Running the backend locally

To run the backend locally, follow these steps:

```sh
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
fastapi dev app/main.py # Run in Development
fastapi run app/main.py # Run in Production
```

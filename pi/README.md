# Python Environment
`python3 -m venv .venv`

### Navigation
`source .venv/bin/activate`
`deactivate`

### Requirements Freeze
`pip freeze > requirements.txt`

### Install Packages
`pip install -r requirements.txt`

### Pigpio
`sudo pigpiod`

### Environment Variables
Create a `.env` file in the project directory with the following content:
```
WEBSOCKET_URI=wss://your-websocket-uri-here
```

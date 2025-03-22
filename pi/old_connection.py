''' This is a template for what the backend can follow '''

#!/usr/bin/env python

from websockets.sync.client import connect

def hello():
    uri = "wss://43ae-138-51-73-84.ngrok-free.app/ws/click-picture"
    with connect(uri) as websocket:
        while True:
            message = websocket.recv()
            print(f"<<< {message}")

if __name__ == "__main__":
    hello()
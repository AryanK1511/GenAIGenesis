''' This is a template for what the backend can follow '''

#!/usr/bin/env python

from websockets.sync.client import connect

def hello():
    uri = "ws://localhost:8765"
    with connect(uri) as websocket:
        while True:
            message = websocket.recv()
            print(f"<<< {message}")

if __name__ == "__main__":
    hello()
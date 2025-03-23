import asyncio
import json
import RPi.GPIO as GPIO
from websockets import connect
from flip import flip
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Set up GPIO
GPIO.setmode(GPIO.BOARD)
GPIO.setup(15, GPIO.IN)

async def send_message(websocket, action):
    message = {"action": action}
    await websocket.send(json.dumps(message))
    print(f"Sent >>> {message}")

async def wait_for_start():
    print("Waiting for 'start' action...")
    while True:
        if GPIO.input(15):
            print("-- Starting --")
            break
        await asyncio.sleep(0.1)
        

async def main():
    uri = os.getenv("WEBSOCKET_URI")
    if not uri:
        raise ValueError("WEBSOCKET_URI is not set in the .env file")
    async with connect(uri) as websocket:
        await asyncio.sleep(2)  # Wait for the connection to be established
        while True:
            await wait_for_start()

            # Start the camera
            print("-- Sending 'start' action --")
            await send_message(websocket, "start")
            await asyncio.sleep(3)

            # Perform 3 picture clicks
            for i in range(3):
                print(f"--- Clicking picture {i + 1} ---")
                await send_message(websocket, "click")

                print("-- Flipping --")
                flip()
                print("-- Done Flipping --")

                await asyncio.sleep(3)  # Simulate delay between clicks

            print("-- Sending 'end' action --")
            await send_message(websocket, "end")

if __name__ == "__main__":
    asyncio.run(main())

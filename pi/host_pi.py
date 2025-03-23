import asyncio
import json
import RPi.GPIO as GPIO
from websockets import connect
from flip import flip

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
    uri = "wss://a294-138-51-73-84.ngrok-free.app/ws/click-picture"
    async with connect(uri) as websocket:
        await asyncio.sleep(1)  # Wait for the connection to be established
        while True:
            await wait_for_start()

            # Start the camera
            print("-- Sending 'start' action --")
            await send_message(websocket, "start")

            # Perform 3 picture clicks
            for i in range(3):

                print("-- Flipping --")
                flip()
                print("-- Done Flipping --")

                print(f"--- Clicking picture {i + 1} ---")
                await send_message(websocket, "click")
                await asyncio.sleep(5)  # Simulate delay between clicks

            # Process the accumulated text
            print("-- Sending 'end' action --")
            await send_message(websocket, "end")

if __name__ == "__main__":
    asyncio.run(main())

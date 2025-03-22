import asyncio
import json
from websockets import connect

async def send_message(websocket, action):
    message = {"action": action}
    await websocket.send(json.dumps(message))
    print(f"Sent >>> {message}")

async def main():
    uri = "wss://43ae-138-51-73-84.ngrok-free.app/ws/click-picture"
    async with connect(uri) as websocket:
        # Start the camera
        print("-- Sending 'start' action --")
        await send_message(websocket, "start")

        # Perform 3 picture clicks
        for i in range(10):
            print(f"--- Clicking picture {i + 1} ---")
            await send_message(websocket, "click")
            await asyncio.sleep(5)  # Simulate delay between clicks

        # Process the accumulated text
        print("-- Sending 'process' action --")
        await send_message(websocket, "process")

        # Keep the connection alive indefinitely
        while True:
            await asyncio.sleep(1)  # Prevent the script from exiting

if __name__ == "__main__":
    asyncio.run(main())
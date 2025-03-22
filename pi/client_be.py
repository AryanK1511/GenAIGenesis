"""Echo backend using the asyncio API."""

import asyncio

from flip import flip
from websockets.asyncio.server import serve


async def send_message(wbs, msg):
    await wbs.send(msg)
    print(f"sent >>> {msg}")


async def hello(websocket):
    await send_message(websocket, "start")
    for i in range(3):
        print("--- Pi fliping ---")
        await flip()
        print("--- Pi flipping Completed ---")
        await asyncio.sleep(5)
        await send_message(websocket, "click")
    await send_message(websocket, "process")


async def main():
    async with serve(
        hello, "wss://76ad-138-51-73-84.ngrok-free.app/ws/click-picture", 8765
    ) as server:
        await server.serve_forever()


if __name__ == "__main__":
    asyncio.run(main())

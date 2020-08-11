# WS server example that synchronizes state across clients
# https://websockets.readthedocs.io/en/stable/api.html

import asyncio
import json
import logging
import websockets

logging.basicConfig()
logger = logging.getLogger("server")

STATE = {"completed": 0, "log": ""}

USERS = set()


def state_event():
    return json.dumps({"type": "state", **STATE})


def users_event():
    return json.dumps({"type": "users", "count": len(USERS)})


async def notify_state():
    if USERS:  # asyncio.wait doesn't accept an empty list
        message = state_event()
        await asyncio.wait([user.send(message) for user in USERS])


async def notify_users():
    if USERS:  # asyncio.wait doesn't accept an empty list
        message = users_event()
        await asyncio.wait([user.send(message) for user in USERS])


async def register(websocket):
    USERS.add(websocket)
    await notify_users()


async def unregister(websocket):
    USERS.remove(websocket)
    await notify_users()


async def counter(websocket, path):
    # register(websocket) sends user_event() to websocket
    await register(websocket)
    try:
        await websocket.send(state_event())
        async for message in websocket:            
            data = json.loads(message)

            # print(f"Data: {data}")

            if data["action"] == "doTask":
                STATE["completed"] += 1    
                STATE["log"] = r"c:\temp\pytest.ini"
                await notify_state()
            else:
                logger.error("unsupported action: %s", data)
    finally:
        await unregister(websocket)


start_server = websockets.serve(counter, "localhost", 6789)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
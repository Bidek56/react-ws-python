# WS server example that synchronizes state across clients
# https://websockets.readthedocs.io/en/stable/api.html

import asyncio
import json, logging, websockets
import jwt, bcrypt

logging.basicConfig()
logger = logging.getLogger("server")

STATE = {"completed": 0, "log": ""}

USERS = set()
authenticated_users = set()

SECRET = "H3EgqdTJ1SqtOekMQXxwufbo2iPpu89O"

hashed_pass = "$2b$12$/VWCBS3QHwrKcJNuKV3CL.dAhsJGDI5NDa3bcvRoDopJsLgAj1/6W"

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

            print(f"Msg {message}")

            if data["action"] == "doTask":
                STATE["completed"] += 1    
                STATE["log"] = r"c:\temp\pytest.ini"
                await notify_state()
            elif data["action"] == "doLogin":
                if 'login' in data:                    
                    login = data['login']
                    print(f"Login: {login}")

                    user = login["user"]
                    password = login["pass"]

                    if bcrypt.checkpw(password.encode('utf8'), hashed_pass.encode('utf8')):
                        print(f"Password for user: {user} matches!")
                        encoded = jwt.encode({'user': user}, SECRET, algorithm='HS256')
                        # print(f"Enc: {encoded}")

                        authenticated_users.discard(user)  # removes x from set s if present
                        authenticated_users.add(user)  # add new user

                        print(f"authenticated_users: {authenticated_users}")

                        await asyncio.wait([websocket.send(json.dumps({ "type": "token", "user": user, "token": encoded.decode('utf8')}))])
                    else:
                        logger.error(f"Password for user: {user} does not Match :(")
                else:
                    logger.error("Login data missing from data: %s", data)

            elif data["action"] == "doLogout":
                if 'logout' in data:
                    logout = data['logout']
                    user = logout["user"]
                    authenticated_users.discard(user)  # removes x from set s if present

                    print(f"authenticated_users: {authenticated_users}")
                # await notify_state()
            else:
                logger.error("unsupported action: %s", data)
    finally:
        await unregister(websocket)


start_server = websockets.serve(counter, "localhost", 6789)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
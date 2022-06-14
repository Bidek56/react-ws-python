import unittest, json, websockets, asyncio

class TestApp(unittest.TestCase):

    def test_sender(self):
        async def inner():
            async with websockets.connect('ws://localhost:6789') as conn:
                await conn.send(json.dumps({ "action": "doLogout", "logout": { "user": "user" }}))

                msg = await conn.recv()
                self.assertEqual(msg, '{"type": "users", "count": 1}' )

        return asyncio.run(inner())

if __name__ == '__main__':
    unittest.main()
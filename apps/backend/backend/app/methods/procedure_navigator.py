from typing import List

from fastapi import WebSocket


class Connection:
    def __init__(self, participant_id: int, websocket: WebSocket):
        print("CONNECTION: " + str(participant_id))
        self.participant_id = participant_id
        self.websocket = websocket


class ConnectionManager:
    def __init__(self):
        self.active_connections: List[Connection] = []

    def get_connection(self, participant_id: int):
        print("CONNNNECTIONS")
        print(self.active_connections)
        return next((c for c in self.active_connections if c.participant_id == participant_id), None)

    async def connect(self, participant_id: int, websocket: WebSocket):
        await websocket.accept()
        connection = self.get_connection(participant_id)
        if not connection:
            self.active_connections.append(Connection(participant_id, websocket))

    def disconnect(self, participant_id):
        connection = self.get_connection(participant_id)
        if connection:
            self.active_connections.remove(connection)

    async def send_personal_message(self, message: str, participant_id):
        print("POERANNNSL")
        connection = self.get_connection(participant_id)
        print(connection)
        if connection:
            await connection.websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.websocket.send_text(message)

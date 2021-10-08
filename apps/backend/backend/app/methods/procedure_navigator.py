import asyncio

from schema.procedure_navigator import ProcedureNavigatorConnection, ProcedureNavigatorStateEnum
from fastapi import Request


class ProcedureNavigator(object):

    # connection_pool is a dict with the schema seen in static method build_connection()
    def __init__(self):
        self.connection_pool = {}

    def subscribe(self, participant_id: int, procedure_step_id: int, state: ProcedureNavigatorStateEnum):
        connection = self.build_connection(participant_id, procedure_step_id, state)
        self.connection_pool.update(connection)

    def unsubscribe(self, participant_id: int):
        if self.connection_pool.get(participant_id):
            del self.connection_pool[participant_id]

    def update_connection(self, participant_id: int, procedure_step_id: int, state: ProcedureNavigatorStateEnum):
        connection = self.build_connection(participant_id, procedure_step_id, state)
        if self.connection_pool.get(participant_id):
            self.connection_pool.update(connection)

    def get_connection(self, participant_id: int):
        print(self.connection_pool)
        return self.connection_pool.get(participant_id)

    @staticmethod
    def build_connection(participant_id: int, procedure_step_id: int, state: ProcedureNavigatorStateEnum):
        return {participant_id: ProcedureNavigatorConnection(procedure_step_id=procedure_step_id, state=state)}


async def navigator_sse(request: Request, procedure_navigator: ProcedureNavigator, participant_id: int):
    delay = 5
    retry_timeout = 5000
    previous_navigator_state = None
    event_id = 0
    no_sub_count = 0
    while True:

        print(previous_navigator_state)
        # Unsubscribe participant if disconnected
        if await request.is_disconnected():
            print("DISCONNECTED FROM NAVIGATOR")
            procedure_navigator.unsubscribe(participant_id)
            break

        # Send unsubscribed message
        if previous_navigator_state and not procedure_navigator.get_connection(participant_id):
            print("UNSUBSCRIBED FROM NAVIGATOR")
            yield {
                "id": event_id,
                "event": "participant_unsubscribed",
                "data": {
                    "participant_id": participant_id
                }
            }
            break

        # Send subscribe message to client
        if not previous_navigator_state and procedure_navigator.get_connection(participant_id):
            print("SUBSCRIBED TO NAVIGATOR")
            yield {
                "id": event_id,
                "event": "participant_subscribed",
                "data": {
                    "participant_id": participant_id
                }
            }
            
        if not previous_navigator_state and not procedure_navigator.get_connection(participant_id):
            if no_sub_count == 3:
                print("NO SUB ON NAVIGATOR, BREAK")
                break
            no_sub_count = no_sub_count + 1

        current_navigator_state = procedure_navigator.get_connection(participant_id)
        if current_navigator_state != previous_navigator_state:
            print("NAVIGATOR STATE CHANGED")
            yield {
                "id": event_id,
                "event": "state_change",
                "retry": retry_timeout,
                "data": current_navigator_state.json()
            }
            previous_navigator_state = current_navigator_state
        else:
            print('No change in status...')

        event_id = event_id + 1
        await asyncio.sleep(delay)
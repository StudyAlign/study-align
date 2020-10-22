import uuid

from fastapi import HTTPException
from requests import Response

# legacy method to check soscisurvey results
# TODO: remove in near future
def check_questionnaire_results_soscisurvey(response: Response, participant_token: uuid.UUID):
    if response.status_code != 200:
        raise HTTPException(status_code=409, detail="Failed to check questionnaire results.")
    print(response.json())
    json_data = response.json().get("data")
    for case in json_data:
        c = json_data.get(case)
        if c.get("REF") == str(participant_token) and c.get("FINISHED") == 1:
            return c
    return None


def check_questionnaire_results_limesurvey(response: Response, participant_token: uuid.UUID):
    if response.status_code != 200:
        raise HTTPException(status_code=409, detail="Failed to check questionnaire results.")
    print(response.json())
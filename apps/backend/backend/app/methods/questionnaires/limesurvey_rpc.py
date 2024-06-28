import json
import os
from collections import OrderedDict
from typing import List
from uuid import UUID

import requests

from fastapi import HTTPException

# DEPRECATED! Only here for legacy documentation
class LimeSurvey(object):
    """
    Adaption of https://github.com/lindsay-stevens/limesurveyrc2api
    """

    def __init__(self, url: str, username: str):
        self.headers = {"content-type": "application/json"}
        self.url = url
        self.username = username
        self.session_key = None

    def format_participant_token(self, participant_token):
        return str(participant_token).replace('-', '')

    def get_session_key(self, password: str):
        method = "get_session_key"
        params = OrderedDict([
            ("username", self.username),
            ("password", password),
            ("plugin", "Authdb")
        ])
        response = self._query(method=method, params=params)

        if type(response) is str:
            self.session_key = response
        else:
            error = self.error_builder(method, "Session Key is no string", response.status_code, response.content)
            raise HTTPException(status_code=403, detail=error)

    def release_session_key(self):
        method = "release_session_key"
        params = OrderedDict([
            ("sSessionKey", self.session_key)
        ])
        response = self._query(method=method, params=params)

        if response == "OK":
            self.session_key = None
        else:
            error = self.error_builder(method, "Did not receive OK message.", response.status_code, response.content)
            raise HTTPException(status_code=400, detail=error)
        return response

    def export_responses_by_token(self, survey_id: int = None, token: UUID = None, language_code: str = "en"):
        method = "export_responses_by_token"
        params = OrderedDict([
            ("sSessionKey", self.session_key),
            ("iSurveyID", survey_id),
            ("sDocumentType", "json"),
            ("sToken", str(token)),
            ("sLanguageCode", language_code),
            ("sCompletionStatus", "complete"),
            ("sResponseType", "full")
        ])
        response = self._query(method=method, params=params)
        return response

    def add_participants(self, survey_id: int = None, participants: List = None):
        method = "add_participants"
        params = OrderedDict([
            ("sSessionKey", self.session_key),
            ("iSurveyID", survey_id),
            ("aParticipantData", participants),
            ("bCreateToken", False)
        ])
        response = self._query(method=method, params=params)
        return response

    def get_participant_properties(self, survey_id: int = None, token: UUID = None):
        method = "get_participant_properties"
        params = OrderedDict([
            ("sSessionKey", self.session_key),
            ("iSurveyID", survey_id),
            ("aTokenQueryProperties", {"token": str(token)}),
        ])
        response = self._query(method=method, params=params)
        return response

    @staticmethod
    def error_builder(method, *args):
        base_err = "LimeSurvey RPC error"
        message = [base_err, method]
        if args is not None:
            message += [str(x) for x in args]
        return "; ".join(message)

    def _query(self, method, params):
        if not self.session_key and not method == "get_session_key":
            raise HTTPException(status_code=400, detail="Get session key first.")

        data = OrderedDict([
            ("method", method),
            ("params", params),
            ("id", 1)
        ])
        data_json = json.dumps(data)

        response = requests.post(
            self.url, headers=self.headers, data=data_json)

        if not response.ok:
            error = self.error_builder(method, "Response not ok", response.status_code, response.content)
            raise HTTPException(status_code=400, detail=error)

        if not len(response.content) > 0:
            error = self.error_builder(method, "Response content is empty", response.status_code, response.content)
            raise HTTPException(status_code=400, detail=error)


        print(response)
        response_data = response.json()
        if response_data.get("error") is not None:
            error = self.error_builder(method, "Response error", response.status_code, response.content)
            raise HTTPException(status_code=400, detail=error)

        return_value = response_data.get("result")
        if not return_value:
            error = self.error_builder(method, "Key 'result' not in response json", response.status_code,
                                       response.content)
            raise HTTPException(status_code=400, detail=error)

        if "status" in return_value:
            status = return_value.get("status")
            error = self.error_builder(method, status, response.status_code)
            raise HTTPException(status_code=400, detail=error)

        if type(return_value) is list:
            errors = [data.get("errors") for data in return_value if "errors" in data]
            if errors:
                error = self.error_builder(method, response.status_code, errors)
                raise HTTPException(status_code=400, detail=error)

        return return_value

import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useDispatch } from "react-redux";
import { Table, Badge } from "react-bootstrap";

import { apiWithAuth, getStudyFormResponsesApi } from "../../api/studyAlignApi";

export default function FormResponses() {
    const { study_id } = useParams();
    const dispatch = useDispatch();
    const [responses, setResponses] = useState(null);

    useEffect(() => {
        apiWithAuth(getStudyFormResponsesApi, study_id, dispatch)
            .then((res) => setResponses(res.body || []))
            .catch(() => setResponses([]));
    }, [study_id, dispatch]);

    if (responses == null) return <div className="text-muted">Loading...</div>;

    return (
        <div>
            <h4 className="mb-3">Questionnaire responses</h4>
            {responses.length === 0 ? (
                <div className="alert alert-info">
                    No native questionnaire responses yet. They appear once participants complete a
                    native questionnaire step.
                </div>
            ) : (
                <div style={{ overflowX: "auto" }}>
                    <Table striped bordered hover size="sm">
                        <thead>
                            <tr>
                                <th>Participant</th>
                                <th>Questionnaire</th>
                                <th>Version</th>
                                <th>Submitted</th>
                                <th>Updated</th>
                                <th>Answers</th>
                            </tr>
                        </thead>
                        <tbody>
                            {responses.map((r) => (
                                <tr key={r.id}>
                                    <td>{r.participant_id}</td>
                                    <td>{r.form_id}</td>
                                    <td>{r.form_version}</td>
                                    <td>{r.submitted
                                        ? <Badge bg="success">yes</Badge>
                                        : <Badge bg="secondary">draft</Badge>}</td>
                                    <td>{r.updated_at ? new Date(r.updated_at).toLocaleString() : ""}</td>
                                    <td><code style={{ whiteSpace: "pre-wrap", fontSize: "0.8rem" }}>
                                        {JSON.stringify(r.answers)}
                                    </code></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}
        </div>
    );
}

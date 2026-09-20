import React, { useEffect, useState } from "react";
import { Container, Table, Badge } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";

import Topbar from "../../components/Topbar";
import Questionnaires from "../study_overview/Questionnaires";
import { apiWithAuth, getGlobalFormsUsageApi } from "../../api/studyAlignApi";

function UsageTable() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [usage, setUsage] = useState(null);

    useEffect(() => {
        apiWithAuth(getGlobalFormsUsageApi, {}, dispatch)
            .then((r) => setUsage(r.body || []))
            .catch(() => setUsage([]));
    }, [dispatch]);

    if (usage == null) return <div className="text-muted">Loading usage…</div>;
    if (usage.length === 0) return <div className="text-muted">No questionnaires yet.</div>;

    return (
        <Table hover size="sm" className="mt-2">
            <thead>
                <tr>
                    <th>Questionnaire</th>
                    <th>Used in studies</th>
                </tr>
            </thead>
            <tbody>
                {usage.map((u) => (
                    <tr key={u.form_id}>
                        <td>{u.form_name}</td>
                        <td>
                            {u.studies.length === 0
                                ? <span className="text-muted">Not used yet</span>
                                : u.studies.map((s) => (
                                    <Badge key={s.id} bg="light" text="dark" className="me-1"
                                        role="button" onClick={() => navigate("/study/" + s.id + "/overview")}>
                                        #{s.id} {s.name}
                                    </Badge>
                                ))}
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}

export default function GlobalQuestionnaires() {
    return (
        <>
            <Topbar />
            <Container className="mt-4">
                <h3 className="mb-1">Questionnaires</h3>
                <p className="text-muted">
                    Build reusable questionnaires here. A global questionnaire can be
                    selected in the procedure editor of any of your studies.
                </p>
                <Questionnaires isGlobal />

                <h4 className="mt-5 mb-1">Usage</h4>
                <p className="text-muted mb-0">Which studies each questionnaire is used in.</p>
                <UsageTable />
            </Container>
        </>
    );
}

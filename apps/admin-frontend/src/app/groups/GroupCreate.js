import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { ArrowLeft } from "react-bootstrap-icons";

import Topbar from "../../components/Topbar";
import { useAuth } from "../../components/Auth";
import { createGroupApi, uploadGroupLogoApi } from "../../api/studyAlignApi";

export default function GroupCreate() {
    const navigate = useNavigate();
    const auth = useAuth();

    const [name, setName] = useState("");
    const [logoFile, setLogoFile] = useState(null);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            const res = await createGroupApi({ name, owner_id: auth.user.id });
            const group = res.body;
            if (logoFile) {
                try { await uploadGroupLogoApi(group.id, logoFile); }
                catch (e) { /* group is created; logo can be added later in Manage */ }
            }
            navigate("/groups/" + group.id + "/manage");
        } catch (err) {
            setError("Could not create the group. The name may already be taken.");
            setSubmitting(false);
        }
    };

    return (
        <>
            <Topbar />
            <Container className="mt-4" style={{ maxWidth: 640 }}>
                <Button variant="link" className="ps-0 mb-2" onClick={() => navigate("/groups")}>
                    <ArrowLeft /> Back to Groups
                </Button>
                <Card className="shadow-sm">
                    <Card.Body>
                        <h4 className="mb-3">Create Group</h4>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="groupName">
                                <Form.Label>Group name</Form.Label>
                                <Form.Control required type="text" placeholder="e.g. HCI Lab"
                                    value={name} onChange={(e) => setName(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="groupLogo">
                                <Form.Label>Logo (PNG, optional)</Form.Label>
                                <Form.Control type="file" accept="image/png"
                                    onChange={(e) => setLogoFile(e.target.files[0] || null)} />
                            </Form.Group>
                            <div className="d-flex justify-content-end">
                                <Button type="submit" variant="primary" disabled={submitting}>
                                    {submitting ? "Creating…" : "Create Group"}
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
}

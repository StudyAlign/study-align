import React, { useState } from "react";
import { Button, Card, Form, Alert } from "react-bootstrap";
import { ArrowLeft } from "react-bootstrap-icons";
import { Link, useParams, useNavigate } from "react-router-dom";

import { resetPasswordApi } from "../../api/studyAlignApi";
import Logo from "./Logo";

export default function ResetPW() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);

        if (password !== passwordRepeat) {
            setError("Passwords do not match.");
            return;
        }

        setSubmitting(true);
        try {
            await resetPasswordApi(token, password);
            setSuccess(true);
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            const detail = err && err.body && err.body.detail;
            setError(detail || "This reset link is invalid or has expired.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="login-box">
            <Logo />
            <Card className={"shadow"}>
                <Card.Body>
                    {success ? (
                        <Alert variant="success">
                            Your password has been reset. Redirecting to login…
                        </Alert>
                    ) : (
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <div className="d-grid">
                                    <Form.Label>Enter new password</Form.Label>
                                </div>
                            </Form.Group>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form.Group className="mb-3" controlId="formPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formRepeatPassword">
                                <Form.Label>Repeat Password</Form.Label>
                                <Form.Control required type="password" placeholder="Repeat Password" value={passwordRepeat} onChange={(e) => setPasswordRepeat(e.target.value)}/>
                            </Form.Group>
                            <div className="d-grid">
                                <Button type="submit" size="lg" disabled={submitting}>
                                    {submitting ? "Saving…" : "Confirm Password"}
                                </Button>
                                <Form.Text>
                                    <Link to="/login"><ArrowLeft /> Back to Login</Link>
                                </Form.Text>
                            </div>
                        </Form>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
}

import React, { useState } from "react";
import { Button, Card, Form, Alert } from "react-bootstrap";
import { ArrowLeft } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

import { registerUserApi } from "../../api/studyAlignApi";
import Logo from "./Logo";

export default function RegisterForm() {
    const [name, setName] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
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
            await registerUserApi({ name, firstname, lastname, email, password });
            setSuccess(true);
        } catch (err) {
            const detail = err && err.body && err.body.detail;
            setError(detail || "Registration failed. Please try again.");
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
                        <>
                            <Alert variant="success">
                                Account created. We sent an activation link to <strong>{email}</strong>.
                                Please check your inbox to activate your account.
                            </Alert>
                            <div className="d-grid">
                                <Link to="/login"><ArrowLeft /> Back to Login</Link>
                            </div>
                        </>
                    ) : (
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Create your account</Form.Label>
                            </Form.Group>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form.Group className="mb-3" controlId="regName">
                                <Form.Label>Username</Form.Label>
                                <Form.Control required type="text" placeholder="Username"
                                    value={name} onChange={(e) => setName(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="regFirstname">
                                <Form.Label>First name</Form.Label>
                                <Form.Control type="text" placeholder="First name"
                                    value={firstname} onChange={(e) => setFirstname(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="regLastname">
                                <Form.Label>Last name</Form.Label>
                                <Form.Control type="text" placeholder="Last name"
                                    value={lastname} onChange={(e) => setLastname(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="regEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control required type="email" placeholder="Email"
                                    value={email} onChange={(e) => setEmail(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="regPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control required type="password" placeholder="Password"
                                    value={password} onChange={(e) => setPassword(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="regPasswordRepeat">
                                <Form.Label>Repeat Password</Form.Label>
                                <Form.Control required type="password" placeholder="Repeat Password"
                                    value={passwordRepeat} onChange={(e) => setPasswordRepeat(e.target.value)} />
                            </Form.Group>
                            <div className="d-grid">
                                <Button type="submit" size="lg" disabled={submitting}>
                                    {submitting ? "Creating account…" : "Register"}
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

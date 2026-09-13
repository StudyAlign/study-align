import React, { useState } from "react";
import { Button, Card, Form, Alert } from "react-bootstrap";
import { ArrowLeft } from 'react-bootstrap-icons';
import { Link } from "react-router-dom";

import { requestPasswordResetApi } from "../../api/studyAlignApi";
import Logo from "./Logo";

export default function ForgotPW() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleMail = (event) => {
        setEmail(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        try {
            await requestPasswordResetApi(email);
        } catch (err) {
            // The endpoint always succeeds for privacy; ignore errors here.
        } finally {
            setSubmitting(false);
            setSubmitted(true);
        }
    };

    return (
        <div className="login-box">
            <Logo />
            <Card className={"shadow"}>
                <Card.Body>
                    {submitted ? (
                        <>
                            <Alert variant="success">
                                If an account exists for <strong>{email}</strong>, we have sent a
                                password reset link. Please check your inbox.
                            </Alert>
                            <div className="d-grid">
                                <Link to="/login"><ArrowLeft /> Back to Login</Link>
                            </div>
                        </>
                    ) : (
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <div className="d-grid">
                                    <Form.Label>Reset Password</Form.Label>
                                    <Form.Text>
                                        We will send you an email to reset your password. If you cannot remember your email please contact an administrator.
                                    </Form.Text>
                                </div>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control required type="email" placeholder="Email" value={email} onChange={handleMail}/>
                            </Form.Group>
                            <div className="d-grid">
                                <Button type="submit" size="lg" disabled={submitting}>
                                    {submitting ? "Sending…" : "Reset Password"}
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

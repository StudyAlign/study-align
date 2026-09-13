import React, { useEffect, useState } from "react";
import { Card, Alert, Spinner } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "react-bootstrap-icons";

import { activateUserApi } from "../../api/studyAlignApi";
import Logo from "./Logo";

export default function Activate() {
    const { token } = useParams();
    const [status, setStatus] = useState("pending"); // pending | success | error

    useEffect(() => {
        let cancelled = false;
        activateUserApi(token)
            .then(() => { if (!cancelled) setStatus("success"); })
            .catch(() => { if (!cancelled) setStatus("error"); });
        return () => { cancelled = true; };
    }, [token]);

    return (
        <div className="login-box">
            <Logo />
            <Card className={"shadow"}>
                <Card.Body>
                    {status === "pending" && (
                        <div className="d-grid text-center">
                            <Spinner animation="border" className="mx-auto mb-2" />
                            Activating your account…
                        </div>
                    )}
                    {status === "success" && (
                        <Alert variant="success">
                            Your account has been activated. You can now log in.
                        </Alert>
                    )}
                    {status === "error" && (
                        <Alert variant="danger">
                            This activation link is invalid or has already been used.
                        </Alert>
                    )}
                    <div className="d-grid">
                        <Link to="/login"><ArrowLeft /> Back to Login</Link>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
}

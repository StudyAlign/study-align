import React, { useEffect, useState } from "react";
import {Alert, Button, Card, Form} from "react-bootstrap";
import { Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { authSlice, me, userLogin, selectUserError } from "../../redux/reducers/authSlice";

import { useAuth } from "../../components/Auth";
import Logo from "./Logo";

import "./Login.scss";

export default function Login(props) {
    //useDispatch to dispatch redux actions
    const dispatch = useDispatch()
    const auth = useAuth()
    const loginError = useSelector(selectUserError)

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const logoutUser = props.logout;

    // Clear a stale login error when arriving at / leaving the login screen.
    useEffect(() => {
        dispatch(authSlice.actions.clearError())
    }, [dispatch])

    useEffect(( ) => {
        console.log("login use effect")
    }, [])

    useEffect(() => {
        if (logoutUser) {
            dispatch(authSlice.actions.logout())
        }
    }, [logoutUser])

    const handleUsername = (event) => {
        setUsername(event.target.value)
    }

    const handlePassword = (event) => {
        setPassword(event.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        dispatch(authSlice.actions.clearError())
        dispatch(userLogin({username: username, password: password}));
    }

    // 403 => account exists but is not activated; anything else => bad credentials.
    const renderLoginError = () => {
        if (!loginError) return null
        if (loginError.status === 403) {
            return <Alert variant="warning">This account is not activated yet. Inactive accounts cannot log in — please activate it via the link sent to your email.</Alert>
        }
        return <Alert variant="danger">Incorrect username or password.</Alert>
    }

    const handleClick = (event) => {
        event.preventDefault();
        dispatch(me())
    }

    const handleLogout = (event) => {
        event.preventDefault();
        dispatch(authSlice.actions.logout())
    }

    if (auth.isAuthenticated) {
        return <Navigate to="/" replace />
    }

    return <div className="login-box">
        <Logo />
        <Card className={"shadow"}>
            <Card.Body>
                {renderLoginError()}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label>Username</Form.Label>
                        <Form.Control required type="text" placeholder="Username" value={username} onChange={handleUsername}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control required type="password" placeholder="Password" value={password} onChange={handlePassword}/>
                    </Form.Group>
                    <div className="d-grid">
                        <Button type="submit" size="lg">Login</Button>
                        <Form.Text>
                            <Link to="/login/forgot">Forgot Password</Link>
                        </Form.Text>
                        <Form.Text className="mt-2">
                            No account yet? <Link to="/register">Register now</Link>
                        </Form.Text>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    </div>
}

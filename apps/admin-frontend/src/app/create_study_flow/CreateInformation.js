import React, { useState, useEffect } from "react";
import { Button, Col, Row, Container, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

import { createStudy, selectStudy } from "../../redux/reducers/studySlice";
import { getGroupsApi } from "../../api/studyAlignApi";

import { STATES } from "../study_overview/StudyOverviewLayout";

import HtmlEditor from './procedure_editors/HtmlEditor';

import { useAuth } from "../../components/Auth";
import LoadingScreen from "../../components/LoadingScreen";
import StudyCreationLayout, { CreationSteps } from "./navigation_logic/StudyCreationLayout";

export default function CreateInformation() {
    const dispatch = useDispatch()
    const auth = useAuth()
    const location = useLocation()

    const [title, setTitle] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [amountParticipants, setAmountParticipants] = useState('')
    const [description, setDescription] = useState('')
    const [consent, setConsent] = useState('')
    const [privateStudy, setPrivateStudy] = useState(false)
    const [groupId, setGroupId] = useState('')
    const [groups, setGroups] = useState([])

    const [created, setCreated] = useState(false)

    const study = useSelector(selectStudy)

    // Groups the current user is a member (or owner) of.
    useEffect(() => {
        getGroupsApi().then((r) => setGroups(r.body || [])).catch(() => {})
    }, [])

    const handleTitle = (event) => {
        setTitle(event.target.value)
    }

    const handleStartDate = (event) => {
        setStartDate(event.target.value)
    }

    const handleEndDate = (event) => {
        setEndDate(event.target.value)
    }

    const handleParticipants = (event) => {
        setAmountParticipants(event.target.value)
    }

    const handlePrivateStudy = (event) => {
        setPrivateStudy(event.target.checked)
    }

    const handleDescription = (_, value) => {
        setDescription(value)
    }

    const handleConsent = (_, value) => {
        setConsent(value)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        let study = {
            "name": title,
            "startDate": startDate + "T00:00:00.000Z",
            "endDate": endDate  + "T00:00:00.000Z",
            "state": STATES.SETUP, // "setup", "running", "finished"
            "owner_id": auth.user.id,
            "invite_only": privateStudy,
            "description": description,
            "consent": consent,
            "planned_number_participants": amountParticipants,
            "current_setup_step": "information", // jump to procedure after creating
            "group_id": groupId ? parseInt(groupId, 10) : null
        }
        await dispatch(createStudy(study))
        setCreated(true)
    }

    if (created) {
        if (study == null) {
            return <LoadingScreen/>
        }
        else {
            return <Navigate to={"/create/" + study.id + "/procedure"} replace state={{ from: location }}/>
        }
    }

    return(
        <StudyCreationLayout step={CreationSteps.Information}>

            <Container>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Form.Group className="mb-3" controlId="formTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control required type="text" placeholder="Title" value={title} onChange={handleTitle}/>
                        </Form.Group>
                    </Row>

                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="formStartDate">
                                <Form.Label>Start Date</Form.Label>
                                <Form.Control required type="date" placeholder="Start Date" value={startDate} onChange={handleStartDate}
                                    onClick={(e) => e.target.showPicker && e.target.showPicker()} style={{ cursor: "pointer" }} />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId="formEndDate">
                                <Form.Label>End Date</Form.Label>
                                <Form.Control required type="date" placeholder="End Date" min={startDate} value={endDate} onChange={handleEndDate}
                                    onClick={(e) => e.target.showPicker && e.target.showPicker()} style={{ cursor: "pointer" }} />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Form.Group as={Row} className="mb-3 align-items-center" controlId="formPrivateStudy">
                            <Form.Label column sm={4} xl={3} style={{ whiteSpace: "nowrap" }}>Private Study (invite only)</Form.Label>
                            <Col sm={8} xl={9}>
                                <Form.Check
                                    type="checkbox"
                                    name="is_active"
                                    checked={privateStudy}
                                    onChange={handlePrivateStudy}
                                    className="me-2"
                                    style={{ cursor: "pointer" }}
                                />
                            </Col>
                        </Form.Group>
                    </Row>

                    <Row>
                        <Form.Group className="mb-3" controlId="formGroup">
                            <Form.Label>Group</Form.Label>
                            <Form.Select value={groupId} onChange={(e) => setGroupId(e.target.value)}>
                                <option value="">No group</option>
                                {groups.map((g) => (
                                    <option key={g.id} value={g.id}>{g.name}</option>
                                ))}
                            </Form.Select>
                            <Form.Text className="text-muted">
                                Assign this study to one of your groups to brand it with the group.
                            </Form.Text>
                        </Form.Group>
                    </Row>

                    <Row>
                        <Form.Group className="mb-3" controlId="formParticipants">
                            <Form.Label>Number of Participants</Form.Label>
                            <Form.Control required type="number" placeholder="Number of  Participants" value={amountParticipants} onChange={handleParticipants}/>
                        </Form.Group>
                    </Row>

                    <Row>
                        <Form.Group className="mb-3" controlId="formDescription">
                            <Form.Label>Description</Form.Label>
                            <HtmlEditor value={description} onChange={(value) => handleDescription('description', value)}/>
                        </Form.Group>
                    </Row>

                    <Row>
                        <Form.Group className="mb-3" controlId="formConsent">
                            <Form.Label>Consent</Form.Label>
                            <HtmlEditor value={consent} onChange={(value) => handleConsent('consent', value)}/>
                        </Form.Group>
                    </Row>

                    <Row>
                        <Col> <Button type="submit">Save and Continue</Button> </Col>
                    </Row>
                </Form>
            </Container>

        </StudyCreationLayout>
    )
}
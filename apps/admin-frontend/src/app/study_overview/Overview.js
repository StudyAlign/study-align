import React, { useState, useEffect } from "react";
import { Button, Modal, Row, Col, Accordion, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Copy, Trash } from "react-bootstrap-icons";

import { STATES } from "./StudyOverviewLayout";
import { selectApiStatus } from "../../redux/reducers/studySlice";
import {
    userSlice, getCollaborators, createCollaborator, deleteCollaborator, selectCollaborators
} from "../../redux/reducers/userSlice";

import { LOADING } from "../../redux/apiStates";
import { reformatDate } from "../../components/CommonFunctions";

import LoadingScreen from "../../components/LoadingScreen";
import UserSearch from "../../components/UserSearch";

import "./StudyOverview.css";
import "../SidebarAndReactStyles.scss";

const url = process.env.REACT_APP_STUDY_ALIGN_STUDY_FRONTEND_URL;

export default function Overview(props) {
    const [isClicked, setIsClicked] = useState(false);
    //
    const [collaboratorToDelete, setCollaboratorToDelete] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    //
    const [refreshCollaboratorsFlag, setRefreshCollaboratorsFlag] = useState(false);

    const dispatch = useDispatch();

    const study = props.study;
    // Normalise the base URL so there is exactly one slash before the study id.
    const base = (url || "").replace(/\/+$/, "");
    const collab_url = base + "/" + study.id + "/";

    // Selectors
    const apiStatus = useSelector(selectApiStatus);
    const collaborators = useSelector(selectCollaborators);

    // retrigger collaborators
    useEffect(() => {
        dispatch(getCollaborators(study.id));
    }, [dispatch, study.id, refreshCollaboratorsFlag]);

    // Cleanup
    useEffect(() => {
        return () => {
            dispatch(userSlice.actions.resetCollaborators());
        };
    }, [dispatch]);

    // loading
    if (apiStatus === LOADING || !collaborators) {
        return <LoadingScreen />;
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(collab_url);
        setIsClicked(true);
        setTimeout(() => setIsClicked(false), 500);
    };

    const getStatus = () => {
        switch (study.state) {
            case STATES.RUNNING:
                return "Running";
            case STATES.SETUP:
                return "Setup";
            default:
                return "Closed";
        }
    };

    const getStudyIsOver = () => {
        if (new Date(study.endDate.split("T")[0]) < new Date()) {
            return "(is over)";
        }
    };

    const confirmDelete = (collabId) => {
        setCollaboratorToDelete(collabId);
        setShowConfirmModal(true);
    };

    const handleConfirmDelete = async () => {
        dispatch(deleteCollaborator(collaboratorToDelete))
            .then(() => {
                setRefreshCollaboratorsFlag((prev) => !prev);
            });
        setShowConfirmModal(false);
        setCollaboratorToDelete(null);
    };
    const handleCancelDelete = () => {
        setShowConfirmModal(false);
        setCollaboratorToDelete(null);
    };

    const handleAddCollaborator = (userId) => {
        dispatch(createCollaborator({ study_id: study.id, user_id: userId }))
            .then(() => {
                setRefreshCollaboratorsFlag((prev) => !prev);
            });
    };

    // ids of users already collaborating, to disable them in the search
    const colabIds = collaborators.map((collab) => collab.user.id);

    return (
        <>
            <Row>
                {/* -------- Details + description/consent -------- */}
                <Col lg={8}>
                    <table>
                        <tbody>
                            <tr>
                                <td className="content-name"> Status: </td>
                                <td>{getStatus()} {getStudyIsOver()}</td>
                            </tr>
                            <tr>
                                <td className="content-name"> Private Study: </td>
                                <td> {study.invite_only ? "Yes" : "No"} </td>
                            </tr>
                            <tr>
                                <td className="content-name"> Start Date: </td>
                                <td> {reformatDate(study.startDate)} </td>
                            </tr>
                            <tr>
                                <td className="content-name"> End Date: </td>
                                <td> {reformatDate(study.endDate)} </td>
                            </tr>
                            <tr>
                                <td className="content-name"> Participants: </td>
                                <td>{study.done_participants} / {study.total_participants}</td>
                            </tr>
                            <tr>
                                <td className="content-name"> Participants <br /> (in Progress): </td>
                                <td>{study.in_progress_participants}</td>
                            </tr>
                            <tr>
                                <td className="content-name"> Invite Link: </td>
                                <td>
                                    <a href={collab_url}> {collab_url} </a>
                                    <button
                                        onClick={handleCopy}
                                        className={`copy-button ${isClicked ? "clicked" : ""}`}
                                    >
                                        <Copy size={10} />
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <Accordion defaultActiveKey={["description"]} alwaysOpen className="mt-4">
                        <Accordion.Item eventKey="description">
                            <Accordion.Header>Description</Accordion.Header>
                            <Accordion.Body>
                                <div
                                    className="description-content"
                                    dangerouslySetInnerHTML={{ __html: study.description }}
                                />
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="consent">
                            <Accordion.Header>Consent</Accordion.Header>
                            <Accordion.Body>
                                <div
                                    className="consent-content"
                                    dangerouslySetInnerHTML={{ __html: study.consent }}
                                />
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Col>

                {/* -------- Collaborators sidebar -------- */}
                <Col lg={4}>
                    <Card className="shadow-sm">
                        <Card.Header>Collaborators</Card.Header>
                        <Card.Body>
                            <UserSearch
                                onSelect={(u) => handleAddCollaborator(u.id)}
                                excludeIds={colabIds}
                                excludeLabel="collaborator"
                                placeholder="Search users by name or email"
                            />
                            {collaborators.length === 0 ? (
                                <div className="text-muted small mt-3">
                                    No collaborators added yet.
                                </div>
                            ) : (
                                <ul style={{ listStyleType: "none", paddingLeft: 0 }} className="mt-3 mb-0">
                                    {collaborators.map((collab) => (
                                        <li key={collab.id} className="collaborator-item d-flex align-items-center justify-content-between">
                                            <span>
                                                {collab.user.firstname} {collab.user.lastname}
                                                <br />
                                                <span className="text-muted small">{collab.user.email}</span>
                                            </span>
                                            <Button
                                                variant="link"
                                                onClick={() => confirmDelete(collab.id)}
                                                className="delete-button p-0"
                                            >
                                                <Trash size={18} color="red" />
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Confirm deletion modal */}
            <Modal show={showConfirmModal} onHide={handleCancelDelete}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to remove this collaborator?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancelDelete}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleConfirmDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

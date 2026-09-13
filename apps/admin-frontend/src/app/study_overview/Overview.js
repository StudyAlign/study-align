import React, { useState, useEffect } from "react";
import { Button, Tabs, Tab, Modal } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Copy, Trash, PersonPlus } from "react-bootstrap-icons";

import { STATES } from "./StudyOverviewLayout";
import {
    getStudySetupInfo, getStudy, updateStudy, selectApiStatus
} from "../../redux/reducers/studySlice";

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
    const [adding, setAdding] = useState(false);
    const [refreshCollaboratorsFlag, setRefreshCollaboratorsFlag] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const study = props.study;
    const collab_url = url + study.id + "/";

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

    const handleStudyActive = async (event, state) => {
        event.preventDefault();
        await dispatch(updateStudy({ studyId: study.id, study: { state: state } }));
        await dispatch(getStudy(study.id));
    };

    const handleEdit = async (event) => {
        event.preventDefault();
        await dispatch(
            updateStudy({
                studyId: study.id,
                study: { current_setup_step: "study" }
            })
        );
        await dispatch(getStudySetupInfo(study.id));
        navigate("/create/" + study.id + "/information");
    };

    const getButton = (state) => {
        switch (state) {
            case STATES.RUNNING:
                return (
                    <Button onClick={(event) => handleStudyActive(event, "finished")}>
                        Close Study
                    </Button>
                );
            case STATES.FINISHED:
                return (
                    <Button onClick={(event) => handleStudyActive(event, "running")}>
                        Open Study
                    </Button>
                );
            case STATES.SETUP:
                return <Button onClick={(event) => handleEdit(event)}> Finish Setup </Button>;
            default:
                return null;
        }
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

    // confirm collaborator deletion
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
            <Tabs defaultActiveKey="details" id="study-tabs" className="mb-3">
                <Tab eventKey="details" title="Details">
                    <table>
                        <tbody>
                            <tr>
                                <td className="content-name"> Status: </td>
                                <td>
                                    {getStatus()} {getStudyIsOver()}
                                </td>
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
                                <td>
                                    {study.done_participants} / {study.total_participants}
                                </td>
                            </tr>
                            <tr>
                                <td className="content-name"> Participants <br /> (in Progress): </td>
                                <td>
                                    {study.in_progress_participants}
                                </td>
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
                </Tab>
                <Tab eventKey="description" title="Description">
                    <div
                        className="description-content"
                        dangerouslySetInnerHTML={{ __html: study.description }}
                    ></div>
                </Tab>
                <Tab eventKey="consent" title="Consent">
                    <div
                        className="consent-content"
                        dangerouslySetInnerHTML={{ __html: study.consent }}
                    ></div>
                </Tab>
            </Tabs>
            <hr />
            {getButton(study.state)}
            <hr />
            <h3> Collaborators </h3>
            {collaborators.length === 0 ? (
                <div className="alert alert-info">
                    There are no collaborators added yet.
                </div>
            ) : (
                <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                    {collaborators.map((collab) => (
                        <li key={collab.id} className="collaborator-item d-flex align-items-center justify-content-between">
                            <span>
                                {collab.user.firstname} {collab.user.lastname} ({collab.user.email})
                            </span>
                            <Button
                                variant="link"
                                onClick={() => confirmDelete(collab.id)}
                                className="delete-button"
                            >
                                <Trash size={22} color="red" />
                            </Button>
                        </li>
                    ))}
                </ul>
            )}

            {adding ? (
                <div className="collaborator-add" style={{ maxWidth: 480 }}>
                    <UserSearch
                        onSelect={(u) => handleAddCollaborator(u.id)}
                        excludeIds={colabIds}
                        excludeLabel="collaborator"
                        placeholder="Search users by name or email"
                        autoFocus
                    />
                    <Button variant="link" className="ps-0 mt-1" onClick={() => setAdding(false)}>
                        Done
                    </Button>
                </div>
            ) : (
                <Button type="button" className="small-button" onClick={() => setAdding(true)}>
                    <PersonPlus className="button-icon" /> Add
                </Button>
            )}

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

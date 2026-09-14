import React, { useState, useEffect } from "react";
import { Button, Modal, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Trash } from "react-bootstrap-icons";

import {
    userSlice, getCollaborators, createCollaborator, deleteCollaborator, selectCollaborators
} from "../../redux/reducers/userSlice";
import UserSearch from "../../components/UserSearch";

import "./StudyOverview.css";

// Study collaborators panel: always shows the user-search bar with the list
// of added collaborators below it. Rendered as a right-hand sidebar of the
// study overview.
export default function Collaborators({ study }) {
    const dispatch = useDispatch();
    const collaborators = useSelector(selectCollaborators);

    const [collaboratorToDelete, setCollaboratorToDelete] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [refreshFlag, setRefreshFlag] = useState(false);

    useEffect(() => {
        dispatch(getCollaborators(study.id));
    }, [dispatch, study.id, refreshFlag]);

    useEffect(() => {
        return () => {
            dispatch(userSlice.actions.resetCollaborators());
        };
    }, [dispatch]);

    const confirmDelete = (collabId) => {
        setCollaboratorToDelete(collabId);
        setShowConfirmModal(true);
    };

    const handleConfirmDelete = () => {
        dispatch(deleteCollaborator(collaboratorToDelete))
            .then(() => setRefreshFlag((prev) => !prev));
        setShowConfirmModal(false);
        setCollaboratorToDelete(null);
    };

    const handleCancelDelete = () => {
        setShowConfirmModal(false);
        setCollaboratorToDelete(null);
    };

    const handleAddCollaborator = (userId) => {
        dispatch(createCollaborator({ study_id: study.id, user_id: userId }))
            .then(() => setRefreshFlag((prev) => !prev));
    };

    const list = collaborators || [];
    const colabIds = list.map((collab) => collab.user.id);

    return (
        <>
            <Card className="shadow-sm">
                <Card.Header>Collaborators</Card.Header>
                <Card.Body>
                    <UserSearch
                        onSelect={(u) => handleAddCollaborator(u.id)}
                        excludeIds={colabIds}
                        excludeLabel="collaborator"
                        placeholder="Search users by name or email"
                    />
                    {list.length === 0 ? (
                        <div className="text-muted small mt-3">
                            No collaborators added yet.
                        </div>
                    ) : (
                        <ul style={{ listStyleType: "none", paddingLeft: 0 }} className="mt-3 mb-0">
                            {list.map((collab) => (
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

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Container, Button, Table, Modal, Spinner, Alert, Badge } from "react-bootstrap";
import { PlusCircleFill, Trash } from "react-bootstrap-icons";

import Topbar from "../../components/Topbar";
import { useAuth } from "../../components/Auth";
import GroupLogo from "./GroupLogo";
import { getGroupsApi, deleteGroupApi } from "../../api/studyAlignApi";

export default function GroupsOverview() {
    const navigate = useNavigate();
    const auth = useAuth();

    const [groups, setGroups] = useState(null);
    const [error, setError] = useState(null);
    const [toDelete, setToDelete] = useState(null);

    const load = () => {
        setError(null);
        getGroupsApi()
            .then((r) => setGroups(r.body || []))
            .catch(() => setError("Could not load your groups."));
    };

    useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

    const confirmDelete = () => {
        const id = toDelete.id;
        deleteGroupApi(id)
            .then(() => { setToDelete(null); load(); })
            .catch(() => { setToDelete(null); setError("Could not delete the group."); });
    };

    const currentUserId = auth && auth.user && auth.user.id;

    return (
        <>
            <Topbar />
            <Container className="mt-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3>Groups</h3>
                    <Button variant="primary" onClick={() => navigate("/groups/create")}>
                        <PlusCircleFill className="button-icon" /> Create Group
                    </Button>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}

                {groups === null ? (
                    <div className="text-center my-5"><Spinner animation="border" /></div>
                ) : groups.length === 0 ? (
                    <Alert variant="light">You are not part of any group yet. Create one to get started.</Alert>
                ) : (
                    <Table hover responsive className="align-middle">
                        <thead>
                            <tr><th style={{ width: 60 }}></th><th>Name</th><th>Role</th><th className="text-end">Danger zone</th></tr>
                        </thead>
                        <tbody>
                            {groups.map((g) => {
                                const isOwner = g.owner_id === currentUserId;
                                return (
                                    <tr key={g.id} style={{ cursor: "pointer" }}
                                        onClick={() => navigate("/groups/" + g.id + "/manage")}>
                                        <td>
                                            <GroupLogo groupId={g.id} name={g.name} size={40} />
                                        </td>
                                        <td>{g.name}</td>
                                        <td>{isOwner ? <Badge bg="primary">Owner</Badge> : <Badge bg="secondary">Member</Badge>}</td>
                                        <td className="text-end">
                                            {isOwner && (
                                                <Button size="sm" variant="outline-danger"
                                                    onClick={(e) => { e.stopPropagation(); setToDelete(g); }}>
                                                    <Trash className="button-icon" /> Delete
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                )}
            </Container>

            <Modal show={!!toDelete} onHide={() => setToDelete(null)} centered>
                <Modal.Header closeButton><Modal.Title>Delete group</Modal.Title></Modal.Header>
                <Modal.Body>
                    Are you sure you want to permanently delete the group
                    {" "}<strong>{toDelete && toDelete.name}</strong>? This removes all its members and invites.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setToDelete(null)}>Cancel</Button>
                    <Button variant="danger" onClick={confirmDelete}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import {
    Container, Card, Tabs, Tab, Form, Button, Table, Modal,
    Alert, Spinner, InputGroup,
} from "react-bootstrap";
import { ArrowLeft, Trash, ArrowRepeat } from "react-bootstrap-icons";

import Topbar from "../../components/Topbar";
import UserSearch from "../../components/UserSearch";
import GroupLogo from "./GroupLogo";
import { userLabel } from "../../components/CommonFunctions";
import {
    getGroupApi, updateGroupApi, deleteGroupApi,
    uploadGroupLogoApi, deleteGroupLogoApi,
    getGroupMembersApi, removeGroupMemberApi,
    getGroupInvitesApi, createGroupInviteApi, resendGroupInviteApi, deleteGroupInviteApi,
} from "../../api/studyAlignApi";

export default function GroupManage() {
    const { group_id } = useParams();
    const navigate = useNavigate();

    const [group, setGroup] = useState(null);
    const [members, setMembers] = useState([]);
    const [invites, setInvites] = useState([]);
    const [error, setError] = useState(null);
    const [notice, setNotice] = useState(null);

    // settings
    const [name, setName] = useState("");
    const [logoVersion, setLogoVersion] = useState(0); // cache-bust the <img> after upload/delete
    const [savingName, setSavingName] = useState(false);

    // modals
    const [showDeleteGroup, setShowDeleteGroup] = useState(false);
    const [memberToRemove, setMemberToRemove] = useState(null);
    const [inviteToDelete, setInviteToDelete] = useState(null);

    const loadMembers = useCallback(() => {
        getGroupMembersApi(group_id).then((r) => setMembers(r.body || [])).catch(() => {});
    }, [group_id]);

    const loadInvites = useCallback(() => {
        getGroupInvitesApi(group_id).then((r) => setInvites(r.body || [])).catch(() => {});
    }, [group_id]);

    useEffect(() => {
        getGroupApi(group_id)
            .then((r) => { setGroup(r.body); setName(r.body.name); })
            .catch(() => setError("Could not load the group."));
        loadMembers();
        loadInvites();
    }, [group_id, loadMembers, loadInvites]);

    const flash = (msg) => { setNotice(msg); setTimeout(() => setNotice(null), 2500); };

    // --- settings ---
    const handleSaveName = async (e) => {
        e.preventDefault();
        setSavingName(true); setError(null);
        try {
            await updateGroupApi(group_id, { name });
            const r = await getGroupApi(group_id);
            setGroup(r.body); setName(r.body.name);
            flash("Group updated.");
        } catch (err) { setError("Could not update the group."); }
        finally { setSavingName(false); }
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setError(null);
        try {
            await uploadGroupLogoApi(group_id, file);
            setLogoVersion((v) => v + 1);
            flash("Logo updated.");
        } catch (err) { setError("Could not upload the logo (PNG only)."); }
    };

    const handleLogoDelete = async () => {
        setError(null);
        try {
            await deleteGroupLogoApi(group_id);
            setLogoVersion((v) => v + 1);
            flash("Logo removed.");
        } catch (err) { setError("Could not remove the logo."); }
    };

    const confirmDeleteGroup = async () => {
        try { await deleteGroupApi(group_id); navigate("/groups"); }
        catch (err) { setShowDeleteGroup(false); setError("Could not delete the group."); }
    };

    // --- members ---
    const confirmRemoveMember = async () => {
        const userId = memberToRemove.user_id;
        try { await removeGroupMemberApi(group_id, userId); setMemberToRemove(null); loadMembers(); }
        catch (err) { setMemberToRemove(null); setError("Could not remove the member."); }
    };

    // --- invites ---
    const handleInvite = async (userId) => {
        setError(null);
        try {
            await createGroupInviteApi(group_id, { user_id: userId });
            flash("Invitation sent.");
            loadInvites();
        } catch (err) {
            setError("Could not invite this user (already a member or already invited).");
        }
    };

    const handleResend = async (token) => {
        setError(null);
        try { await resendGroupInviteApi(token); flash("Invitation resent."); }
        catch (err) { setError("Could not resend the invitation."); }
    };

    const confirmDeleteInvite = async () => {
        const token = inviteToDelete.token;
        try { await deleteGroupInviteApi(token); setInviteToDelete(null); loadInvites(); }
        catch (err) { setInviteToDelete(null); setError("Could not delete the invitation."); }
    };

    if (!group) {
        return (<><Topbar /><Container className="mt-4">
            {error ? <Alert variant="danger">{error}</Alert> : <div className="text-center my-5"><Spinner animation="border" /></div>}
        </Container></>);
    }

    const memberUserIds = members.map((m) => m.user_id);
    const invitedUserIds = invites.map((i) => i.user_id);

    return (
        <>
            <Topbar />
            <Container className="mt-4" style={{ maxWidth: 820 }}>
                <Button variant="link" className="ps-0 mb-2" onClick={() => navigate("/groups")}>
                    <ArrowLeft /> Back to Groups
                </Button>
                <div className="d-flex align-items-center mb-3">
                    <GroupLogo groupId={group.id} name={group.name} size={48} version={logoVersion} className="me-3" />
                    <h3 className="mb-0">{group.name}</h3>
                </div>

                {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
                {notice && <Alert variant="success">{notice}</Alert>}

                <Card className="shadow-sm">
                    <Card.Body>
                        <Tabs defaultActiveKey="settings" className="mb-3">
                            {/* -------- Settings -------- */}
                            <Tab eventKey="settings" title="Settings">
                                <Form onSubmit={handleSaveName} className="mb-4">
                                    <Form.Group className="mb-3" controlId="groupNameEdit">
                                        <Form.Label>Group name</Form.Label>
                                        <InputGroup>
                                            <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                                            <Button type="submit" variant="primary" disabled={savingName}>
                                                {savingName ? "Saving…" : "Save"}
                                            </Button>
                                        </InputGroup>
                                    </Form.Group>
                                </Form>

                                <Form.Group className="mb-4" controlId="groupLogoEdit">
                                    <Form.Label>Logo (PNG)</Form.Label>
                                    <div className="d-flex align-items-center">
                                        <GroupLogo groupId={group.id} name={group.name} size={64} version={logoVersion} className="me-3" />
                                        <Form.Control type="file" accept="image/png" onChange={handleLogoUpload} className="me-2" style={{ maxWidth: 300 }} />
                                        <Button variant="outline-danger" size="sm" onClick={handleLogoDelete}>Remove logo</Button>
                                    </div>
                                </Form.Group>

                                <hr />
                                <div className="d-flex justify-content-between align-items-center">
                                    <div><strong>Delete this group</strong><div className="text-muted small">This cannot be undone.</div></div>
                                    <Button variant="outline-danger" onClick={() => setShowDeleteGroup(true)}>
                                        <Trash className="button-icon" /> Delete Group
                                    </Button>
                                </div>
                            </Tab>

                            {/* -------- Members -------- */}
                            <Tab eventKey="members" title={`Members (${members.length})`}>
                                {members.length === 0 ? (
                                    <Alert variant="light">No members yet. Invite users from the Invites tab.</Alert>
                                ) : (
                                    <Table hover responsive className="align-middle">
                                        <thead><tr><th>User</th><th className="text-end">Actions</th></tr></thead>
                                        <tbody>
                                            {members.map((m) => (
                                                <tr key={m.user_id}>
                                                    <td>{userLabel(m.user)}</td>
                                                    <td className="text-end">
                                                        <Button size="sm" variant="outline-danger" onClick={() => setMemberToRemove(m)}>
                                                            <Trash className="button-icon" /> Remove
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                )}
                            </Tab>

                            {/* -------- Invites -------- */}
                            <Tab eventKey="invites" title={`Invites (${invites.length})`}>
                                <Form.Group className="mb-4">
                                    <Form.Label>Invite a user</Form.Label>
                                    <UserSearch
                                        onSelect={(u) => handleInvite(u.id)}
                                        excludeIds={[...memberUserIds, ...invitedUserIds]}
                                        excludeLabel="member / invited"
                                        placeholder="Search by username or email"
                                    />
                                </Form.Group>

                                <h6>Pending invitations</h6>
                                {invites.length === 0 ? (
                                    <Alert variant="light">No pending invitations.</Alert>
                                ) : (
                                    <Table hover responsive className="align-middle">
                                        <thead><tr><th>Invited user</th><th>Invited by</th><th className="text-end">Actions</th></tr></thead>
                                        <tbody>
                                            {invites.map((i) => (
                                                <tr key={i.id}>
                                                    <td>{userLabel(i.user)}</td>
                                                    <td>{i.invited_by ? i.invited_by.name : "—"}</td>
                                                    <td className="text-end">
                                                        <Button size="sm" variant="outline-secondary" className="me-2" onClick={() => handleResend(i.token)}>
                                                            <ArrowRepeat className="button-icon" /> Resend
                                                        </Button>
                                                        <Button size="sm" variant="outline-danger" onClick={() => setInviteToDelete(i)}>
                                                            <Trash className="button-icon" /> Delete
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                )}
                            </Tab>
                        </Tabs>
                    </Card.Body>
                </Card>
            </Container>

            {/* delete group modal */}
            <Modal show={showDeleteGroup} onHide={() => setShowDeleteGroup(false)} centered>
                <Modal.Header closeButton><Modal.Title>Delete group</Modal.Title></Modal.Header>
                <Modal.Body>Permanently delete <strong>{group.name}</strong>? This removes all members and invites.</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteGroup(false)}>Cancel</Button>
                    <Button variant="danger" onClick={confirmDeleteGroup}>Delete</Button>
                </Modal.Footer>
            </Modal>

            {/* remove member modal */}
            <Modal show={!!memberToRemove} onHide={() => setMemberToRemove(null)} centered>
                <Modal.Header closeButton><Modal.Title>Remove member</Modal.Title></Modal.Header>
                <Modal.Body>Remove <strong>{memberToRemove && userLabel(memberToRemove.user)}</strong> from this group?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setMemberToRemove(null)}>Cancel</Button>
                    <Button variant="danger" onClick={confirmRemoveMember}>Remove</Button>
                </Modal.Footer>
            </Modal>

            {/* delete invite modal */}
            <Modal show={!!inviteToDelete} onHide={() => setInviteToDelete(null)} centered>
                <Modal.Header closeButton><Modal.Title>Delete invitation</Modal.Title></Modal.Header>
                <Modal.Body>Delete the invitation for <strong>{inviteToDelete && userLabel(inviteToDelete.user)}</strong>?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setInviteToDelete(null)}>Cancel</Button>
                    <Button variant="danger" onClick={confirmDeleteInvite}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

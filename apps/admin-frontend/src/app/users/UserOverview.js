import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, Form, InputGroup } from "react-bootstrap";
import {
    Trash,
    ToggleOn,
    ToggleOff,
    Search,
} from "react-bootstrap-icons";

import {
    userSlice,
    getUsers,
    selectUsers,
    updateUser,
    deleteUser,
    getRoles,
    selectRoles,
} from "../../redux/reducers/userSlice";

import LoadingScreen from "../../components/LoadingScreen";
import PaginatedSortableTable from "../../components/PaginatedSortableTable";
import Topbar from "../../components/Topbar";

import "../SidebarAndReactStyles.scss";
import "./UserOverview.css";

export default function UserOverview() {
    const dispatch = useDispatch();
    const usersData = useSelector(selectUsers);
    const roles = useSelector(selectRoles);

    const navigate = useNavigate();

    // modalstates
    const modalStates = {
        DELETE: 0,
        ACTIVATED: 1,
        DEACTIVATED: 2,
        CORRECT: 3,
    };
    const [showModal, setShowModal] = useState(modalStates.CORRECT);
    const [selectedUser, setSelectedUser] = useState(null);

    // name/email filter
    const [searchQuery, setSearchQuery] = useState("");

    // toggle flag to force PaginatedSortableTable to refresh its data after updates
    const [refreshTableFlag, setRefreshTableFlag] = useState(false);

    // initial table settings
    const initialItemsPerPage = 10;
    const initialSortColumn = "id";
    const initialSortDirection = "asc";

    useEffect(() => {
        // initial fetch
        dispatch(
            getUsers({
                offset: 0,
                limit: initialItemsPerPage,
                orderBy: initialSortColumn,
                direction: initialSortDirection,
            })
        );
        dispatch(getRoles());
        return () => {
            dispatch(userSlice.actions.resetAllUsers());
        };
    }, [dispatch]);

    // --- helpers ---
    const roleNames = roles
        ? roles.reduce((acc, role) => {
              acc[role.id] = role.name;
              return acc;
          }, {})
        : {};

    // PaginatedSortableTable fetch callback
    const fetchData = useCallback(
        ({ offset, limit, orderBy, direction }) => {
            dispatch(getUsers({ offset, limit, orderBy, direction, search: searchQuery }));
        },
        [dispatch, searchQuery]
    );

    // --- action handlers ---
    const handleDelete = (id) => {
        setSelectedUser(id);
        setShowModal(modalStates.DELETE);
    };

    const handleShow = (id) => {
        dispatch(userSlice.actions.setUserProcess("create"));
        navigate("/users/" + id + "/information");
    };

    const handleToggleActive = (id, isActive) => {
        setSelectedUser(id);
        if (isActive) {
            setShowModal(modalStates.ACTIVATED);
        } else {
            setShowModal(modalStates.DEACTIVATED);
        }
    };

    const handleCreate = () => {
        navigate("/users/create");
    };

    // --- PaginatedSortableTable column configuration ---
    const columns = [
        {
            key: "id",
            label: "ID",
        },
        {
            key: "name",
            label: "Name",
        },
        {
            key: "role_id",
            label: "Role",
            render: (_, row) => roleNames[row.role_id],
        },
        {
            key: "state",
            label: "State",
            render: (_, row) => (
                <Button
                    variant={row.is_active ? "outline-secondary" : "outline-success"}
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); handleToggleActive(row.id, row.is_active); }}
                >
                    {row.is_active ? <ToggleOn /> : <ToggleOff />}{" "}
                    {row.is_active ? "Active" : "Inactive"}
                </Button>
            ),
        },
        {
            key: "delete",
            label: "Danger zone",
            render: (_, row) => (
                // Admins cannot be deleted.
                row.role_id === 1 ? null : (
                    <div className="text-end">
                        <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); handleDelete(row.id); }}
                        >
                            <Trash /> Delete
                        </Button>
                    </div>
                )
            ),
        },
    ];

    // --- Modal rendering ---
    const returnModal = () => {
        if (showModal === modalStates.CORRECT) return null;

        let title = "";
        let body = "";
        let buttonText = "";
        let buttonVariant = "secondary";
        let newActiveState = true;

        if (showModal === modalStates.DELETE) {
            title = `Delete user ${selectedUser}?`;
            body = `Are you sure you want to delete user ${selectedUser}?`;
            buttonText = "Delete";
            buttonVariant = "danger";
        } else if (showModal === modalStates.ACTIVATED) {
            title = `Deactivate user ${selectedUser}?`;
            body = `Are you sure you want to deactivate user ${selectedUser}?`;
            buttonText = "Deactivate";
            buttonVariant = "warning";
            newActiveState = false;
        } else if (showModal === modalStates.DEACTIVATED) {
            title = `Activate user ${selectedUser}?`;
            body = `Are you sure you want to activate user ${selectedUser}?`;
            buttonText = "Activate";
            buttonVariant = "success";
            newActiveState = true;
        }

        return (
            <Modal show onHide={() => setShowModal(modalStates.CORRECT)}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{body}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(modalStates.CORRECT)}>
                        Close
                    </Button>
                    <Button
                        variant={buttonVariant}
                        onClick={() => {
                            if (showModal === modalStates.DELETE) {
                                dispatch(deleteUser(selectedUser))
                                    .then(() => {
                                        setRefreshTableFlag(!refreshTableFlag);
                                    });
                            } else {
                                const payload = {
                                    user: { is_active: newActiveState },
                                    userId: selectedUser,
                                };
                                dispatch(updateUser(payload))
                                    .then(() => {
                                        setRefreshTableFlag(!refreshTableFlag);
                                    });
                            }
                            setShowModal(modalStates.CORRECT);
                        }}
                    >
                        {buttonText}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    };

    // --- show loading screen until both users and roles are loaded ---
    if (!usersData || !usersData.items || !usersData.count || !roles) {
        return (
            <>
                <Topbar />
                <LoadingScreen />
            </>
        );
    }

    return (
        <>
            <Topbar />
            <div id="page-content-wrapper" style={{ padding: "10px" }}>
                <h3 className="headline">Users Overview</h3>

                <div className="mb-3">
                    <Button variant="primary" onClick={handleCreate}>
                        Create New User
                    </Button>
                </div>

                <PaginatedSortableTable
                    columns={columns}
                    fetchData={fetchData}
                    data={usersData.items}
                    totalCount={usersData.count}
                    loading={false}
                    initialItemsPerPage={initialItemsPerPage}
                    initialSortColumn={initialSortColumn}
                    initialSortDirection={initialSortDirection}
                    loadingText={"Loading User Data ..."}
                    excludeSortingColumns={["state", "delete"]}
                    refreshFlag={refreshTableFlag}
                    onRowClick={(row) => handleShow(row.id)}
                    leftToolbar={
                        <InputGroup style={{ maxWidth: 320 }}>
                            <InputGroup.Text><Search /></InputGroup.Text>
                            <Form.Control
                                type="text"
                                placeholder="Filter by name or email"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </InputGroup>
                    }
                />
            </div>
            {returnModal()}
        </>
    );
}

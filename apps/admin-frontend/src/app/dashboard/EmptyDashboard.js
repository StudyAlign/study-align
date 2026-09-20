import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { PlusCircleFill, People } from "react-bootstrap-icons";

import "./Dashboard.scss";

export default function EmptyDashboard() {
    const navigate = useNavigate();

    const handleClickCreateStudy = (event) => {
        event.preventDefault()
        navigate("/create")
    }

    const handleClickImportStudy = (event) => {
        event.preventDefault()
        navigate("/import")
    }

    const handleClickCreateGroup = (event) => {
        event.preventDefault()
        navigate("/groups/create")
    }

    return (
        <div className="emptyDashboard">
            <div className="center">
                <div className="text-button-box">
                    <div className="headline-noStudies">Create your first study</div>
                    <p className="subtitle-noStudies">
                        Design a procedure, add your prototype and questionnaires, then
                        invite participants and collect interaction data. Setting up takes
                        just a few minutes.
                    </p>
                    <div className="empty-actions">
                        <Button size="lg" onClick={handleClickCreateStudy}>
                            <PlusCircleFill className="button-icon" /> Create Study
                        </Button>
                        <Button variant="outline-secondary" size="lg" onClick={handleClickImportStudy}>
                            Import Study
                        </Button>
                    </div>
                </div>
                <div className="text-button-box empty-secondary">
                    <div className="headline">Working with a team?</div>
                    <p className="subtitle-noStudies">
                        Create a group to share studies and collaborate with your colleagues.
                    </p>
                    <Button variant="link" onClick={handleClickCreateGroup}>
                        <People className="button-icon" /> Create your group
                    </Button>
                </div>
            </div>
        </div>
    )
}

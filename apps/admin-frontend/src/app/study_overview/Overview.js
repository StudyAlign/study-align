import React, { useState } from "react";
import { Row, Col, Accordion } from "react-bootstrap";
import { Copy } from "react-bootstrap-icons";

import { STATES } from "./StudyOverviewLayout";
import Collaborators from "./Collaborators";
import { reformatDate } from "../../components/CommonFunctions";

import "./StudyOverview.css";
import "../SidebarAndReactStyles.scss";

const url = process.env.REACT_APP_STUDY_ALIGN_STUDY_FRONTEND_URL;

export default function Overview(props) {
    const [isClicked, setIsClicked] = useState(false);

    const study = props.study;
    // Normalise the base URL so there is exactly one slash before the study id.
    const base = (url || "").replace(/\/+$/, "");
    const collab_url = base + "/" + study.id + "/";

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

    return (
        <>
            <Row className="gx-5">
                <Col lg={7}>
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

                    {/* Description & consent stay within the details column. */}
                    <Accordion defaultActiveKey={["description", "consent"]} alwaysOpen className="mt-4">
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
                <Col lg={5} className="mt-4 mt-lg-2">
                    <Collaborators study={study} />
                </Col>
            </Row>
        </>
    );
}

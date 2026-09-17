import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {Badge, Button, Col, Modal, Row} from "react-bootstrap";
import { Trash, PencilSquare } from "react-bootstrap-icons";

import { saveAs } from "file-saver";
import * as yaml from "js-yaml";

import Topbar from "../../components/Topbar";
import SidebarLayout from "./SidebarLayout";
import Overview from "./Overview";
import Procedure from "./Procedure";
import InteractionData from "./InteractionData";
import Participants from "./Participants";
import LoadingScreen from "../../components/LoadingScreen";

import {
    interactionSlice,
    // getFirst100GenericInteractions,
} from "../../redux/reducers/interactionSlice";

import {
    studySlice,
    deleteStudy,
    getProcedureConfig,
    getStudy,
    getStudySetupInfo,
    selectStudy,
    selectStudySetupInfo,
    updateStudy,
    selectStudyProcedureOverview,
    getProcedureConfigOverview,
    exportStudySchema,
    selectStudyExport,
    duplicateStudy,
} from "../../redux/reducers/studySlice";
import {UserSteps} from "../users/UserCreationLayout";

export const STATES = {
    SETUP: "setup",
    RUNNING: "running",
    FINISHED: "finished"
}

// TODO Maybe refactor layout so that the use is similar to the CreateStudyLayout
export default function StudyOverviewLayout() {

    const editEnum = {
        Closed: 0,
        Running: 1,
        NotOpen: 2,
    }

    const modalStates = {
        DELETE: 0,
        EXPORT: 1,
        CORRECT: 2,
    }

    const { study_id, page } = useParams()

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [showModal, setShowModal] = useState(modalStates.CORRECT)
    const [copyButtonText, setCopyButtonText] = useState('COPY TO CLIPBOARD');
    const [editState, setEditState] = useState(-1)

    const study = useSelector(selectStudy)
    const studyExport = useSelector(selectStudyExport)

    useEffect(() => {
        dispatch(getStudy(study_id))
        dispatch(exportStudySchema(study_id))
        // Interaction Data
        // dispatch(getFirst100GenericInteractions(study_id))
        return () => {
            dispatch(studySlice.actions.resetStudyExport())
            dispatch(studySlice.actions.resetStudySetupInfo())
            dispatch(studySlice.actions.resetProcedureOverview())
            dispatch(studySlice.actions.resetParticipants())
            // Interaction Data
            dispatch(interactionSlice.actions.resetAllInteractions())
        }
    }, [])

    useEffect(() => {
        if (study) {
            if (study) {
                switch (study.state) {
                    case STATES.RUNNING:
                        if (new Date(study.endDate.split('T')[0]) < new Date()) {
                            setEditState(editEnum.Closed)
                        } else {
                            setEditState(editEnum.Running)
                        }
                        return
                    case STATES.SETUP:
                        setEditState(editEnum.NotOpen)
                        return
                    default:
                        setEditState(editEnum.Closed)
                        return
                }
            }
        }
    }, [study])

    if(study === null) {
        return (
            <>
                <Topbar/>
                <h2> ERROR 404 - Study not found </h2>
            </>
        )
    }

    if (study == null || studyExport == null) {
        return (
            <>
                <Topbar/>
                <LoadingScreen/>
            </>
        )
    }



    const getContent = (page) => {
        let content
        if(page === 'overview') {
            content = <Overview study={study}/>
        }
        else if(page === 'procedure') {
            content = <Procedure/>
        }
        else if(page === 'data') {
            content = <InteractionData/>
        } else if(page === 'participants') {
            content = <Participants/>
        }
        else {
            content = "Error - Page not found"
        }
        return content
    }

    const handleEdit = async (event) => {
        event.preventDefault()
        await dispatch(updateStudy({
            "studyId": study_id,
            "study": {
                "current_setup_step": "study"
            }
        }))
        await dispatch(getStudySetupInfo(study_id))
        // choose edit path
        if(editState === editEnum.Running) {
            navigate("/edit/" + study_id + "/information")
        } else if (editState === editEnum.NotOpen) {
            navigate("/create/" + study_id + "/information")
        }
    }

    const handleEditProcedure = async (event) => {
        event.preventDefault()
        await dispatch(updateStudy({
            "studyId": study_id,
            "study": { "current_setup_step": "procedure" }
        }))
        await dispatch(getStudySetupInfo(study_id))
        if (editState === editEnum.NotOpen) {
            navigate("/create/" + study_id + "/procedure")
        } else {
            navigate("/edit/" + study_id + "/procedure")
        }
    }

    const handleToggleState = async (newState) => {
        await dispatch(updateStudy({ "studyId": study_id, "study": { "state": newState } }))
        await dispatch(getStudy(study_id))
    }

    const getStateButton = () => {
        switch (study.state) {
            case STATES.RUNNING:
                return <Button variant="outline-secondary" onClick={() => handleToggleState("finished")}>Close Study</Button>
            case STATES.FINISHED:
                return <Button variant="outline-secondary" onClick={() => handleToggleState("running")}>Reopen Study</Button>
            case STATES.SETUP:
                return <Button variant="outline-secondary" onClick={handleEdit}>Finish Setup</Button>
            default:
                return null
        }
    }

    const handleDuplicate = async (event) => {
        event.preventDefault()

        await dispatch(duplicateStudy(study_id)).then((newStudy) => {
            navigate("/create/" + newStudy.payload.body.id + "/information")
        })
    }

    const handleCopyToClipboard = (event) => {
        event.preventDefault()
        navigator.clipboard.writeText(JSON.stringify(studyExport, null, 2)).then(() => {
            setCopyButtonText('COPIED!');
            setTimeout(() => {
                setCopyButtonText('COPY TO CLIPBOARD');
            }, 2000);
        }).catch(err => {
            console.error('Copy To Clipboard Error', err);
            setCopyButtonText('ERROR!');
            setTimeout(() => {
                setCopyButtonText('COPY TO CLIPBOARD');
            }, 2000);
        });
    }


    const handleExport = (event, type) => {
        event.preventDefault()
        
        // Export
        let data
        let fileName
        let mimeType

        if (type === 0) { // JSON
            data = JSON.stringify(studyExport, null, 2)
            fileName = "study_export_" + study.name + ".json"
            mimeType = "application/json"
        } else if (type === 1) { // YAML
            data = yaml.dump(studyExport)
            fileName = "study_export_" + study.name + ".yaml"
            mimeType = "application/x-yaml"
        }

        // close modal
        setShowModal(modalStates.CORRECT)

        // Create a blob and trigger download
        const blob = new Blob([data], { type: mimeType })
        saveAs(blob, fileName)
    }

    const handleDelete = async (event) => {
        event.preventDefault()
        await dispatch(deleteStudy(study_id))
        navigate("/")
    }

    const returnModal = () => {
        if (showModal !== modalStates.CORRECT) {
            let title = null
            let body = null
            let footer = null

            if (showModal === modalStates.DELETE) {
                title = "Delete Study"
                body = (
                    <Modal.Body>
                        Are you sure you want to delete study: "{study.name}"!
                    </Modal.Body>
                )
                footer = (
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(modalStates.CORRECT)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleDelete}>
                            Delete
                        </Button>
                    </Modal.Footer>
                )
            } else if (showModal === modalStates.EXPORT) {
                title = "Export Study"
                body = (
                    <Modal.Body>
                        Export study: "{study.name}"!
                        <textarea
                            value={JSON.stringify(studyExport, null, 2)}
                            readOnly
                            style={{width: '100%', height: '300px', marginTop: '10px'}}
                        />
                    </Modal.Body>
                )
                footer = (
                    <Modal.Footer>
                        <Button variant="primary" onClick={(event) => handleCopyToClipboard(event)}>
                            {copyButtonText}
                        </Button>
                        <Button variant="success" onClick={(event) => handleExport(event, 0)}>
                            DOWNLOAD
                        </Button>
                    </Modal.Footer>
                )
            }

            if (title === null || body === null || footer === null) return

            return (
                <Modal show={true} onHide={() => setShowModal(modalStates.CORRECT)}>
                    <Modal.Header>
                        <Modal.Title> {title} </Modal.Title>
                    </Modal.Header>
                    {body}
                    {footer}
                </Modal>
            )
        }
    }

    return (
        <>
            <Topbar/>
            <SidebarLayout fullWidth={page === 'overview' || page === 'data'}>
                <Row className="align-items-center">
                    <Col>
                        <h3><Badge bg="secondary">#{study_id}</Badge> {study.name}</h3>
                    </Col>
                    <Col xs="auto">
                        {page === 'procedure' && (
                            <Button variant="primary" onClick={handleEditProcedure}>
                                <PencilSquare /> Edit
                            </Button>
                        )}
                    </Col>
                </Row>

                {/* Study action navbar: only on the details overview. */}
                {page === 'overview' && (
                    <Row className="mb-3">
                        <Col>
                            <div className="study-toolbar d-flex flex-wrap gap-2 align-items-center">
                                {editState !== editEnum.Closed && (
                                    <Button variant="primary" onClick={handleEdit}>
                                        <PencilSquare /> Edit
                                    </Button>
                                )}
                                <Button variant="outline-secondary" onClick={handleDuplicate}>Duplicate</Button>
                                <Button variant="outline-secondary" onClick={() => setShowModal(modalStates.EXPORT)}>Export</Button>
                                {getStateButton()}
                                <Button variant="outline-danger" className="ms-auto" onClick={() => setShowModal(modalStates.DELETE)}>
                                    <Trash /> Delete
                                </Button>
                            </div>
                        </Col>
                    </Row>
                )}

                {getContent(page)}
            </SidebarLayout>

            {returnModal()}
        </>
    )
}
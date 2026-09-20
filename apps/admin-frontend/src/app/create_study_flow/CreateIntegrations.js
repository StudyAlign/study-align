import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router";
import { Button, Card, Container, Form, Row, Tooltip, OverlayTrigger } from "react-bootstrap";
import { Clipboard } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";

import { getStudySetupInfo, selectStudySetupInfo, updateStudy, getProcedureConfig, selectStudyProcedure, getProcedureConfigOverview, selectStudyProcedureOverview } from "../../redux/reducers/studySlice";

import StudyCreationLayout, { CreationSteps } from "./navigation_logic/StudyCreationLayout";
import { CreateProcedureContext } from "./CreateProcedure";
import { ProcedureTypes } from "./ProcedureObject";
import LoadingScreen from "../../components/LoadingScreen";
import Topbar from "../../components/Topbar";

const url = process.env.REACT_APP_STUDY_ALIGN_URL || "http://localhost:8000/";

const questionnaireSystems = {
    LIMESURVEY: "limesurvey",
    QUALTRICS: "qualtrics",
    SURVEYMONKEY: "surveymonkey",
    GOOGLEFORMS: "googleforms",
    TYPEFORM: "typeform",
    JOTFORM: "jotform",
}

const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'

const styles = {
    // A place / label to look for in the survey tool's own UI (not copyable).
    location: {
        display: 'inline-block',
        fontWeight: 600,
        color: '#2b3a67',
        backgroundColor: '#eef3fd',
        border: '1px solid #d3e0f7',
        borderRadius: '4px',
        padding: '0 6px',
    },
    // A short value to copy (click to copy).
    chip: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        fontFamily: MONO,
        fontSize: '0.85em',
        color: '#212529',
        backgroundColor: '#f1f3f5',
        border: '1px solid #dee2e6',
        borderRadius: '4px',
        padding: '1px 6px',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
    },
    // A longer value / code snippet to copy (click to copy).
    codeBlock: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px',
        fontFamily: MONO,
        fontSize: '0.82em',
        color: '#212529',
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '6px',
        padding: '10px 12px',
        marginTop: '8px',
        cursor: 'pointer',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
    },
    li: {
        marginBottom: '0.6rem',
        lineHeight: 1.6,
    },
}

// Human-facing name for each questionnaire system.
const systemLabels = {
    limesurvey: "LimeSurvey",
    qualtrics: "Qualtrics",
    surveymonkey: "SurveyMonkey",
    googleforms: "Google Forms",
    typeform: "Typeform",
    jotform: "Jotform",
}

const code = "" +
    "<script type=\"text/javascript\">\n" +
    "   const navigatorUpdate = new Promise( (resolve, reject) => {\n" +
    "\n" +
    "       const limeSurveyAccessCode = \"{TOKEN}\";\n" +
    "       const a = limeSurveyAccessCode.slice(0, 8);\n" +
    "       const b = limeSurveyAccessCode.slice(8, 12);\n" +
    "       const c = limeSurveyAccessCode.slice(12, 16);\n" +
    "       const d = limeSurveyAccessCode.slice(16, 20);\n" +
    "       const e = limeSurveyAccessCode.slice(20);\n" +
    "       const h = \"-\";\n" +
    "       const participantToken = [a, h, b, h, c, h, d, h, e].join('');\n" +
    " \n" +
    "       const surveyId = \"{SID}\";\n" +
    "\n" +
    "       let url = \"" + url + "\";\n" +
    "       const body = {\n" +
    "           \"source\": \"limesurvey\",\n" +
    "           \"ext_id\": surveyId, // limesurvey ID\n" +
    "           \"participant_token\": participantToken, // participant token (limesurvey access code in uuid format)\n" +
    "           //\"procedure_step_id\": 0, // optional! deprecated?\n" +
    "           \"state\": \"done\" // can be \"in_progress\" or \"done\"\n" +
    "       };\n" +
    "\n" +
    "       url = url + \"/api/v1/procedures/navigator\";\n" +
    "       const xhr = new XMLHttpRequest();\n" +
    "       xhr.open(\"POST\", url);\n" +
    "       xhr.onload = () => {\n" +
    "           if (xhr.status >= 200 && xhr.status < 300) {\n" +
    "               resolve({\n" +
    "                   status: xhr.status,\n" +
    "                   body: xhr.response ? JSON.parse(xhr.response) : \"\"\n" +
    "               });\n" +
    "           } else {\n" +
    "               reject({\n" +
    "                   status: xhr.status,\n" +
    "                   statusText: xhr.statusText,\n" +
    "                   requestBody: body\n" +
    "               });\n" +
    "           }\n" +
    "       };\n" +
    "       xhr.onerror = () => {\n" +
    "           reject({\n" +
    "               status: xhr.status,\n" +
    "               statusText: xhr.statusText,\n" +
    "               requestBody: body\n" +
    "           });\n" +
    "       };\n" +
    "       xhr.setRequestHeader(\"Content-type\", \"application/json\");\n" +
    "       xhr.send(JSON.stringify(body));\n" +
    "   });\n" +
    "\n" +
    "   navigatorUpdate.then(response => {\n" +
    "       console.log(response);\n" +
    "   }).catch(error => {\n" +
    "       console.log(error);\n" +
    "   });\n" +
    "</script> \n"

export default function CreateIntegrations(props) {

    const { status } = props

    const { currentSystem, NO_QUESTIONNAIRE_SYSTEM } = useContext(CreateProcedureContext)

    const { study_id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [checked, setChecked] = useState(false)

    const procedureConfig = useSelector(selectStudyProcedure)
    const procedureConfigOverview = useSelector(selectStudyProcedureOverview)
    const studySetupInfo = useSelector(selectStudySetupInfo)

    useEffect(() => {
        dispatch(getProcedureConfig(study_id)).then((response) => {
            if (response.payload.body.id) {
                dispatch(getProcedureConfigOverview(response.payload.body.id))
            }
        })
    }, [])

    // This step only configures external survey systems. If the study has no
    // external questionnaire (none, or only native), skip straight to the check.
    useEffect(() => {
        if (procedureConfigOverview == null) return
        const collect = (steps) => {
            let systems = []
            for (const step of (steps || [])) {
                if (step.questionnaire && step.questionnaire.system) systems.push(step.questionnaire.system)
                if (step.block && step.block.procedure_config_steps) {
                    systems = systems.concat(collect(step.block.procedure_config_steps))
                }
            }
            return systems
        }
        const hasExternal = collect(procedureConfigOverview.procedure_config_steps).some((s) => s && s !== "native")
        if (!hasExternal) {
            const base = (!studySetupInfo || studySetupInfo.state === "setup") ? "create" : "edit"
            navigate("/" + base + "/" + study_id + "/check", { replace: true })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [procedureConfigOverview])

    if (procedureConfig == null || procedureConfigOverview == null) {
        return (
            <>
                <Topbar />
                <LoadingScreen />
            </>
        )
    }

    const handleProceed = async (event) => {
        event.preventDefault()
        await dispatch(updateStudy({
            "studyId": study_id,
            "study": {
                "current_setup_step": "integrations"
            }
        }))
        await dispatch(getStudySetupInfo(study_id))
        if (studySetupInfo.state === "setup") {
            navigate("/create/" + study_id + "/check")
        } else {
            navigate("/edit/" + study_id + "/check")
        }
    }

    const checkForQuestionnaires = () => {
        const gatherArray = (steps) => {
            let procedure = []
            for (let step of steps) {
                let newContent = {
                    id: undefined,
                    type: undefined,
                    content: undefined,
                    children: undefined
                }
                if (step["questionnaire_id"]) {
                    newContent.id = "q" + step["questionnaire_id"].toString()
                    newContent.type = ProcedureTypes.Questionnaire
                    let empty_content = JSON.parse(JSON.stringify(ProcedureTypes.Questionnaire.emptyContent))
                    for (let [key,] of Object.entries(ProcedureTypes.Questionnaire.emptyContent)) {
                        empty_content[key] = step["questionnaire"][key]
                    }
                    newContent.content = JSON.parse(JSON.stringify(empty_content))
                    // push new content
                    procedure.push(newContent)
                } else if (step["block_id"]) {
                    newContent.id = "b" + step["block_id"].toString()
                    newContent.type = ProcedureTypes.BlockElement
                    newContent.children = gatherArray(step["block"]["procedure_config_steps"])
                    // push new content
                    procedure.push(newContent)
                }
            }
            return procedure
        }
        const questionnaireBlockArray = gatherArray(procedureConfigOverview["procedure_config_steps"])
        const blockElements = questionnaireBlockArray.filter(element => element.type === ProcedureTypes.BlockElement)
        // save questionnaireBlockArray without block elements
        const questionnaireArray = questionnaireBlockArray.filter(element => element.type === ProcedureTypes.Questionnaire)
        for (let block of blockElements) {
            for (let q of block.children) {
                questionnaireArray.push(q)
            }
        }
        return questionnaireArray
    }

    const LimeSurveyInstructions = () => {
        const [copySuccess, setCopySuccess] = useState(false)
        let timeoutId

        const backendUrl = process.env.REACT_APP_STUDY_ALIGN_URL;

        const url = backendUrl + "/{PASSTHRU:SAL_ID}/proceed/{PASSTHRU:SAL_TOKEN}"
        const copy1 = "SAL_TOKEN"
        const copy2 = "SAL_ID"
        const end = "Please click on the following link"
    
        const copyToClipboard = (text) => {
            navigator.clipboard.writeText(text).then(() => {
                setCopySuccess(true);
                timeoutId = setTimeout(() => setCopySuccess(false), 2000)
            })
        }

        const handleMouseLeave = () => {
            clearTimeout(timeoutId)
            setCopySuccess(false)
        }
    
        const renderTooltip = (props) => (
            <Tooltip {...props}>
                {copySuccess ? "Copied!" : "Copy to Clipboard"}
            </Tooltip>
        )

        // Click-to-copy value. `block` renders a full-width code box for longer text.
        const CopyChip = ({ text, block }) => (
            <OverlayTrigger placement="top" delay={{ show: 250, hide: 400 }} overlay={renderTooltip}>
                <span onClick={() => copyToClipboard(text)} onMouseLeave={handleMouseLeave} style={block ? styles.codeBlock : styles.chip}>
                    {block && <Clipboard style={{ flexShrink: 0, marginTop: '2px' }} />}
                    <span style={block ? { flex: 1 } : undefined}>{text}</span>
                    {!block && <Clipboard size={12} style={{ opacity: 0.6 }} />}
                </span>
            </OverlayTrigger>
        )

        return (
            <ol style={{ paddingLeft: '1.25rem', marginBottom: 0 }}>
                <li style={styles.li}>Create two <strong>hidden fields</strong> in your questionnaire — one for the study id, one for the participant token.</li>
                <li style={styles.li}>
                    Open <span style={styles.location}>Panel Integration</span> and add two URL parameters, <CopyChip text={copy1} /> and <CopyChip text={copy2} />, then point each at the matching hidden field from step 1.
                </li>
                <li style={styles.li}>
                    In <span style={styles.location}>Text Elements</span>, set the <strong>End URL</strong> to:
                    <CopyChip text={url} block />
                </li>
                <li style={styles.li}>
                    Set the <span style={styles.location}>End message</span> to <CopyChip text={end} />.
                </li>
                <li style={styles.li}>The End URL is appended to the End message automatically when participants reach it.</li>
            </ol>
        )
    }

    const QualtricsInstructions = () => {
        const [copySuccess, setCopySuccess] = useState(false)
        let timeoutId

        const backendUrl = process.env.REACT_APP_STUDY_ALIGN_URL;

        const code = 'Please click on the following link: <a href="' + backendUrl + '/${e://Field/SAL_ID}/proceed/${e://Field/SAL_TOKEN}" rel="nofollow">' + backendUrl + '/${e://Field/SAL_ID}/proceed/${e://Field/SAL_TOKEN}</a><br />'
        const copy1 = "SAL_TOKEN"
        const copy2 = "SAL_ID"
    
        const copyToClipboard = (text) => {
            navigator.clipboard.writeText(text).then(() => {
                setCopySuccess(true);
                timeoutId = setTimeout(() => setCopySuccess(false), 2000)
            })
        }

        const handleMouseLeave = () => {
            clearTimeout(timeoutId)
            setCopySuccess(false)
        }
    
        const renderTooltip = (props) => (
            <Tooltip {...props}>
                {copySuccess ? "Copied!" : "Copy to Clipboard"}
            </Tooltip>
        )

        // Click-to-copy value. `block` renders a full-width code box for longer text.
        const CopyChip = ({ text, block }) => (
            <OverlayTrigger placement="top" delay={{ show: 250, hide: 400 }} overlay={renderTooltip}>
                <span onClick={() => copyToClipboard(text)} onMouseLeave={handleMouseLeave} style={block ? styles.codeBlock : styles.chip}>
                    {block && <Clipboard style={{ flexShrink: 0, marginTop: '2px' }} />}
                    <span style={block ? { flex: 1 } : undefined}>{text}</span>
                    {!block && <Clipboard size={12} style={{ opacity: 0.6 }} />}
                </span>
            </OverlayTrigger>
        )

        return (
            <ol style={{ paddingLeft: '1.25rem', marginBottom: 0 }}>
                <li style={styles.li}>In <span style={styles.location}>Survey Flow</span>, add an <span style={styles.location}>Embedded Data</span> element.</li>
                <li style={styles.li}>
                    In that <span style={styles.location}>Embedded Data</span> element, add the fields <CopyChip text={copy1} /> and <CopyChip text={copy2} />.
                </li>
                <li style={styles.li}>Add an <span style={styles.location}>End of Survey</span> element.</li>
                <li style={styles.li}>Customize the End of Survey message — create a new one, or reuse one you already set up for another questionnaire.</li>
                <li style={styles.li}>
                    Paste this into the source code of the end message:
                    <CopyChip text={code} block />
                </li>
            </ol>
        )
    }

    const questionnaireSteps = (system) => {
        let instructions = null
        if (system === questionnaireSystems.LIMESURVEY) instructions = <LimeSurveyInstructions />
        else if (system === questionnaireSystems.QUALTRICS) instructions = <QualtricsInstructions />
        if (!instructions) return null

        const label = systemLabels[system] || system
        return (
            <Card className="mt-3">
                <Card.Header>Connect your <strong>{label}</strong> questionnaires</Card.Header>
                <Card.Body>
                    <p className="text-muted mb-3">
                        Complete these steps in {label} so participants return to StudyAlign after each
                        questionnaire. Click a highlighted value to copy it.
                    </p>
                    {instructions}
                </Card.Body>
            </Card>
        )
    }

    const showCurrentSystemCallback = () => {
        let noSystem
        let system

        const questionnaires = checkForQuestionnaires()
        if (questionnaires.length === 0) {
            noSystem = true
        } else {
            noSystem = false
            system = questionnaires[0].content.system
        }

        if (noSystem) {
            return (
                <>
                    <Card className="mt-3">
                        <Card.Body>
                            <p className="mb-1">You're not using a questionnaire system in your procedure.</p>
                            <p className="text-muted mb-0">Nothing to set up here — continue to review and finish your study.</p>
                        </Card.Body>
                    </Card>

                    <Row className='mt-3' xs="auto">
                        <Button onClick={handleProceed}>Continue</Button>
                    </Row>
                </>
            )
        } else {
            return (
                <>
                    {questionnaireSteps(system)}

                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-3 pt-3 border-top">
                        <Form.Check
                            id="followed-all-steps"
                            checked={checked}
                            onChange={() => setChecked(!checked)}
                            label="I followed all steps"
                        />
                        <Button onClick={handleProceed} disabled={!checked}>Continue</Button>
                    </div>
                </>
            )
        }
    }

    return (
        <StudyCreationLayout step={CreationSteps.Integrations}>
            <Container>
                {showCurrentSystemCallback()}
            </Container>
        </StudyCreationLayout>
    )
}

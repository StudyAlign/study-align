import {Col, Container, Row} from "react-bootstrap";
import React, {useState, useEffect} from "react";
import {useSelector} from "react-redux";

import {selectStudy} from "../redux/reducers/studySlice";

const BACKEND_URL = process.env.REACT_APP_STUDY_ALIGN_URL || "http://localhost:8000";

export default function Topbar() {
    const study = useSelector(selectStudy);
    const [logoFailed, setLogoFailed] = useState(false);

    const groupId = study && study.group_id;
    const group = study && study.group;

    // Reset the logo-failed flag when the branded group changes.
    useEffect(() => { setLogoFailed(false); }, [groupId]);

    let brand;
    if (groupId && !logoFailed) {
        // Brand the study by its group's logo.
        brand = (
            <img
                className="group-logo"
                alt={group ? group.name : "Group"}
                src={BACKEND_URL + "/api/v1/groups/" + groupId + "/logo"}
                onError={() => setLogoFailed(true)}
            />
        );
    } else if (group && group.name) {
        // Fall back to the group name when there is no logo.
        brand = <span className="group-name">{group.name}</span>;
    } else {
        // No group: the default StudyAlign logo.
        brand = (
            <img
                className="logo"
                alt="StudyAlign"
                src={process.env.PUBLIC_URL + '/hciai-ubt-combination-rgb-white-dense.png'}
            />
        );
    }

    return <div className="top-bar">
        <Container>
            <Row>
                <Col lg={{ span: 8, offset: 2 }} md={{ span: 10, offset: 1 }} xs={12}>
                    {brand}
                </Col>
            </Row>
        </Container>
    </div>
}

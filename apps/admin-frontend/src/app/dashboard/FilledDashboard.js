import React, { useState, useMemo } from "react";
import { Container, Row, Col, Form, InputGroup } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";

import StudyBox from "./StudyBox";

import { STATES } from "../study_overview/StudyOverviewLayout";

import "./Dashboard.scss";

// Status filters offered above the grid.
const FILTERS = {
    ALL: "all",
    OPEN: STATES.RUNNING,
    FUTURE: "future",
    CLOSED: STATES.FINISHED,
    SETUP_UNFINISHED: STATES.SETUP,
};

const FILTER_OPTIONS = [
    { value: FILTERS.ALL, label: "All Studies" },
    { value: FILTERS.OPEN, label: "Open Studies" },
    { value: FILTERS.FUTURE, label: "Future Studies" },
    { value: FILTERS.CLOSED, label: "Closed Studies" },
    { value: FILTERS.SETUP_UNFINISHED, label: "Setup Not Finished" },
];

const SORT_OPTIONS = [
    { value: "date_desc", label: "Newest first" },
    { value: "date_asc", label: "Oldest first" },
    { value: "name_asc", label: "Name (A–Z)" },
    { value: "name_desc", label: "Name (Z–A)" },
];

const startTime = (s) => new Date(s.startDate).getTime();

export default function FilledDashboard(props) {
    const [filter, setFilter] = useState(FILTERS.ALL);
    const [sort, setSort] = useState("date_desc");
    const [query, setQuery] = useState("");

    const isFuture = (s) => new Date(s.startDate.split("T")[0]) > new Date();

    const matchesFilter = (s) => {
        switch (filter) {
            case FILTERS.OPEN: return s.state === STATES.RUNNING;
            case FILTERS.FUTURE: return isFuture(s);
            case FILTERS.CLOSED: return s.state === STATES.FINISHED;
            case FILTERS.SETUP_UNFINISHED: return s.state === STATES.SETUP;
            case FILTERS.ALL:
            default: return true;
        }
    };

    const visibleStudies = useMemo(() => {
        const term = query.trim().toLowerCase();
        const list = props.studies
            .filter(matchesFilter)
            .filter((s) => !term || (s.name || "").toLowerCase().includes(term));

        const sorted = [...list];
        switch (sort) {
            case "date_asc": sorted.sort((a, b) => startTime(a) - startTime(b)); break;
            case "name_asc": sorted.sort((a, b) => (a.name || "").localeCompare(b.name || "")); break;
            case "name_desc": sorted.sort((a, b) => (b.name || "").localeCompare(a.name || "")); break;
            case "date_desc":
            default: sorted.sort((a, b) => startTime(b) - startTime(a)); break;
        }
        return sorted;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.studies, filter, sort, query]);

    return (
        <div className="curr-studies">
            <Container fluid className="p-0 mx-auto">
                <h3 className="headline">Studies</h3>

                {/* Filters and sort sit on their own row above the grid. */}
                <div className="dashboard-toolbar mb-3">
                    <InputGroup className="dashboard-search">
                        <InputGroup.Text><Search /></InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder="Search studies by title"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </InputGroup>
                    <Form.Select
                        aria-label="Filter studies"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        {FILTER_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </Form.Select>
                    <Form.Select
                        aria-label="Sort studies"
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                    >
                        {SORT_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </Form.Select>
                </div>

                {visibleStudies.length === 0 ? (
                    <div className="text-muted">No studies match the current filter.</div>
                ) : (
                    // Re-key on filter/sort so the staggered entrance animation
                    // replays when the ordering or filter changes.
                    <Row className="g-3" key={`${filter}-${sort}`}>
                        {visibleStudies.map((s, i) => (
                            <Col key={s.id} xs={12} sm={6} lg={4} xxl={3}
                                className="study-card-anim"
                                style={{ animationDelay: `${Math.min(i, 12) * 45}ms` }}>
                                <StudyBox study={s} />
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>
        </div>
    );
}

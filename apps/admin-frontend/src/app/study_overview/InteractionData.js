import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Button, Tabs, Tab, Modal, Table, Row, Col, Card } from "react-bootstrap";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import LoadingScreen from "../../components/LoadingScreen";
import { LOADING } from "../../redux/apiStates";
import { apiWithAuth, getInteractionTimelineApi, getConditionsApi } from "../../api/studyAlignApi";
import { selectStudy } from "../../redux/reducers/studySlice";

import {
    getGenericInteractions,
    getDragInteractions,
    getKeyboardInteractions,
    getMouseInteractions,
    getTouchInteractions,
    selectGenericInteraction,
    selectDragInteraction,
    selectKeyboardInteraction,
    selectMouseInteraction,
    selectTouchInteraction,
    getInteractionExport,
    selectExportInteraction,
    selectStatus,
} from "../../redux/reducers/interactionSlice";

import PaginatedSortableTable from "../../components/PaginatedSortableTable";

import "./StudyOverview.css";
import "../SidebarAndReactStyles.scss";

// Helper component to render nested object values as a table.
const NestedTable = ({ data }) => {
    return (
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th className="font-weight-bold">Key</th>
                    <th className="font-weight-bold">Value</th>
                </tr>
            </thead>
            <tbody>
                {Object.entries(data).map(([key, value], idx) => (
                    <tr key={idx}>
                        <td className="font-weight-bold">{key}</td>
                        <td className="nested-value-td">{value !== undefined ? JSON.stringify(value) : ""}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

// A single metric tile for the dashboard.
const StatCard = ({ label, value, sub }) => (
    <Card className="h-100">
        <Card.Body className="py-3">
            <div className="text-muted small text-uppercase" style={{ letterSpacing: "0.03em" }}>{label}</div>
            <div style={{ fontSize: "1.6rem", fontWeight: 600, lineHeight: 1.15 }}>{value}</div>
            {sub && <div className="text-muted small">{sub}</div>}
        </Card.Body>
    </Card>
);

// Fill the gaps between the first and last logged day with zero-count days, so
// the chart reads as a continuous timeline over the study's active period.
const buildDenseSeries = (timeline) => {
    if (!timeline || timeline.length === 0) return [];
    const byDate = new Map(timeline.map((b) => [b.date, b.count]));
    const series = [];
    const cursor = new Date(timeline[0].date + "T00:00:00");
    const last = new Date(timeline[timeline.length - 1].date + "T00:00:00");
    // Guard against a pathological range blowing up the DOM.
    for (let guard = 0; cursor <= last && guard < 400; guard++) {
        const key = cursor.toISOString().slice(0, 10);
        series.push({ date: key, count: byDate.get(key) || 0 });
        cursor.setDate(cursor.getDate() + 1);
    }
    return series;
};

// A timeline needs at least this many distinct days with events before the
// "over time" chart conveys anything — a single day collapses to one bar with
// identical start/end labels, which reads as an empty axis.
const MIN_DAYS_FOR_CHART = 2;

// Minimal dependency-free bar chart of events per day.
const EventsChart = ({ timeline }) => {
    const series = useMemo(() => buildDenseSeries(timeline), [timeline]);
    if (series.length === 0) {
        return <div className="text-muted small py-4 text-center">No events logged yet.</div>;
    }
    const W = 800, H = 140, pad = { l: 8, r: 8, t: 8, b: 20 };
    const chartH = H - pad.t - pad.b;
    const max = Math.max(...series.map((s) => s.count), 1);
    const bw = (W - pad.l - pad.r) / series.length;
    return (
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: "100%", height: 140 }} role="img" aria-label="Events logged over time">
            {series.map((s, i) => {
                const h = (s.count / max) * chartH;
                return (
                    <rect
                        key={s.date}
                        x={pad.l + i * bw + bw * 0.15}
                        y={pad.t + (chartH - h)}
                        width={Math.max(bw * 0.7, 0.5)}
                        height={h}
                        rx={1}
                        fill="#2563eb"
                    >
                        <title>{s.date}: {s.count}</title>
                    </rect>
                );
            })}
            <line x1={pad.l} y1={pad.t + chartH} x2={W - pad.r} y2={pad.t + chartH} stroke="#dee2e6" />
            <text x={pad.l} y={H - 5} fontSize="11" fill="#6c757d">{series[0].date}</text>
            <text x={W - pad.r} y={H - 5} fontSize="11" fill="#6c757d" textAnchor="end">{series[series.length - 1].date}</text>
        </svg>
    );
};

export default function InteractionData() {
    const { study_id } = useParams();
    const dispatch = useDispatch();
    const study = useSelector(selectStudy);

    // Dashboard data fetched directly (kept out of the interaction slice).
    const [timeline, setTimeline] = useState(null);
    const [conditionsCount, setConditionsCount] = useState(null);

    useEffect(() => {
        apiWithAuth(getInteractionTimelineApi, { studyId: study_id }, dispatch)
            .then((res) => setTimeline(res.body ?? []))
            .catch(() => setTimeline([]));
        apiWithAuth(getConditionsApi, study_id, dispatch)
            .then((res) => setConditionsCount(Array.isArray(res.body) ? res.body.length : 0))
            .catch(() => setConditionsCount(null));
    }, [study_id, dispatch]);

    // Export-related state
    const [exportModalOpen, setExportModalOpen] = useState(false);
    const [autoTriggered, setAutoTriggered] = useState(false);

    // Always mount all tabs initially so that the API calls are triggered.
    // activeTab will later be adjusted based on available data.
    const [activeTab, setActiveTab] = useState("generic");

    // Global API status from Redux (LOADING, etc.)
    const apiStatus = useSelector(selectStatus);

    // Interaction data from Redux.
    // The initial state is { items: null, count: null }.
    // After the API call, if no data is available, it becomes { items: null, count: 0 }.
    const genericData = useSelector(selectGenericInteraction);
    const dragData = useSelector(selectDragInteraction);
    const keyboardData = useSelector(selectKeyboardInteraction);
    const mouseData = useSelector(selectMouseInteraction);
    const touchData = useSelector(selectTouchInteraction);

    // Export data from Redux.
    const exportData = useSelector(selectExportInteraction);

    const triggerSaveBlob = useCallback(() => {
        const blob = exportData.data;
        if (blob) {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `interaction_export_${study_id}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }
    }, [exportData.data, study_id]);

    // Trigger automatic export download when ready.
    useEffect(() => {
        if (
            exportModalOpen &&
            exportData.status !== LOADING &&
            exportData.data &&
            !autoTriggered
        ) {
            triggerSaveBlob();
            setAutoTriggered(true);
        }
    }, [exportModalOpen, exportData.status, exportData.data, autoTriggered, triggerSaveBlob]);

    // Map each interaction type to its Redux data.
    const interactionDataMap = useMemo(() => ({
        generic: genericData,
        drag: dragData,
        keyboard: keyboardData,
        mouse: mouseData,
        touch: touchData,
    }), [genericData, dragData, keyboardData, mouseData, touchData]);
    // Compute the tabs to display.
    // While any tab is still loading (count === null), return all keys so that
    // each PaginatedSortableTable mounts and triggers its API call.
    // Once all API calls are complete (none have count === null),
    // only include keys where count > 0.
    const computedAvailableTabs = useMemo(() => {
        const keys = Object.keys(interactionDataMap);
        const anyLoading = keys.some((key) => {
            const data = interactionDataMap[key];
            return data && data.count === null;
        });
        return anyLoading
            ? keys
            : keys.filter((key) => interactionDataMap[key] && interactionDataMap[key].count > 0);
    }, [interactionDataMap]);

    // Adjust activeTab if it is no longer in the list.
    useEffect(() => {
        if (computedAvailableTabs.length > 0 && !computedAvailableTabs.includes(activeTab)) {
            setActiveTab(computedAvailableTabs[0]);
        }
    }, [computedAvailableTabs, activeTab]);

    // Mapping of interaction types to their dispatch functions.
    const dispatchFunctions = useMemo(() => ({
        generic: getGenericInteractions,
        drag: getDragInteractions,
        keyboard: getKeyboardInteractions,
        mouse: getMouseInteractions,
        touch: getTouchInteractions,
    }), []);

    // Create stable fetch callbacks for each interaction type.
    const fetchCallbacks = useMemo(() => {
        return {
            generic: (params) =>
                dispatch(dispatchFunctions.generic({ studyId: study_id, ...params })),
            drag: (params) =>
                dispatch(dispatchFunctions.drag({ studyId: study_id, ...params })),
            keyboard: (params) =>
                dispatch(dispatchFunctions.keyboard({ studyId: study_id, ...params })),
            mouse: (params) =>
                dispatch(dispatchFunctions.mouse({ studyId: study_id, ...params })),
            touch: (params) =>
                dispatch(dispatchFunctions.touch({ studyId: study_id, ...params })),
        };
    }, [dispatch, study_id, dispatchFunctions]);

    // Export handlers.
    const handleExportData = () => {
        setExportModalOpen(true);
        setAutoTriggered(false);
        dispatch(getInteractionExport({ studyId: study_id }));
    };


    // If API calls have completed for all tabs (none are loading)
    // and no tab has any data, show an alert.
    const allLoaded = useMemo(() => {
        return Object.keys(interactionDataMap).every(
            (key) => interactionDataMap[key] && interactionDataMap[key].count !== null
        );
    }, [interactionDataMap]);

    const noDataAvailable = allLoaded && Object.keys(interactionDataMap).every(
        (key) => interactionDataMap[key].count === 0
    );

    // ---- Dashboard metrics ----
    const countsLoaded = Object.values(interactionDataMap).every((d) => d && d.count !== null);
    const eventsLogged = Object.values(interactionDataMap).reduce((sum, d) => sum + (d && d.count ? d.count : 0), 0);
    const totalP = study ? study.total_participants : null;
    const doneP = study ? study.done_participants : null;
    const completion = (totalP != null && totalP > 0 && doneP != null) ? Math.round((doneP / totalP) * 100) : null;
    const fmt = (v) => (v == null ? "—" : v.toLocaleString());

    return (
        <div>
            <Row className="g-3 mb-4">
                <Col xs={6} lg={3}>
                    <StatCard label="Participants" value={fmt(totalP)} sub={doneP != null ? `${fmt(doneP)} completed` : undefined} />
                </Col>
                <Col xs={6} lg={3}>
                    <StatCard label="Events logged" value={countsLoaded ? fmt(eventsLogged) : "…"} />
                </Col>
                <Col xs={6} lg={3}>
                    <StatCard label="Conditions" value={fmt(conditionsCount)} />
                </Col>
                <Col xs={6} lg={3}>
                    <StatCard label="Completion rate" value={completion == null ? "—" : completion + "%"} />
                </Col>
            </Row>

            <Card className="mb-4">
                <Card.Header>Events logged over time</Card.Header>
                <Card.Body>
                    {timeline == null ? (
                        <div className="text-muted small py-4 text-center">Loading…</div>
                    ) : timeline.length === 0 ? (
                        <div className="text-muted small py-4 text-center">No events logged yet.</div>
                    ) : timeline.length < MIN_DAYS_FOR_CHART ? (
                        <div className="alert alert-info mb-0 small">
                            Not enough data to plot a timeline yet — events so far span only a
                            single day{eventsLogged ? ` (${fmt(eventsLogged)} logged)` : ""}. The
                            chart will appear once events have been logged across more than one day.
                        </div>
                    ) : (
                        <EventsChart timeline={timeline} />
                    )}
                </Card.Body>
            </Card>

            <div className="mb-3">
                <Button variant="primary" onClick={handleExportData}>
                    Export Data
                </Button>
            </div>

            {noDataAvailable ? (
                <div className="alert alert-info">
                    No data available for this study.
                </div>
            ) : (
                <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} id="data-tabs" className="mb-3">
                    {computedAvailableTabs.map((tabKey, index) => {
                        const tabData = interactionDataMap[tabKey];
                        // Build column definitions dynamically from the first row of data if available.
                        const columns =
                            tabData.items &&
                                Array.isArray(tabData.items) &&
                                tabData.items.length > 0
                                ? Object.keys(tabData.items[0]).map((col) => ({
                                    key: col,
                                    label: col.charAt(0).toUpperCase() + col.slice(1),
                                    render: (value) =>
                                        typeof value === "object" && value !== null ? (
                                            <NestedTable data={value} />
                                        ) : value !== undefined ? (
                                            value
                                        ) : (
                                            ""
                                        ),
                                }))
                                : [];
                        // Use the stable fetch callback.
                        const fetchData = fetchCallbacks[tabKey];
                        return (
                            <Tab
                                eventKey={tabKey}
                                title={tabKey.charAt(0).toUpperCase() + tabKey.slice(1)}
                                key={index}
                            >
                                <PaginatedSortableTable
                                    columns={columns}
                                    fetchData={fetchData}
                                    data={tabData.items ?? []}
                                    totalCount={tabData.count ?? 0}
                                    loading={apiStatus === LOADING}
                                    initialItemsPerPage={50}
                                    initialSortColumn="id"
                                    initialSortDirection="asc"
                                    loadingText={"Loading Interaction Data (" + tabKey + ") ..."}
                                />
                            </Tab>
                        );
                    })}
                </Tabs>
            )}

            <Modal show={exportModalOpen} onHide={() => setExportModalOpen(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Export Data</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ minHeight: "100px" }}>
                    {exportData.status === LOADING ? (
                        <LoadingScreen text={"Creating Export File..."} />
                    ) : (
                        <p>
                            Export is ready. The file has been prepared for download. Click "Export" to manually save the file if the automatic save dialog did not open.
                        </p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setExportModalOpen(false)}>
                        Cancel
                    </Button>
                    {exportData.status !== LOADING && (
                        <Button variant="primary" onClick={triggerSaveBlob}>
                            Export
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </div>
    );
}

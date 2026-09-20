import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router";
import { useDispatch } from "react-redux";
import { Button, Card, Row, Col, Form, ListGroup, Badge, Dropdown } from "react-bootstrap";
import { Trash, PlusLg, ArrowUp, ArrowDown } from "react-bootstrap-icons";

import {
    apiWithAuth,
    getStudyFormsApi,
    getGlobalFormsApi,
    getFormTemplatesApi,
    getFormApi,
    createFormApi,
    createFormFromTemplateApi,
    updateFormApi,
    deleteFormApi,
} from "../../api/studyAlignApi";

const uid = (p) => p + "_" + Math.random().toString(36).slice(2, 8);

const ITEM_TYPES = [
    { type: "display", label: "Description text" },
    { type: "text", label: "Text answer" },
    { type: "number", label: "Number" },
    { type: "slider", label: "Slider (VAS / continuous)" },
    { type: "choice", label: "Choice" },
    { type: "scale", label: "Scale / Likert / matrix" },
];

const emptyDefinition = () => ({
    settings: { allow_back: true, show_progress: true, randomize_pages: false },
    pages: [{ id: uid("p"), title: "", randomize_items: false, items: [] }],
});

function newItem(type) {
    const base = { id: uid("i"), type };
    switch (type) {
        case "display":
            return { ...base, html: "" };
        case "text":
            return { ...base, key: uid("q"), label: "", required: false, config: { multiline: false } };
        case "number":
            return { ...base, key: uid("q"), label: "", required: false, config: { min: null, max: null, step: 1 } };
        case "slider":
            return { ...base, key: uid("q"), label: "", required: false, config: { min: 0, max: 100, step: 1, left: "", right: "" } };
        case "choice":
            return {
                ...base, key: uid("q"), label: "", required: false,
                config: { multiple: false, render: "radio", options: [{ value: uid("opt"), label: "" }] },
            };
        case "scale":
            return {
                ...base, key: uid("q"), label: "", required: false,
                config: {
                    bipolar: false, randomize_rows: false,
                    points: [
                        { value: 1, label: "Strongly disagree" }, { value: 2, label: "" },
                        { value: 3, label: "Neutral" }, { value: 4, label: "" },
                        { value: 5, label: "Strongly agree" },
                    ],
                    rows: [{ key: uid("row"), text: "" }],
                },
            };
        default:
            return base;
    }
}

export default function Questionnaires({ isGlobal = false }) {
    const { study_id } = useParams();
    const dispatch = useDispatch();

    const [forms, setForms] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [name, setName] = useState("");
    const [definition, setDefinition] = useState(null);
    const [status, setStatus] = useState("");

    const loadForms = useCallback(() => {
        const p = isGlobal
            ? apiWithAuth(getGlobalFormsApi, {}, dispatch)
            : apiWithAuth(getStudyFormsApi, study_id, dispatch);
        p.then((res) => setForms(res.body || [])).catch(() => setForms([]));
    }, [isGlobal, study_id, dispatch]);

    useEffect(() => {
        loadForms();
        apiWithAuth(getFormTemplatesApi, {}, dispatch)
            .then((res) => setTemplates(res.body || []))
            .catch(() => setTemplates([]));
    }, [loadForms, dispatch]);

    const selectForm = (id) => {
        apiWithAuth(getFormApi, id, dispatch).then((res) => {
            const f = res.body;
            setSelectedId(f.id);
            setName(f.name || "");
            setDefinition(f.definition && f.definition.pages ? f.definition : emptyDefinition());
            setStatus("");
        });
    };

    const createBlank = () => {
        const payload = isGlobal
            ? { name: "New questionnaire", definition: emptyDefinition() }
            : { name: "New questionnaire", study_id: parseInt(study_id, 10), definition: emptyDefinition() };
        apiWithAuth(createFormApi, payload, dispatch)
            .then((res) => { loadForms(); selectForm(res.body.id); });
    };

    const applyTemplate = (templateId) => {
        if (isGlobal) {
            // No study to copy into: clone the template's definition into a new
            // global questionnaire on the client.
            apiWithAuth(getFormApi, templateId, dispatch).then((res) => {
                const t = res.body;
                apiWithAuth(createFormApi, { name: t.name, definition: t.definition }, dispatch)
                    .then((r) => { loadForms(); selectForm(r.body.id); });
            });
            return;
        }
        apiWithAuth(createFormFromTemplateApi, { templateId, studyId: parseInt(study_id, 10) }, dispatch)
            .then((res) => { loadForms(); selectForm(res.body.id); });
    };

    const removeForm = (id) => {
        apiWithAuth(deleteFormApi, id, dispatch).then(() => {
            if (id === selectedId) { setSelectedId(null); setDefinition(null); }
            loadForms();
        }).catch(() => setStatus("Could not delete (is the study running?)."));
    };

    const save = () => {
        apiWithAuth(updateFormApi, { formId: selectedId, patch: { name, definition } }, dispatch)
            .then(() => { setStatus("Saved."); loadForms(); })
            .catch(() => setStatus("Save failed (is the study running?)."));
    };

    // Immutable edit helper.
    const mutate = (fn) => setDefinition((prev) => { const d = JSON.parse(JSON.stringify(prev)); fn(d); return d; });

    const setSetting = (k, v) => mutate((d) => { d.settings[k] = v; });
    const addPage = () => mutate((d) => d.pages.push({ id: uid("p"), title: "", randomize_items: false, items: [] }));
    const removePage = (pi) => mutate((d) => d.pages.splice(pi, 1));
    const setPage = (pi, patch) => mutate((d) => Object.assign(d.pages[pi], patch));
    const addItem = (pi, type) => mutate((d) => d.pages[pi].items.push(newItem(type)));
    const removeItem = (pi, ii) => mutate((d) => d.pages[pi].items.splice(ii, 1));
    const setItem = (pi, ii, patch) => mutate((d) => Object.assign(d.pages[pi].items[ii], patch));
    const setItemConfig = (pi, ii, patch) => mutate((d) => Object.assign(d.pages[pi].items[ii].config, patch));
    const moveItem = (pi, ii, dir) => mutate((d) => {
        const items = d.pages[pi].items; const j = ii + dir;
        if (j < 0 || j >= items.length) return;
        [items[ii], items[j]] = [items[j], items[ii]];
    });

    return (
        <div>
            <Row className="mb-3">
                <Col>
                    <Button size="sm" onClick={createBlank}><PlusLg /> New questionnaire</Button>{" "}
                    <Dropdown className="d-inline">
                        <Dropdown.Toggle size="sm" variant="outline-secondary">Use template</Dropdown.Toggle>
                        <Dropdown.Menu>
                            {templates.map((t) => (
                                <Dropdown.Item key={t.id} onClick={() => applyTemplate(t.id)}>{t.name}</Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
            </Row>

            <Row>
                <Col md={4} lg={3}>
                    <ListGroup className="mb-3">
                        {forms.length === 0 && <ListGroup.Item className="text-muted small">No questionnaires yet.</ListGroup.Item>}
                        {forms.map((f) => (
                            <ListGroup.Item key={f.id} active={f.id === selectedId} action onClick={() => selectForm(f.id)}
                                className="d-flex justify-content-between align-items-center">
                                <span>{f.name}</span>
                                <Trash role="button" onClick={(e) => { e.stopPropagation(); removeForm(f.id); }} />
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>

                <Col md={8} lg={9}>
                    {definition == null ? (
                        <div className="text-muted">Select or create a questionnaire to edit it.</div>
                    ) : (
                        <>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <Form.Control style={{ maxWidth: 360 }} value={name} onChange={(e) => setName(e.target.value)} />
                                <div>
                                    {status && <span className="me-2 small text-muted">{status}</span>}
                                    <Button size="sm" onClick={save}>Save</Button>
                                </div>
                            </div>

                            <Card className="mb-3">
                                <Card.Body className="d-flex gap-4 flex-wrap">
                                    <Form.Check type="checkbox" label="Allow going back"
                                        checked={!!definition.settings.allow_back}
                                        onChange={(e) => setSetting("allow_back", e.target.checked)} />
                                    <Form.Check type="checkbox" label="Show progress bar"
                                        checked={!!definition.settings.show_progress}
                                        onChange={(e) => setSetting("show_progress", e.target.checked)} />
                                    <Form.Check type="checkbox" label="Randomize page order"
                                        checked={!!definition.settings.randomize_pages}
                                        onChange={(e) => setSetting("randomize_pages", e.target.checked)} />
                                </Card.Body>
                            </Card>

                            {definition.pages.map((page, pi) => (
                                <Card key={page.id} className="mb-3">
                                    <Card.Header className="d-flex justify-content-between align-items-center">
                                        <span>Page {pi + 1}</span>
                                        <Form.Check type="checkbox" label="Randomize item order"
                                            checked={!!page.randomize_items}
                                            onChange={(e) => setPage(pi, { randomize_items: e.target.checked })} />
                                        {definition.pages.length > 1 &&
                                            <Trash role="button" onClick={() => removePage(pi)} />}
                                    </Card.Header>
                                    <Card.Body>
                                        <Form.Control className="mb-3" placeholder="Section title (optional)"
                                            value={page.title || ""} onChange={(e) => setPage(pi, { title: e.target.value })} />

                                        {page.items.map((item, ii) => (
                                            <Card key={item.id} className="mb-2">
                                                <Card.Body>
                                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                                        <Badge bg="secondary">{item.type}</Badge>
                                                        <div className="d-flex gap-2 align-items-center">
                                                            {item.type !== "display" &&
                                                                <Form.Check type="checkbox" label="Required"
                                                                    checked={!!item.required}
                                                                    onChange={(e) => setItem(pi, ii, { required: e.target.checked })} />}
                                                            <ArrowUp role="button" onClick={() => moveItem(pi, ii, -1)} />
                                                            <ArrowDown role="button" onClick={() => moveItem(pi, ii, 1)} />
                                                            <Trash role="button" onClick={() => removeItem(pi, ii)} />
                                                        </div>
                                                    </div>
                                                    <ItemEditor item={item}
                                                        setItem={(patch) => setItem(pi, ii, patch)}
                                                        setConfig={(patch) => setItemConfig(pi, ii, patch)}
                                                        mutate={mutate} pi={pi} ii={ii} />
                                                </Card.Body>
                                            </Card>
                                        ))}

                                        <Dropdown>
                                            <Dropdown.Toggle size="sm" variant="outline-secondary"><PlusLg /> Add item</Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                {ITEM_TYPES.map((t) => (
                                                    <Dropdown.Item key={t.type} onClick={() => addItem(pi, t.type)}>{t.label}</Dropdown.Item>
                                                ))}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </Card.Body>
                                </Card>
                            ))}

                            <Button size="sm" variant="outline-secondary" onClick={addPage}><PlusLg /> Add page</Button>

                            <div className="d-flex justify-content-end align-items-center mt-4">
                                {status && <span className="me-2 small text-muted">{status}</span>}
                                <Button onClick={save}>Save</Button>
                            </div>
                        </>
                    )}
                </Col>
            </Row>
        </div>
    );
}

// Per-type item configuration editor.
function ItemEditor({ item, setItem, setConfig, mutate, pi, ii }) {
    const cfg = item.config || {};

    if (item.type === "display") {
        return (
            <Form.Control as="textarea" rows={2} value={item.html || ""}
                onChange={(e) => setItem({ html: e.target.value })} placeholder="HTML description" />
        );
    }

    const labelKey = (
        <Row className="mb-2">
            <Col><Form.Control placeholder="Label / question" value={item.label || ""} onChange={(e) => setItem({ label: e.target.value })} /></Col>
            <Col md={4}><Form.Control placeholder="key" value={item.key || ""} onChange={(e) => setItem({ key: e.target.value })} /></Col>
        </Row>
    );

    if (item.type === "text") {
        return (<>{labelKey}
            <Form.Check type="checkbox" label="Multi-line" checked={!!cfg.multiline}
                onChange={(e) => setConfig({ multiline: e.target.checked })} />
        </>);
    }

    if (item.type === "number") {
        return (<>{labelKey}
            <Row>
                <Col><Form.Control type="number" placeholder="min" value={cfg.min ?? ""} onChange={(e) => setConfig({ min: e.target.value === "" ? null : Number(e.target.value) })} /></Col>
                <Col><Form.Control type="number" placeholder="max" value={cfg.max ?? ""} onChange={(e) => setConfig({ max: e.target.value === "" ? null : Number(e.target.value) })} /></Col>
                <Col><Form.Control type="number" placeholder="step" value={cfg.step ?? 1} onChange={(e) => setConfig({ step: Number(e.target.value) })} /></Col>
            </Row>
        </>);
    }

    if (item.type === "slider") {
        return (<>{labelKey}
            <Row className="mb-2">
                <Col><Form.Control type="number" placeholder="min" value={cfg.min ?? 0} onChange={(e) => setConfig({ min: Number(e.target.value) })} /></Col>
                <Col><Form.Control type="number" placeholder="max" value={cfg.max ?? 100} onChange={(e) => setConfig({ max: Number(e.target.value) })} /></Col>
                <Col><Form.Control type="number" placeholder="step" value={cfg.step ?? 1} onChange={(e) => setConfig({ step: Number(e.target.value) })} /></Col>
            </Row>
            <Row>
                <Col><Form.Control size="sm" placeholder="left anchor label (optional)" value={cfg.left || ""} onChange={(e) => setConfig({ left: e.target.value })} /></Col>
                <Col><Form.Control size="sm" placeholder="right anchor label (optional)" value={cfg.right || ""} onChange={(e) => setConfig({ right: e.target.value })} /></Col>
            </Row>
        </>);
    }

    if (item.type === "choice") {
        const options = cfg.options || [];
        return (<>{labelKey}
            <Row className="mb-2">
                <Col md={5}>
                    <Form.Select value={cfg.render || "radio"} onChange={(e) => setConfig({ render: e.target.value })}>
                        <option value="radio">Radio</option>
                        <option value="checkbox">Checkboxes</option>
                        <option value="dropdown">Dropdown</option>
                    </Form.Select>
                </Col>
                <Col>
                    <Form.Check type="checkbox" label="Allow multiple" checked={!!cfg.multiple}
                        onChange={(e) => setConfig({ multiple: e.target.checked })} />
                </Col>
            </Row>
            {options.map((opt, oi) => (
                <Row key={oi} className="mb-1">
                    <Col><Form.Control size="sm" placeholder="value" value={opt.value}
                        onChange={(e) => mutate((d) => { d.pages[pi].items[ii].config.options[oi].value = e.target.value; })} /></Col>
                    <Col><Form.Control size="sm" placeholder="label" value={opt.label}
                        onChange={(e) => mutate((d) => { d.pages[pi].items[ii].config.options[oi].label = e.target.value; })} /></Col>
                    <Col xs="auto"><Trash role="button" onClick={() => mutate((d) => d.pages[pi].items[ii].config.options.splice(oi, 1))} /></Col>
                </Row>
            ))}
            <Button size="sm" variant="link" className="px-0"
                onClick={() => mutate((d) => d.pages[pi].items[ii].config.options.push({ value: uid("opt"), label: "" }))}>
                Add option
            </Button>
        </>);
    }

    if (item.type === "scale") {
        const points = cfg.points || [];
        const rows = cfg.rows || [];
        return (<>{labelKey}
            <Form.Check className="mb-2" type="checkbox" label="Bipolar (semantic differential: each row has a left/right anchor)"
                checked={!!cfg.bipolar} onChange={(e) => setConfig({ bipolar: e.target.checked })} />
            <Form.Check className="mb-2" type="checkbox" label="Randomize row order"
                checked={!!cfg.randomize_rows} onChange={(e) => setConfig({ randomize_rows: e.target.checked })} />

            <div className="small text-muted mb-1">Scale points</div>
            {points.map((p, xi) => (
                <Row key={xi} className="mb-1">
                    <Col xs={3}><Form.Control size="sm" type="number" value={p.value}
                        onChange={(e) => mutate((d) => { d.pages[pi].items[ii].config.points[xi].value = Number(e.target.value); })} /></Col>
                    <Col><Form.Control size="sm" placeholder="label (optional)" value={p.label || ""}
                        onChange={(e) => mutate((d) => { d.pages[pi].items[ii].config.points[xi].label = e.target.value; })} /></Col>
                    <Col xs="auto"><Trash role="button" onClick={() => mutate((d) => d.pages[pi].items[ii].config.points.splice(xi, 1))} /></Col>
                </Row>
            ))}
            <Button size="sm" variant="link" className="px-0 d-block mb-2"
                onClick={() => mutate((d) => d.pages[pi].items[ii].config.points.push({ value: points.length + 1, label: "" }))}>
                Add point
            </Button>

            <div className="small text-muted mb-1">Rows</div>
            {rows.map((r, ri) => (
                <Row key={ri} className="mb-1">
                    <Col xs={3}><Form.Control size="sm" placeholder="key" value={r.key}
                        onChange={(e) => mutate((d) => { d.pages[pi].items[ii].config.rows[ri].key = e.target.value; })} /></Col>
                    {cfg.bipolar ? (<>
                        <Col><Form.Control size="sm" placeholder="left anchor" value={r.left || ""}
                            onChange={(e) => mutate((d) => { d.pages[pi].items[ii].config.rows[ri].left = e.target.value; })} /></Col>
                        <Col><Form.Control size="sm" placeholder="right anchor" value={r.right || ""}
                            onChange={(e) => mutate((d) => { d.pages[pi].items[ii].config.rows[ri].right = e.target.value; })} /></Col>
                    </>) : (
                        <Col><Form.Control size="sm" placeholder="statement" value={r.text || ""}
                            onChange={(e) => mutate((d) => { d.pages[pi].items[ii].config.rows[ri].text = e.target.value; })} /></Col>
                    )}
                    <Col xs="auto"><Trash role="button" onClick={() => mutate((d) => d.pages[pi].items[ii].config.rows.splice(ri, 1))} /></Col>
                </Row>
            ))}
            <Button size="sm" variant="link" className="px-0"
                onClick={() => mutate((d) => d.pages[pi].items[ii].config.rows.push({ key: uid("row"), text: "", left: "", right: "" }))}>
                Add row
            </Button>
        </>);
    }

    return null;
}

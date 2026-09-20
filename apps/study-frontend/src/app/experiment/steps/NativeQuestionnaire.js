import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Form, ProgressBar, Alert } from "react-bootstrap";

import { useAuth } from "../../../components/Auth";
import { procedureSlice } from "../../../redux/reducers/procedureSlice";
import { getFormForParticipantApi, saveFormResponseApi } from "../../../api/studyAlignApi";

// Deterministic shuffle so a participant sees the same randomized order across
// refreshes (seeded by their token plus a scope id).
function seededShuffle(arr, seedStr) {
    let seed = 0;
    for (let i = 0; i < seedStr.length; i++) seed = (seed * 31 + seedStr.charCodeAt(i)) >>> 0;
    const rng = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const isEmpty = (v) => v === undefined || v === null || v === "" ||
    (Array.isArray(v) && v.length === 0);

export default function NativeQuestionnaire({ formId, height }) {
    const dispatch = useDispatch();
    const auth = useAuth();
    const token = auth && auth.participant ? auth.participant.token : "";

    const [definition, setDefinition] = useState(null);
    const [answers, setAnswers] = useState({});
    const [pageIndex, setPageIndex] = useState(0);
    const [missing, setMissing] = useState([]);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const saveTimer = useRef(null);

    useEffect(() => {
        getFormForParticipantApi(formId)
            .then((res) => {
                const body = res.body || {};
                setDefinition((body.form && body.form.definition) || { pages: [], settings: {} });
                setAnswers((body.response && body.response.answers) || {});
                // If already submitted (e.g. after a refresh), keep it submitted
                // and leave the Next button enabled.
                if (body.response && body.response.submitted) {
                    setSubmitted(true);
                    dispatch(procedureSlice.actions.enableNext());
                }
            })
            .catch(() => setError("Could not load the questionnaire."));
        return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
    }, [formId, dispatch]);

    const autosave = (next) => {
        if (saveTimer.current) clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(() => {
            saveFormResponseApi(formId, next, false).catch(() => {});
        }, 800);
    };

    const setAnswer = (key, value) => {
        setAnswers((prev) => {
            const next = { ...prev, [key]: value };
            autosave(next);
            return next;
        });
    };

    if (error) return <Alert variant="danger" className="m-3">{error}</Alert>;
    if (!definition) return <div className="p-3 text-muted">Loading questionnaire...</div>;

    const settings = definition.settings || {};
    let pages = definition.pages || [];
    if (settings.randomize_pages) pages = seededShuffle(pages, token + ":pages");
    const page = pages[pageIndex] || { items: [] };

    let items = page.items || [];
    if (page.randomize_items) items = seededShuffle(items, token + ":" + page.id);

    // Required keys on the current page (scales expand to their row keys).
    const pageRequiredKeys = () => {
        const keys = [];
        items.forEach((item) => {
            if (!item.required || item.type === "display") return;
            if (item.type === "scale") {
                (item.config?.rows || []).forEach((r) => keys.push(r.key));
            } else if (item.key) {
                keys.push(item.key);
            }
        });
        return keys;
    };

    const validatePage = () => {
        const miss = pageRequiredKeys().filter((k) => isEmpty(answers[k]));
        setMissing(miss);
        return miss.length === 0;
    };

    const isLastPage = pageIndex >= pages.length - 1;

    const goNext = async () => {
        if (submitted || submitting) return;
        if (!validatePage()) return;
        if (!isLastPage) { setPageIndex((i) => i + 1); window.scrollTo(0, 0); return; }
        // Final submit: server re-validates required across the whole form. We do
        // not advance here; instead we mark the response submitted and enable the
        // navigator's Next button so the participant proceeds like any other step.
        setError("");
        setSubmitting(true);
        try {
            await saveFormResponseApi(formId, answers, true);
            setSubmitted(true);
            dispatch(procedureSlice.actions.enableNext());
        } catch (err) {
            if (err && err.status === 422) {
                setError("Some required answers are missing. Please review the questionnaire.");
            } else {
                setError("Could not submit. Please try again.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    const goBack = () => { setPageIndex((i) => Math.max(0, i - 1)); window.scrollTo(0, 0); };

    return (
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "24px 16px", minHeight: height }}>
            {settings.show_progress && pages.length > 1 && (
                <ProgressBar className="mb-4" now={((pageIndex + 1) / pages.length) * 100}
                    label={`${pageIndex + 1} / ${pages.length}`} />
            )}
            {page.title && <h4 className="mb-3">{page.title}</h4>}

            {items.map((item) => (
                <div key={item.id} className="mb-4">
                    <Item item={item} answers={answers} setAnswer={setAnswer}
                        token={token} invalid={missing} />
                </div>
            ))}

            {missing.length > 0 && (
                <Alert variant="warning" className="py-2">Please answer the required questions.</Alert>
            )}

            <div className="d-flex justify-content-between align-items-center mt-3">
                {settings.allow_back && pageIndex > 0 && !submitted
                    ? <Button variant="outline-secondary" onClick={goBack}>Back</Button>
                    : <span />}
                <Button onClick={goNext} disabled={isLastPage && (submitting || submitted)}>
                    {isLastPage
                        ? (submitted ? "Submitted" : (submitting ? "Submitting…" : "Submit"))
                        : "Next"}
                </Button>
            </div>
            {submitted && (
                <div className="text-success small mt-2 text-end">
                    Your answers were submitted. Please click Next below to continue.
                </div>
            )}
        </div>
    );
}

function Item({ item, answers, setAnswer, token, invalid }) {
    const cfg = item.config || {};
    const val = answers[item.key];
    const isInvalid = (k) => invalid.includes(k);

    if (item.type === "display") {
        return <div dangerouslySetInnerHTML={{ __html: item.html || "" }} />;
    }

    const label = item.label && (
        <Form.Label className="fw-semibold">{item.label}{item.required && " *"}</Form.Label>
    );

    if (item.type === "text") {
        return (<Form.Group>{label}
            <Form.Control as={cfg.multiline ? "textarea" : "input"} rows={cfg.multiline ? 3 : undefined}
                value={val || ""} isInvalid={isInvalid(item.key)}
                onChange={(e) => setAnswer(item.key, e.target.value)} />
        </Form.Group>);
    }

    if (item.type === "number") {
        return (<Form.Group>{label}
            <Form.Control type="number" min={cfg.min ?? undefined} max={cfg.max ?? undefined} step={cfg.step ?? 1}
                value={val ?? ""} isInvalid={isInvalid(item.key)}
                onChange={(e) => setAnswer(item.key, e.target.value === "" ? "" : Number(e.target.value))} />
        </Form.Group>);
    }

    if (item.type === "slider") {
        const min = cfg.min ?? 0, max = cfg.max ?? 100, step = cfg.step ?? 1;
        const current = val ?? "";
        return (<Form.Group>{label}
            <div className="d-flex align-items-center gap-2">
                <small className="text-muted" style={{ minWidth: 80 }}>{cfg.left || min}</small>
                <Form.Range min={min} max={max} step={step}
                    value={current === "" ? (min + max) / 2 : current}
                    onChange={(e) => setAnswer(item.key, Number(e.target.value))} />
                <small className="text-muted text-end" style={{ minWidth: 80 }}>{cfg.right || max}</small>
                <span className="ms-2" style={{ minWidth: 32 }}>{current === "" ? "-" : current}</span>
            </div>
        </Form.Group>);
    }

    if (item.type === "choice") {
        const options = cfg.options || [];
        if (cfg.render === "dropdown") {
            return (<Form.Group>{label}
                <Form.Select value={val || ""} isInvalid={isInvalid(item.key)}
                    onChange={(e) => setAnswer(item.key, e.target.value)}>
                    <option value="">-- select --</option>
                    {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </Form.Select>
            </Form.Group>);
        }
        const multiple = !!cfg.multiple;
        const arr = Array.isArray(val) ? val : [];
        return (<Form.Group>{label}
            {options.map((o) => (
                <Form.Check key={o.value} type={multiple ? "checkbox" : "radio"} name={item.id}
                    id={item.id + "_" + o.value} label={o.label}
                    checked={multiple ? arr.includes(o.value) : val === o.value}
                    onChange={() => {
                        if (multiple) {
                            setAnswer(item.key, arr.includes(o.value) ? arr.filter((x) => x !== o.value) : [...arr, o.value]);
                        } else {
                            setAnswer(item.key, o.value);
                        }
                    }} />
            ))}
        </Form.Group>);
    }

    if (item.type === "scale") {
        const points = cfg.points || [];
        let rows = cfg.rows || [];
        if (cfg.randomize_rows) rows = seededShuffle(rows, token + ":" + item.id);
        return (<div>
            {label}
            <div style={{ overflowX: "auto" }}>
                <table className="table table-sm align-middle">
                    <thead>
                        <tr>
                            <th />
                            {cfg.bipolar && <th />}
                            {points.map((p) => <th key={p.value} className="text-center small">{p.label || p.value}</th>)}
                            {cfg.bipolar && <th />}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r) => (
                            <tr key={r.key} className={isInvalid(r.key) ? "table-warning" : ""}>
                                <td className="small">{!cfg.bipolar && r.text}</td>
                                {cfg.bipolar && <td className="small text-end text-muted">{r.left}</td>}
                                {points.map((p) => (
                                    <td key={p.value} className="text-center">
                                        <input type="radio" name={r.key} checked={answers[r.key] === p.value}
                                            onChange={() => setAnswer(r.key, p.value)} />
                                    </td>
                                ))}
                                {cfg.bipolar && <td className="small text-muted">{r.right}</td>}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>);
    }

    return null;
}

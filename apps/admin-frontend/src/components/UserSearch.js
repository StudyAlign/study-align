import React, { useState, useEffect, useRef } from "react";
import { Form, ListGroup, Badge } from "react-bootstrap";
import { PersonPlus } from "react-bootstrap-icons";

import { getUsersApi } from "../api/studyAlignApi";
import { userLabel } from "./CommonFunctions";

import "./UserSearch.css";

/**
 * Reusable, self-contained user search with a live results dropdown.
 * Typing debounces a `/users?search=` query and renders matches in a
 * dropdown; picking one calls `onSelect(user)`. Ids in `excludeIds` are
 * shown but disabled (e.g. users already added / invited).
 */
export default function UserSearch({
    onSelect,
    excludeIds = [],
    excludeLabel = "added",
    placeholder = "Search by name or email",
    limit = 8,
    autoFocus = false,
}) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const boxRef = useRef(null);

    // Debounced search whenever the query changes.
    useEffect(() => {
        const term = query.trim();
        if (!term) { setResults(null); setLoading(false); return; }
        setLoading(true);
        const handle = setTimeout(() => {
            getUsersApi({ offset: 0, limit, orderBy: "name", direction: "asc", search: term })
                .then((r) => { setResults(r.body || []); setOpen(true); })
                .catch(() => setResults([]))
                .finally(() => setLoading(false));
        }, 250);
        return () => clearTimeout(handle);
    }, [query, limit]);

    // Close the dropdown when clicking outside the component.
    useEffect(() => {
        const onDocClick = (e) => {
            if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, []);

    const pick = (u) => {
        onSelect(u);
        setQuery("");
        setResults(null);
        setOpen(false);
    };

    return (
        <div className="user-search" ref={boxRef}>
            <Form.Control
                type="text"
                autoFocus={autoFocus}
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => { if (results !== null) setOpen(true); }}
            />
            {open && results !== null && (
                <ListGroup className="user-search-menu shadow-sm">
                    {loading && (
                        <ListGroup.Item className="text-muted">Searching…</ListGroup.Item>
                    )}
                    {!loading && results.length === 0 && (
                        <ListGroup.Item className="text-muted">No users found.</ListGroup.Item>
                    )}
                    {results.map((u) => {
                        const excluded = excludeIds.includes(u.id);
                        return (
                            <ListGroup.Item
                                key={u.id}
                                action={!excluded}
                                disabled={excluded}
                                onClick={excluded ? undefined : () => pick(u)}
                                className="d-flex justify-content-between align-items-center"
                            >
                                <span>{userLabel(u)}</span>
                                {excluded
                                    ? <Badge bg="secondary">{excludeLabel}</Badge>
                                    : <PersonPlus className="text-primary" />}
                            </ListGroup.Item>
                        );
                    })}
                </ListGroup>
            )}
        </div>
    );
}

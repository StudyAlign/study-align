import React, { useState, useEffect } from "react";
import { Image } from "react-bootstrap";

import { getGroupLogoUrl } from "../../api/studyAlignApi";

import "./GroupLogo.css";

/**
 * Group logo with an initials fallback: renders the uploaded PNG when it
 * exists, otherwise a rounded badge with the group's first letter, so the
 * list always shows something before the group name.
 */
export default function GroupLogo({ groupId, name, size = 40, version, className = "" }) {
    const [failed, setFailed] = useState(false);

    // A new version (cache-bust) means a fresh upload/delete: try the image again.
    useEffect(() => { setFailed(false); }, [version, groupId]);

    const initial = (name || "?").trim().charAt(0).toUpperCase() || "?";

    if (failed) {
        return (
            <div
                className={`group-logo-fallback ${className}`}
                style={{ width: size, height: size, fontSize: Math.round(size * 0.42) }}
                aria-hidden="true"
            >
                {initial}
            </div>
        );
    }

    const src = getGroupLogoUrl(groupId) + (version != null ? "?v=" + version : "");
    return (
        <Image
            src={src}
            rounded
            width={size}
            height={size}
            className={className}
            style={{ objectFit: "cover" }}
            onError={() => setFailed(true)}
        />
    );
}

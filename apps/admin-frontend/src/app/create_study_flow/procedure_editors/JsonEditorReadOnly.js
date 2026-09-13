import React, { useState, useEffect } from 'react';
import JsonCodeEditor from './JsonCodeEditor';

import './Editors.scss';

const JsonEditorReadOnly = ({ value, readOnly = true }) => {
    const [editorValue, setEditorValue] = useState(value)

    useEffect(() => {
        setEditorValue(value)
    }, [value])

    return (
        <div
            className={`json-editor-wrapper ${readOnly ? 'read-only' : ''}`}
        >
            <JsonCodeEditor
                value={editorValue}
                theme="idea"
                height="200px"
                readOnly={readOnly}
            />
        </div>
    )
}

export default JsonEditorReadOnly;

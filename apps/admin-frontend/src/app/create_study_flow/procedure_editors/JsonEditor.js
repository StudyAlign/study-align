import React, { useState, useEffect } from 'react';
import JsonCodeEditor from './JsonCodeEditor';

import './Editors.scss';

const JsonEditor = ({ id, value, onChange, readOnly = false }) => {
    const [editorValue, setEditorValue] = useState(value)

    useEffect(() => {
        setEditorValue(value)
    }, [value])

    const handleEditorChange = (newValue) => {
        setEditorValue(newValue)
        onChange(id, newValue)
    }

    return (
        <div
            className={`json-editor-wrapper ${readOnly ? 'read-only' : ''}`}
        >
            <JsonCodeEditor
                value={editorValue}
                theme="idea"
                height="200px"
                readOnly={readOnly}
                onChange={handleEditorChange}
            />
        </div>
    )
}

export default JsonEditor;

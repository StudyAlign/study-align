import React from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';

// CodeMirror 5 core + JSON highlighting (javascript mode with json:true),
// two bundled themes, and the placeholder addon.
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/display/placeholder';
import 'codemirror/theme/idea.css';
import 'codemirror/theme/material.css';

/**
 * Lean JSON editor backed by react-codemirror2 + CodeMirror 5 (CJS — avoids the
 * react/jsx-runtime ESM resolution issue of the previous @uiw/react-codemirror).
 *
 * Props:
 *   value       string
 *   onChange    (newValue: string) => void   (omitted / ignored when readOnly)
 *   readOnly    boolean
 *   theme       'idea' (light, default) | 'material' (dark)
 *   height      CSS size passed to CodeMirror.setSize (default '200px')
 *   placeholder string
 *   className, style, onDragOver, onDragLeave, onDrop  passthrough to wrapper
 */
const JsonCodeEditor = ({
    value,
    onChange,
    readOnly = false,
    theme = 'idea',
    height = '200px',
    placeholder = '',
    className,
    style,
    onDragOver,
    onDragLeave,
    onDrop,
}) => (
    <div
        className={className}
        style={style}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
    >
        <CodeMirror
            value={value ?? ''}
            options={{
                mode: { name: 'javascript', json: true },
                theme,
                lineNumbers: true,
                tabSize: 4,
                lineWrapping: true,
                placeholder,
                readOnly: readOnly ? 'nocursor' : false,
            }}
            editorDidMount={(editor) => editor.setSize('100%', height)}
            onBeforeChange={(editor, data, newValue) => {
                if (!readOnly && onChange) onChange(newValue);
            }}
        />
    </div>
);

export default JsonCodeEditor;

import React from 'react';
import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';

/**
 * Lean JSON editor backed by @uiw/react-codemirror (CodeMirror 6).
 *
 * Props (unchanged from the previous CM5 wrapper):
 *   value       string
 *   onChange    (newValue: string) => void   (ignored when readOnly)
 *   readOnly    boolean
 *   theme       'idea' (light, default) | 'material' (dark)
 *   height      CSS size for the editor (default '200px')
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
            height={height}
            theme={theme === 'material' ? 'dark' : 'light'}
            editable={!readOnly}
            readOnly={readOnly}
            placeholder={placeholder}
            basicSetup={{
                lineNumbers: true,
                foldGutter: false,
                highlightActiveLine: !readOnly,
                highlightActiveLineGutter: !readOnly,
            }}
            extensions={[json(), EditorView.lineWrapping]}
            onChange={(newValue) => { if (!readOnly && onChange) onChange(newValue); }}
        />
    </div>
);

export default JsonCodeEditor;

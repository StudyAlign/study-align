import React from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

import './Editors.scss';

// Toolbar roughly mirrors the previous CKEditor configuration.
const modules = {
    toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ script: 'sub' }, { script: 'super' }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ align: [] }],
        ['blockquote', 'code-block', 'link'],
        ['clean'],
    ],
};

function HtmlEditor({ value, onChange }) {
    return (
        <div className="main-container html-editor">
            <ReactQuill
                theme="snow"
                value={value || ''}
                onChange={(content) => onChange(content)}
                modules={modules}
                placeholder="Type or paste your body-content here!"
            />
        </div>
    );
}

export default HtmlEditor;

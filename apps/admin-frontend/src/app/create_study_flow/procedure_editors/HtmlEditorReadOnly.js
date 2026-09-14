import React from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.bubble.css';

import './Editors.scss';

function HtmlEditorReadOnly({ value }) {
    return (
        <div className="main-container html-editor html-editor-readonly">
            <ReactQuill
                theme="bubble"
                value={value || ''}
                readOnly={true}
                modules={{ toolbar: false }}
            />
        </div>
    );
}

export default HtmlEditorReadOnly;

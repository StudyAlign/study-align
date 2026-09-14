import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import { store } from './redux/store';

import App from './App';

import './index.css';

import * as serviceWorker from './serviceWorker';

// React 18 root API. StrictMode is intentionally omitted: its dev-only
// double-invocation of effects breaks the legacy drag (react-sortful) and
// CodeMirror-5 (react-codemirror2) editors used here.
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <App/>
    </Provider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

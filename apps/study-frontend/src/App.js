import React, {createContext} from 'react';
import './App.css';
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
import Home from "./app/home/Home";
import StudyAlign from "./app/study/StudyAlign";
import {ProvideAuth, StudyRoute} from "./components/Auth";
import Participation from "./app/participation/Participation";
import Controller from "./app/experiment/Controller"
import Finish from "./app/finish/Finish"
import Updater from "./app/updater/Updater";

export default function App() {
    return (
        <ProvideAuth>
            <Router basename={process.env.PUBLIC_URL}>
                <Routes>
                    <Route path="/:id/start" element={<StudyRoute><Participation/></StudyRoute>} />
                    <Route path="/:id/run" element={<StudyRoute><Controller/></StudyRoute>} />
                    <Route path="/:id/end" element={<StudyRoute><Finish/></StudyRoute>} />
                    <Route path="/:id/participate/:token" element={<StudyAlign/>} />
                    <Route path="/:id/proceed/:token" element={<Updater/>} />
                    <Route path="/:id" element={<StudyAlign/>} />
                    <Route path="/" element={<Home/>} />
                </Routes>
            </Router>
        </ProvideAuth>
    );
}


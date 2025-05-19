import './App.css';

import {useContext, useEffect} from 'react';
import useLogger, { LoggerEvents } from './studyalign/logger'
import { LoggerContext } from './studyalign/LoggerContext';
import {BrowserRouter, Route, Routes} from "react-router";

import Start from "./pages/start";
import VersionA from "./pages/versionA";
import VersionB from "./pages/versionB";
import VersionC from "./pages/versionC";

function App() {

  const [isReady, studyAlignLib, logger, proceed, transmitter] = useLogger(
      'https://hciaitools.uni-bayreuth.de/study-align-dev'
  );

  useEffect(() => {
    if (isReady) {
      logger(LoggerEvents.USER_AGENT, window.navigator.userAgent);
    }
  }, [isReady]);

  return (
    <LoggerContext.Provider
      value={{
        studyAlignLib: studyAlignLib,
        logger: logger,
        proceed: proceed,
        transmitter: transmitter
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Start/>} />
          <Route path="/version-a" element={<VersionA/>} />
          <Route path="/version-b" element={<VersionB/>} />
          <Route path="/version-c" element={<VersionC/>} />
        </Routes>
      </BrowserRouter>
    </LoggerContext.Provider>
  );
}

export default App;

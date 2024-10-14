import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import NoPlant from '../modules/NoPlant';
import ProcosysRouter from './ProcosysRouter';
import React from 'react';

const Page404: React.FC = (): JSX.Element => {
    return <h3>404</h3>;
};

/**
 * Makes sure that the user has selected a plant
 * before continuing their journey into the main application
 */
const GeneralRouter = (): JSX.Element => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<NoPlant />} />
                <Route path="/:plant/*" element={<ProcosysRouter />} />
                <Route path="*" element={<Page404 />} />
            </Routes>
        </Router>
    );
};

export default GeneralRouter;

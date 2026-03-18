import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import NoPlant from '../modules/NoPlant';
import ProcosysRouter from './ProcosysRouter';
import React from 'react';

const Page404: React.FC = (): JSX.Element => {
    return <h3>404</h3>;
};

const router = createBrowserRouter([
    {
        path: '/',
        element: <NoPlant />,
    },
    {
        path: '/:plant/*',
        element: <ProcosysRouter />,
    },
    {
        path: '*',
        element: <Page404 />,
    },
]);

/**
 * Makes sure that the user has selected a plant
 * before continuing their journey into the main application
 */
const GeneralRouter = (): JSX.Element => {
    return <RouterProvider router={router} />;
};

export default GeneralRouter;

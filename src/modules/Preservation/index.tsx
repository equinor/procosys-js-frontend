import React from 'react';
import { Route, Routes } from 'react-router-dom';

import AddScope from './views/AddScope/AddScope';
import ClosedProjectWarning from './ClosedProjectWarning';
import ErrorBoundary from '@procosys/components/ErrorBoundary';
import { Helmet } from 'react-helmet';
import { PreservationContextProvider } from './context/PreservationContext';
import ScopeOverview from './views/ScopeOverview/ScopeOverview';
import withAccessControl from '../../core/security/withAccessControl';

const Preservation = (): JSX.Element => {

    return (
        <>
            <Helmet titleTemplate={'ProCoSys - Preservation %s'}></Helmet>
            <PreservationContextProvider>
                <ClosedProjectWarning />
                <Routes>
                    <Route
                        path="/AddScope/:method/:duplicateTagId?"
                        element={
                            <>
                                <Helmet>
                                    <title>{'- AddScope'}</title>
                                </Helmet>
                                <ErrorBoundary>
                                    <AddScope />
                                </ErrorBoundary>
                            </>
                        }
                    />
                    <Route
                        path="/"
                        element={
                            <ErrorBoundary>
                                <ScopeOverview />
                            </ErrorBoundary>
                        }
                    />
                    <Route
                        path="*"
                        element={<h2>Sorry, this page does not exist</h2>}
                    />
                </Routes>
            </PreservationContextProvider>
        </>
    );
};

export default withAccessControl(Preservation, ['PRESERVATION/READ']);

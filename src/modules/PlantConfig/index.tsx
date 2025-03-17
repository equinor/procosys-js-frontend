import { Route, Routes, useLocation } from 'react-router-dom';
import React from 'react';

import { Container } from './style';
import { Helmet } from 'react-helmet';
import Library from './views/Library/Library';
import { PlantConfigContextProvider } from './context/PlantConfigContext';
import withAccessControl from '../../core/security/withAccessControl';

const PlantConfig = (): JSX.Element => {
    const { pathname } = useLocation();
    const pathSegments = pathname.split('/');
    const libraryIndex = pathSegments.indexOf('libraryv2');
    const libraryType =
        libraryIndex !== -1
            ? pathSegments.slice(libraryIndex + 1).join('/')
            : '';

    return (
        <PlantConfigContextProvider>
            <Helmet titleTemplate={'ProCoSys - Library %s'} />
            <Container>
                <Routes>
                    <Route path={`${libraryType}/*`} element={<Library />} />
                    <Route
                        path="/"
                        element={<Library />} // TODO: WILL LATER BE ROUTED TO MAIN
                    />
                    <Route
                        path="*"
                        element={<h2>Sorry, this page does not exist</h2>}
                    />
                </Routes>
            </Container>
        </PlantConfigContextProvider>
    );
};

export default withAccessControl(PlantConfig, ['PRESERVATION/READ']);

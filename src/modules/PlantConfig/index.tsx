import { BrowserRouter, Route, Switch, useRouteMatch } from 'react-router-dom';
import React, { ReactElement } from 'react';

import { Container } from './style';
import { Helmet } from 'react-helmet';
import Library from './views/Library/Library';
import { PlantConfigContextProvider } from './context/PlantConfigContext';
import withAccessControl from '../../core/security/withAccessControl';

const Preservation = (): JSX.Element => {

    const { url } = useRouteMatch();
    return (
        <PlantConfigContextProvider>
            <Helmet titleTemplate={'ProCoSys - Library %s'} />
            <Container>
                <BrowserRouter basename={url}>
                    <Switch>
                        <Route
                            path={'/Library/:path/:libraryType/:libraryItem'}
                            component={Library}
                        />
                        <Route
                            path={'/'}
                            exact
                            component={Library}  //TODO: WILL LATER BE ROUTED TO MAIN
                        />
                        <Route
                            component={(): JSX.Element =>
                                (<h2>Sorry, this page does not exist</h2>)
                            }
                        />
                    </Switch>
                </BrowserRouter>
            </Container>
        </PlantConfigContextProvider>
    );
};

export default withAccessControl(Preservation, ['PRESERVATION/READ']);

import { Route, BrowserRouter, Switch, useRouteMatch } from 'react-router-dom';

import React from 'react';
import { PlantConfigContextProvider } from './context/PlantConfigContext';
import withAccessControl from '../../core/security/withAccessControl';
import { Container } from './style';
import Library from './views/Library';
import Main from './views/Main/Main';


const Preservation = (): JSX.Element => {

    const { url } = useRouteMatch();
    return (
        <div>

            <PlantConfigContextProvider>
                <Container>
                    <BrowserRouter basename={url}>
                        <Switch>
                            <Route
                                path={'/Library/'}

                                component={Library}
                            />
                            <Route
                                path={'/'}
                                exact
                                component={Main}
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


        </div>
    );
};

export default withAccessControl(Preservation, ['PRESERVATION/READ']);

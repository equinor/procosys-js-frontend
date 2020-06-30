import { Route, BrowserRouter as Router, Switch, useRouteMatch } from 'react-router-dom';

import AddScope from './views/AddScope/AddScope';
import EditTagProperties from './views/EditTagProperties/EditTagProperties';
import { Container, OldPreservationLink } from './style';
import { PreservationContextProvider } from './context/PreservationContext';
import React from 'react';
import ScopeOverview from './views/ScopeOverview/ScopeOverview';
import withAccessControl from '../../core/security/withAccessControl';
import { Typography } from '@equinor/eds-core-react';

const Preservation = (): JSX.Element => {

    const switchToOld = (): void => {
        window.location.href = 'OldPreservation';
    };

    const { url } = useRouteMatch();
    return (
        <PreservationContextProvider>
            <Container>
                <OldPreservationLink title='To work on preservation scope not yet migrated.' onClick={switchToOld}>
                    <Typography bold variant="caption" >Switch to old system</Typography>
                </OldPreservationLink>
                <Router basename={url}>
                    <Switch>
                        <Route
                            path={'/AddScope/:method'}
                            exact
                            component={AddScope}
                        />
                        <Route
                            path={'/'}
                            exact
                            component={ScopeOverview}
                        />
                        <Route
                            path={'/EditTagProperties/:tagId'}
                            exact
                            component={EditTagProperties}
                        />
                        <Route
                            component={(): JSX.Element =>
                                (<h2>Sorry, this page does not exist</h2>)
                            }
                        />
                    </Switch>
                </Router>
            </Container>
        </PreservationContextProvider >
    );
};

export default withAccessControl(Preservation, ['PRESERVATION/READ']);

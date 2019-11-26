import React, {useEffect, useState} from 'react';
import { Redirect, Route, BrowserRouter as Router, Switch, useHistory } from 'react-router-dom';

import ProcosysClient from '../http/ProCoSysClient';
import ProcosysRouter from './ProcosysRouter';
import Spinner from '../components/Spinner';

const NoPlant = (): JSX.Element => {

    const [selectedPlant, setSelectedPlant] = useState<string|null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const history = useHistory();

    function redirect(plant: string): void {
        setSelectedPlant(plant);
        history.replace('/' + plant);
    }

    useEffect(() => {
        (async (): Promise<void> => {
            const client = new ProcosysClient();
            const plantsResponse = await client.getAllPlantsForUser();
            if (plantsResponse.length > 0) {
                const plant = plantsResponse[0].Id.replace('PCS$','');
                redirect(plant);
            }
            setLoading(false);
        })();
    },[]);

    if (loading) {
        return <Spinner />;
    }
    if (selectedPlant) {
        return (
            <Redirect
                to={{
                    pathname: `/${selectedPlant}/`,
                    state: { from: '/' }
                }}
            />
        );
    }

    return <h1>You dont have access to any plants</h1>;
};

const GeneralRouter = (): JSX.Element => {
    return (
        <Router>
            <Switch>
                <Route path="/" exact component={NoPlant} />
                <Route path="/:plant" component={ProcosysRouter} />
                <Route render={(): JSX.Element => <h3>404</h3>} />
            </Switch>
        </Router>
    );
};

export default GeneralRouter;

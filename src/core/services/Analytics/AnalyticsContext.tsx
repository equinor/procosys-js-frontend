import React, { useEffect } from 'react';

import AnalyticsService from './AppInsightsAnalytics';
import IAnalytics from './IAnalytics';
import propTypes from 'prop-types';
import { useCurrentPlant } from '@procosys/core/PlantContext';
import { useHistory } from 'react-router-dom';

const AnalyticsContext = React.createContext<IAnalytics>({} as IAnalytics);
AnalyticsContext.displayName = 'AnalyticsContext';

const AnalyticsContextProvider: React.FC = ({ children }): JSX.Element => {
    const { plant } = useCurrentPlant();
    const history = useHistory();
    const analytics = new AnalyticsService(history, plant ? plant.title : '');

    useEffect(() => {
        if (plant) {
            analytics.setPlant(plant.title);
        }
    }, [plant]);

    return (<AnalyticsContext.Provider value={analytics} >
        {children}
    </AnalyticsContext.Provider>);
};

AnalyticsContextProvider.propTypes = {
    children: propTypes.node
};

const useAnalytics = (): IAnalytics => React.useContext<IAnalytics>(AnalyticsContext);

export {
    useAnalytics,
    AnalyticsContext,
    AnalyticsContextProvider
};

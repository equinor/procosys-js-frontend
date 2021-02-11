import React, { useEffect } from 'react';

import AnalyticsService from './AppInsightsAnalytics';
import IAnalytics from './IAnalytics';
import propTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

const AnalyticsContext = React.createContext<IAnalytics>({} as IAnalytics);
AnalyticsContext.displayName = 'AnalyticsContext';

const AnalyticsContextProvider: React.FC = ({ children }): JSX.Element => {
    const history = useHistory();
    const analytics = new AnalyticsService(history);

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

import { createBrowserHistory } from 'history';
import AnalyticsService from './AppInsightsAnalytics';
import IAnalytics from './IAnalytics';
import React from 'react';
import propTypes from 'prop-types';

export const customHistory = createBrowserHistory();

const AnalyticsContext = React.createContext<IAnalytics>({} as IAnalytics);
AnalyticsContext.displayName = 'AnalyticsContext';

const AnalyticsContextProvider: React.FC = ({ children }): JSX.Element => {
    const analytics = new AnalyticsService(customHistory);

    return (
        <AnalyticsContext.Provider value={analytics}>
            {children}
        </AnalyticsContext.Provider>
    );
};

AnalyticsContextProvider.propTypes = {
    children: propTypes.node,
};

const useAnalytics = (): IAnalytics =>
    React.useContext<IAnalytics>(AnalyticsContext);

export { useAnalytics, AnalyticsContext, AnalyticsContextProvider };

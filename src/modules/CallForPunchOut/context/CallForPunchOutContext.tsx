import React from 'react';
import propTypes from 'prop-types';

type CallForPunchOutContextProps = {
}

const CallForPunchOutContext = React.createContext<CallForPunchOutContextProps>({} as CallForPunchOutContextProps);

export const CallForPunchOutContextProvider: React.FC = ({ children }): JSX.Element => {
    return (
        <CallForPunchOutContext.Provider value={{}}>
            {children}
        </CallForPunchOutContext.Provider>
    );
};

CallForPunchOutContextProvider.propTypes = {
    children: propTypes.node.isRequired
};

export const useCallForPunchOutContext = (): CallForPunchOutContextProps => React.useContext<CallForPunchOutContextProps>(CallForPunchOutContext);

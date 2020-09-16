import React from 'react';
import propTypes from 'prop-types';

type InvitationForPunchOutContextProps = {
}

const InvitationForPunchOutContext = React.createContext<InvitationForPunchOutContextProps>({} as InvitationForPunchOutContextProps);

export const InvitationForPunchOutContextProvider: React.FC = ({ children }): JSX.Element => {
    return (
        <InvitationForPunchOutContext.Provider value={{}}>
            {children}
        </InvitationForPunchOutContext.Provider>
    );
};

InvitationForPunchOutContextProvider.propTypes = {
    children: propTypes.node.isRequired
};

export const useInvitationForPunchOutContext = (): InvitationForPunchOutContextProps => React.useContext<InvitationForPunchOutContextProps>(InvitationForPunchOutContext);

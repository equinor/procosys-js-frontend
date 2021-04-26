import { useProcosysContext } from '@procosys/core/ProcosysContext';
import React, { useMemo } from 'react';
import GlobalSearchApiClient from '../http/GlobalSearchApiClient';
import propTypes from 'prop-types';


const GlobalSearchContext = React.createContext<GlobalSearchContextProps>({} as GlobalSearchContextProps);
type GlobalSearchContextProps = {
    apiClient: GlobalSearchApiClient;
}

export const GlobalSearchContextProvider: React.FC = ({ children }): JSX.Element => {
    const { procosysApiClient, auth } = useProcosysContext();
    const apiClient = useMemo(() => new GlobalSearchApiClient(auth), [auth]);

    return (
        <GlobalSearchContext.Provider value={{
            apiClient: apiClient
        }}>
            {children}
        </GlobalSearchContext.Provider>
    );
};

GlobalSearchContextProvider.propTypes = {
    children: propTypes.node.isRequired
};

export const useGlobalSearchContext = (): GlobalSearchContextProps => React.useContext<GlobalSearchContextProps>(GlobalSearchContext);
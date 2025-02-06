import { useProcosysContext } from '@procosys/core/ProcosysContext';
import React, { PropsWithChildren, useMemo } from 'react';
import QuickSearchApiClient from '../http/QuickSearchApiClient';
import propTypes from 'prop-types';

const QuickSearchContext = React.createContext<QuickSearchContextProps>(
    {} as QuickSearchContextProps
);
type QuickSearchContextProps = {
    apiClient: QuickSearchApiClient;
};

export const QuickSearchContextProvider = ({
    children,
}: PropsWithChildren<{}>): JSX.Element => {
    const { procosysApiClient, auth } = useProcosysContext();
    const apiClient = useMemo(() => new QuickSearchApiClient(auth), [auth]);

    return (
        <QuickSearchContext.Provider
            value={{
                apiClient: apiClient,
            }}
        >
            {children}
        </QuickSearchContext.Provider>
    );
};

QuickSearchContextProvider.propTypes = {
    children: propTypes.node.isRequired,
};

export const useQuickSearchContext = (): QuickSearchContextProps =>
    React.useContext<QuickSearchContextProps>(QuickSearchContext);

import React, { useContext } from 'react';

import { IAuthService } from '../auth/AuthService';
import ProCoSysClient from '../http/ProCoSysClient';

export interface IProcosysContext {
    auth: IAuthService;
    procosysApiClient: ProCoSysClient;
    dirtyComponents: Set<string>;
}

type createContextOptions = {
    auth: IAuthService;
}

const ProcosysContext = React.createContext<IProcosysContext>({} as IProcosysContext);

export const createProcosysContext = ({ auth }: createContextOptions): IProcosysContext => {
    return {
        auth: auth,
        procosysApiClient: new ProCoSysClient(auth),
        dirtyComponents: new Set()
    };
};

export const useProcosysContext = (): IProcosysContext => useContext(ProcosysContext);

export default ProcosysContext;

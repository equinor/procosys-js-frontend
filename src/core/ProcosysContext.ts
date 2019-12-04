import React, {useContext} from 'react';

import {IAuthService} from '../auth/AuthService';

export interface IProcosysContext {
    auth: IAuthService;
}

type createContextOptions = {
    auth: IAuthService;
}

const ProcosysContext = React.createContext<IProcosysContext>({} as IProcosysContext);

export const createProcosysContext = ({auth}: createContextOptions): IProcosysContext => {
    return {
        auth: auth
    };
};

export const useProcosysContext = (): IProcosysContext => useContext(ProcosysContext);

export default ProcosysContext;

import React, {useContext} from 'react';

import {IAuthService} from '../auth/AuthService';

export interface IProcosysContext {
    auth: IAuthService;
}

type createContextOptions = {
    auth: IAuthService;
}

export const createProcosysContext = ({auth}: createContextOptions): IProcosysContext => {
    return {
        auth: auth
    };
};

const ProcosysContext = React.createContext<IProcosysContext>({} as IProcosysContext);

export const useProcosysContext = (): IProcosysContext => useContext(ProcosysContext);

export default ProcosysContext;

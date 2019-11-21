import {useEffect, useState} from 'react';

import AuthUser from '../auth/AuthUser';
import {useProcosysContext} from '../core/ProcosysContext';

const useCurrentUser = (): AuthUser | null => {

    const {auth} = useProcosysContext();
    const [currentUser, setCurrentUser] = useState<AuthUser|null>(auth.getCurrentUser());

    useEffect(() => {
        setCurrentUser(auth.getCurrentUser());
    },[]);

    return currentUser;

};

export default useCurrentUser;

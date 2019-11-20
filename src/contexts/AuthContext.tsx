import { Account, AuthResponse, Configuration, UserAgentApplication } from 'msal';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

import { authResponseCallback } from 'msal/lib-commonjs/UserAgentApplication';

const settings = require('./../../settings.json');

type AuthContext = {
    account: any | null;
    accessToken: string | null;
    login(): void;
    logout(): void;
}

const authConfig: Configuration = {
    auth: {
        clientId: settings.auth.clientId,
        redirectUri: window.location.origin,
        authority: settings.auth.authority,
    }
};

export const authInstance = new UserAgentApplication(authConfig);

declare type authErrorCallback = (errorMessage: authError) => void;
declare type authError = {
    message: string;
    code: string;
}

declare type AccessTokenRequest = {
    scopes: Array<string>;
}

const authParams = {
    scopes: settings.auth.defaultScopes,
};

const authContext = createContext<AuthContext | null>(null);

export const useAuth = (): AuthContext => {
    const auth = useContext(authContext);
    if (!auth) throw 'useAuth can only be used within authContext';
    return auth;
};

const getAccessToken = async (request: AccessTokenRequest): Promise<string> => {
    const response = await authInstance.acquireTokenSilent({ scopes: request.scopes });
    return response.accessToken;

};

const renewIdToken = async (): Promise<void> => {
    console.log('Renewing: ');
    const respo = authInstance.acquireTokenSilent({ scopes: [authConfig.auth.clientId], forceRefresh: true });
    console.log('State: ', respo);
    await respo;
    console.log('^ Finished ^');

};


function useProvideAuth(): AuthContext {
    const [account, setAccount] = useState<null | Account>(null);
    const [accessToken, setAccessToken] = useState<null | string>(null);
    const [hasCheckedInitialUser, setHasCheckedInitialUser] = useState(false);
    const timerRef = useRef<number | null>(null);

    const renewTokenMinutesBeforeExpiry = 5;

    const login = (): void => {
        authInstance.loginRedirect();
    };

    const logout = (): void => {
        authInstance.logout();
    };

    const reAuthenticate = async (): Promise<void> => {
        try {
            await renewIdToken();
            setAccount(authInstance.getAccount());
        } catch (err) {
            console.log('Failed to renew idToken', err);
            authInstance.logout();
        }

    };

    useEffect(() => {
        if (!account) return;
        const tokenExpiresAt = account.idToken.exp as unknown as number;
        const notifyApplicationAtDateTime = new Date((tokenExpiresAt - (renewTokenMinutesBeforeExpiry * 60)) * 1000);
        const notifyApplicationIn = notifyApplicationAtDateTime.getTime() - Date.now();
        console.log('Will notify application at: ', notifyApplicationAtDateTime);
        console.log('This is in ' + Math.floor(notifyApplicationIn / 1000 / 60) + ' minutes');
        if (notifyApplicationIn <= 0) {
            console.log('This token is old, we should re-authenticate');
            reAuthenticate();
            return;
        }
        timerRef.current = setTimeout(() => reAuthenticate(), notifyApplicationIn);

        return (): void => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            timerRef.current = null;
        };
    }, [account]);

    if (!hasCheckedInitialUser) {
        const authAccount = authInstance.getAccount() as any;

        if (authAccount) {
            setAccount(authAccount);
            getAccessToken(authParams)
                .then((accessToken) => {
                    setAccessToken(accessToken);
                });
        }
        setHasCheckedInitialUser(true);
    }

    return {
        account,
        accessToken,
        login,
        logout
    };
}

type AuthProviderProps = {
    children: JSX.Element;
}

export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

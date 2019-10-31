import { Account, Configuration, UserAgentApplication, AuthResponse } from 'msal';
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

import { authResponseCallback } from 'msal/lib-commonjs/UserAgentApplication';

const settings = require('./../../settings.json');

interface IAuthContext {
    account: any | null;
    accessToken: string | null;
    login(): void;
    logout(): void;
    handleRedirectCallback(errorCallback: authErrorCallback): void;
}

const authConfig: Configuration = {
    auth: {
        clientId: settings.auth.clientId,
        redirectUri: window.location.origin,
        authority: settings.auth.authority,
    }
};

const authInstance = new UserAgentApplication(authConfig);

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

const authContext = createContext<IAuthContext | null>(null);

export const useAuth = () => {
    const auth = useContext(authContext);
    if (!auth) throw "useAuth can only be used within authContext";
    return auth;
}

export const AuthProvider = ({ children }: any) => {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

const getAccessToken = async (request: AccessTokenRequest): Promise<string> => {
    try {
        const response = await authInstance.acquireTokenSilent({ scopes: request.scopes })
        return response.accessToken;
    } catch (err) {
        throw err;
    }
}

const renewIdToken = async (): Promise<void> => {
    console.log("Renewing: ");
    const respo = authInstance.acquireTokenSilent({ scopes: [authConfig.auth.clientId], forceRefresh: true });
    console.log("State: ", respo);
    await respo;
    console.log("^ Finished ^");

}

function useProvideAuth() {
    const [account, setAccount] = useState<null | Account>(null);
    const [accessToken, setAccessToken] = useState<null | string>(null);
    const [hasCheckedInitialUser, setHasCheckedInitialUser] = useState(false);
    const timerRef = useRef<number | null>(null);

    const renewTokenMinutesBeforeExpiry = 1;

    const login = () => {
        authInstance.loginRedirect();
    }

    const logout = () => {
        authInstance.logout();
    }

    const reAuthenticate = async () => {
        console.log("ReAuthenticating");
        try {
            console.log("Old expiry: ", authInstance.getAccount().idToken.exp);
            await renewIdToken();
            console.log("New expiry: ", authInstance.getAccount().idToken.exp);
            setAccount(authInstance.getAccount());
        } catch (err) {
            console.log("Failed to renew idToken", err);
            //authInstance.logout();
        }

    }

    useEffect(() => {
        console.log("Running effect");
        if (!account) return;
        const tokenExpiresAt = account.idToken.exp as unknown as number;
        const notifyApplicationAtDateTime = new Date((tokenExpiresAt - (renewTokenMinutesBeforeExpiry * 60)) * 1000);
        const notifyApplicationIn = notifyApplicationAtDateTime.getTime() - Date.now();
        console.log('Will notify application at: ', notifyApplicationAtDateTime);
        console.log('This is in ' + notifyApplicationIn + 'ms');
        if (notifyApplicationIn <= 0) {
            console.log("This token is old, we should re-authenticate");
            reAuthenticate();
            return;
        }
        timerRef.current = setTimeout(() => reAuthenticate(), notifyApplicationIn);

        return () => {
            console.log("Cleaning effect");
            if (timerRef.current) {
                clearTimeout(timerRef.current)
            }
            timerRef.current = null;
        }
    }, [account])

    if (!hasCheckedInitialUser) {
        var authAccount = authInstance.getAccount() as any;

        if (authAccount) {
            authAccount.idToken.exp = Math.floor(Date.now() / 1000 + 90);
            setAccount(authAccount);
            getAccessToken(authParams)
                .then((accessToken) => {
                    setAccessToken(accessToken);
                });
        }
        setHasCheckedInitialUser(true);
    }



    const handleRedirectCallback = (callback: authErrorCallback) => {

        const authHandler: authResponseCallback = (error, response) => {
            if (error) {
                console.log("Error: ", error);
                callback({ message: error.errorMessage, code: error.errorCode });
                return;
            }
        }

        authInstance.handleRedirectCallback(authHandler);
    }

    return {
        account,
        accessToken,
        login,
        logout,
        handleRedirectCallback,
    }
}

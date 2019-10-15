import { Account, Configuration, UserAgentApplication } from 'msal';
import React, {createContext, useContext, useState} from 'react';

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
        redirectUri: window.location.href,
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
    const auth =  useContext(authContext);
    if (!auth) throw "useAuth can only be used within authContext";
    return auth;
}

export const AuthProvider = ({children} : any) => {
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

function useProvideAuth() {
    const [account, setAccount] = useState<null | Account>(null);
    const [accessToken, setAccessToken] = useState<null | string>(null);
    const [hasCheckedInitialUser, setHasCheckedInitialUser] = useState(false);

    const login = () => {
        console.log("authConfig", authConfig);
        authInstance.loginRedirect();
    }

    const logout = () => {
        authInstance.logout();
    }

    if (!hasCheckedInitialUser) {
        var authAccount = authInstance.getAccount();

        if (authAccount) {
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
            console.log("AuthHandler");
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

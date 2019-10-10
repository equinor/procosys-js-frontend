import { Configuration, UserAgentApplication } from 'msal';
import { authResponseCallback } from 'msal/lib-commonjs/UserAgentApplication';

const settings = require('./../../../settings.json');

interface UserData {
    name: string;
}

const authConfig: Configuration = {
    auth: {
        clientId: settings.auth.clientId,
        redirectUri: window.location.href,
        authority: settings.auth.authority,
    }
};

const authInstance = new UserAgentApplication(authConfig);

const getUserData = (): UserData | undefined => {
    const account = authInstance.getAccount();
    if (!account) return undefined;

    return {
        name: account.name
    };
}

const login = () => {
    authInstance.loginRedirect();
}

declare type authErrorCallback = (errorMessage: authError) => void;
declare type authError = {
    message: string;
    code: string;
}

const handleRedirectCallback = (callback: authErrorCallback) => {

    const authHandler: authResponseCallback = (error, response) => {
        if (error) {
            console.log("Error: ", error);
            callback({ message: error.errorMessage, code: error.errorCode });
        }
    }

    authInstance.handleRedirectCallback(authHandler);
}

declare type AccessTokenRequest = {
    scopes: Array<string>;
}

declare type AccessTokenResponse = {
    error?: string;
    accessToken?: string;
}

const getAccessToken = async (request: AccessTokenRequest): Promise<AccessTokenResponse> => {
    try {
        const response = await authInstance.acquireTokenSilent({ scopes: request.scopes })
        return {
            accessToken: response.accessToken,
            error: undefined
        }
    } catch (err) {
        return Promise.reject(err);
    }
}

const logout = () => {
    authInstance.logout();
}

export default {
    handleRedirectCallback,
    login,
    getUserData,
    getAccessToken,
    logout
}

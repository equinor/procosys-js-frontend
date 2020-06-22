import { Configuration, UserAgentApplication } from 'msal';

import AuthUser from './AuthUser';

const settings = require('./../../settings.json');

const authConfig: Configuration = {
    auth: {
        clientId: settings.auth.clientId,
        redirectUri: window.location.href,
        authority: settings.auth.authority,
        postLogoutRedirectUri: 'http://myapps.microsoft.com/'
    },
    // system: {
    //     logger: new Logger((lvl: any, message: any, piEnabled?: boolean ): void => { console.log('Auth: ', message);})
    // }
};

const defaultLoginScopes = JSON.parse(settings.auth.defaultScopes.replace(/'/g,'"'));

export interface IAuthService {
    /**
     * Get the users concent to external application
     */
    aquireConcent(resource: string): void;

    /**
     * Redirects the user to authority for authentication
     */
    login(): void;

    /**
     * Clears localstorage and redirects user to authority for signout
     */
    logout(): void;

    /**
     * Handle response from authority when user is done authenticating
     */
    handleRedirectCallback(): void;

    /**
     * Returns the currently logged in users access token for a given resource
     */
    getAccessTokenAsync(resource: string): Promise<AccessToken>;

    /**
     * Returns information on the currently logged in user, or null if not logged in
     */
    getCurrentUser(): AuthUser | null;
}

class AuthenticationError extends Error {}

type AccessToken = {
    token: string;
    expiresAt: Date;
}

export default class AuthService implements IAuthService {

    private authInstance: UserAgentApplication;

    constructor() {
        this.authInstance = new UserAgentApplication(authConfig);
    }

    login(): void {
        this.authInstance.loginRedirect({scopes: defaultLoginScopes});
    }

    aquireConcent(resource: string): void {
        this.authInstance.loginRedirect({scopes: [resource]});
    }

    logout(): void {
        this.authInstance.logout();
    }

    handleRedirectCallback(): void {
        try {
            this.authInstance.handleRedirectCallback((err, /* response */) => {
                if (err) throw new AuthenticationError(err.message);
            });
        } catch (err) {
            console.error('Failed to handle Redirect Callback');
            throw err;
        }
    }

    async getAccessTokenAsync(resource: string): Promise<AccessToken> {
        const response = await this.authInstance.acquireTokenSilent({scopes: [resource]});
        return {token: response.accessToken, expiresAt: response.expiresOn};
    }

    getCurrentUser(): AuthUser | null {
        const account = this.authInstance.getAccount();
        if (!account) return null;
        return new AuthUser({username: account.userName, fullname: account.name, id: account.accountIdentifier});
    }
}

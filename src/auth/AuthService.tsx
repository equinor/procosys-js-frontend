import { Configuration, UserAgentApplication } from 'msal';

import AuthUser from './AuthUser';
import ProCoSysSettings from '@procosys/core/ProCoSysSettings';

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
    getAccessTokenAsync(resource: string): Promise<AccessToken | void>;

    /**
     * Returns information on the currently logged in user, or null if not logged in
     */
    getCurrentUser(): AuthUser | null;
}

class AuthenticationError extends Error {}

type AccessToken = {
    token: string;
    expiresAt: Date;
};

export default class AuthService implements IAuthService {
    private authInstance: UserAgentApplication;

    constructor() {
        const authConfig: Configuration = {
            auth: {
                clientId: ProCoSysSettings.clientId,
                redirectUri: window.location.href,
                authority: ProCoSysSettings.authority,
            },
            // system: {
            //     logger: new Logger((lvl: any, message: any, piEnabled?: boolean ): void => { console.log('Auth: ', message);})
            // }
        };
        this.authInstance = new UserAgentApplication(authConfig);
    }

    login(): void {
        this.authInstance.loginRedirect({
            scopes: ProCoSysSettings.defaultScopes,
        });
    }

    aquireConcent(resource: string): void {
        this.authInstance.acquireTokenRedirect({ scopes: [resource] });
    }

    logout(): void {
        localStorage.clear();
        sessionStorage.clear();
        window.location.assign('https://myapps.microsoft.com/');
    }

    handleRedirectCallback(): void {
        try {
            this.authInstance.handleRedirectCallback((err /* response */) => {
                if (err) throw new AuthenticationError(err.message);
            });
        } catch (err) {
            console.error('Failed to handle Redirect Callback');
            throw err;
        }
    }

    async getAccessTokenAsync(resource: string): Promise<AccessToken> {
        try {
            const response = await this.authInstance.acquireTokenSilent({
                scopes: [resource],
            });
            return {
                token: response.accessToken,
                expiresAt: response.expiresOn,
            };
        } catch (authError) {
            // Normally, 'login_required' should be handled with a login call
            // But due to 3rd party cookie blocking, from Safari
            // the user always gets this response on a silent request, so we need to handle
            // this as consent required, and trust that the user is atleast logged in before the
            // api is put to use.
            if (
                [
                    'consent_required',
                    'interaction_required',
                    'login_required',
                ].indexOf(authError.errorCode) !== -1
            ) {
                this.aquireConcent(resource);
            }
        }
        throw 'Failed to login';
    }

    getCurrentUser(): AuthUser | null {
        const account = this.authInstance.getAccount();
        if (!account) return null;
        return new AuthUser({
            username: account.userName,
            fullname: account.name,
            id: account.accountIdentifier,
        });
    }
}

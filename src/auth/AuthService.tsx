import {
    AccountInfo,
    AuthenticationResult,
    AuthError,
    Configuration,
    EndSessionRequest,
    InteractionRequiredAuthError,
    LogLevel,
    PopupRequest,
    PublicClientApplication,
    SsoSilentRequest,
} from '@azure/msal-browser';
import AuthUser from './AuthUser';

declare global {
    interface Window {
        PRESERVATION_API_SCOPE: string;
        PRESERVATION_API_URL: string;
        SEARCH_API_SCOPE: string;
        SEARCH_API_URL: string;
        IPO_API_SCOPE: string;
        IPO_API_URL: string;
        PROCOSYS_API_SCOPE: string;
        PROCOSYS_API_URL: string;
        LIBRARY_API_SCOPE: string;
        LIBRARY_API_URL: string;
        INSTRUMENTATION_KEY: string;
        CLIENT_ID: string;
        SCOPES: string[];
        FEATURE_FLAGS: Record<string, boolean>;
        HEADER_COLOR: string;
    }
}

export interface IAuthService {
    /**
     * Redirects the user to authority for authentication
     */
    login(): void;

    /**
     * Clears localstorage and redirects user to authority for signout
     */
    logout(): void;

    /**
     * Returns the currently logged in users access token for a given resource
     */
    getAccessTokenAsync(resource: string): Promise<AccessToken | void>;

    /**
     * Returns information on the currently logged in user, or null if not logged in
     */
    getCurrentUser(): AuthUser | null;
}

type AccessToken = {
    token: string;
    expiresAt: Date | null;
};

export default class AuthService implements IAuthService {
    private myMSALObj: PublicClientApplication; // https://azuread.github.io/microsoft-authentication-library-for-js/ref/msal-browser/classes/_src_app_publicclientapplication_.publicclientapplication.html
    private account: AccountInfo | null; // https://azuread.github.io/microsoft-authentication-library-for-js/ref/msal-common/modules/_src_account_accountinfo_.html
    private loginRequest: PopupRequest; // https://azuread.github.io/microsoft-authentication-library-for-js/ref/msal-browser/modules/_src_request_popuprequest_.html
    private profileRequest: PopupRequest;
    private silentLoginRequest: SsoSilentRequest;

    constructor() {
        const MSAL_CONFIG: Configuration = {
            auth: {
                clientId: window.CLIENT_ID,
                authority:
                    'https://login.microsoftonline.com/3aa4a235-b6e2-48d5-9195-7fcf05b459b0',
            },
            cache: {
                cacheLocation: 'sessionStorage', // This configures where your cache will be stored
            },
            system: {
                loggerOptions: {
                    loggerCallback: (level, message, containsPii) => {
                        if (containsPii) {
                            return;
                        }
                        switch (level) {
                            case LogLevel.Error:
                                console.error(message);
                                return;
                            case LogLevel.Info:
                                // console.info(message);
                                return;
                            case LogLevel.Verbose:
                                // console.debug(message);
                                return;
                            case LogLevel.Warning:
                                console.warn(message);
                                return;
                        }
                    },
                },
            },
        };

        this.myMSALObj = new PublicClientApplication(MSAL_CONFIG);
        this.account = null;

        this.loginRequest = {
            scopes: window.SCOPES,
        };

        this.profileRequest = {
            scopes: ['User.Read'],
        };

        this.silentLoginRequest = {
            loginHint: this.getAccount()?.username,
        };
    }

    /**
     * Calls getAllAccounts and determines the correct account to sign into, currently defaults to first account found in cache.
     * TODO: Add account chooser code
     *
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
     */
    private getAccount(): AccountInfo | null {
        const currentAccounts = this.myMSALObj.getAllAccounts();
        if (currentAccounts === null) {
            console.log('No accounts detected');
            return null;
        }

        if (currentAccounts.length > 1) {
            // Add choose account code here
            console.log(
                'Multiple accounts detected, need to add choose account code.'
            );
            return currentAccounts[0];
        } else if (currentAccounts.length === 1) {
            return currentAccounts[0];
        }

        return null;
    }

    /**
     * Checks whether we are in the middle of a redirect and handles state accordingly. Only required for redirect flows.
     *
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/initialization.md#redirect-apis
     */
    async loadAuthModule(): Promise<void> {
        await this.myMSALObj.initialize();
        // handle auth redired/do all initial setup for msal
        await this.myMSALObj.handleRedirectPromise();
        const acc = this.getAccount();

        if (acc) {
            this.myMSALObj.setActiveAccount(acc);
        } else {
            try {
                this.myMSALObj.loginRedirect().catch((x) => {
                    this.myMSALObj.clearCache();
                    return this.loadAuthModule();
                });
            } catch (e) {
                console.error(e);
            }
        }
    }

    /**
     * Handles the response from a popup or redirect. If response is null, will check if we have any accounts and attempt to sign in.
     * @param response
     */
    handleResponse(response: AuthenticationResult | null): void {
        if (response !== null) {
            this.account = response.account;
        } else {
            this.account = this.getAccount();
        }

        if (this.account) {
            this.myMSALObj.setActiveAccount(this.account);
        }
    }

    /**
     * Calls ssoSilent to attempt silent flow. If it fails due to interaction required error, it will prompt the user to login using popup.
     * @param request
     */
    attemptSsoSilent(): void {
        this.myMSALObj
            .ssoSilent(this.silentLoginRequest)
            .then(() => {
                this.account = this.getAccount();
                if (this.account) {
                    this.myMSALObj.setActiveAccount(this.account);
                } else {
                    console.log('No account!');
                }
            })
            .catch((error) => {
                console.error('Silent Error: ' + error);
                if (error instanceof InteractionRequiredAuthError) {
                    this.login('loginPopup');
                }
            });
    }

    /**
     * Calls loginPopup or loginRedirect based on given signInType.
     * @param signInType
     */
    async login(signInType = 'loginRedirect'): Promise<void> {
        if (signInType === 'loginPopup') {
            this.myMSALObj
                .loginPopup(this.loginRequest)
                .then((resp: AuthenticationResult) => {
                    this.handleResponse(resp);
                })
                .catch(console.error);
        } else if (signInType === 'loginRedirect') {
            await this.myMSALObj.loginRedirect();
        }
    }

    /**
     * Logs out of current account.
     */
    async logout(): Promise<void> {
        let account: AccountInfo | undefined;
        if (this.account) {
            account = this.account;
        }
        const logOutRequest: EndSessionRequest = {
            account,
        };

        await this.myMSALObj.logoutRedirect(logOutRequest);
    }

    async getAccessTokenAsync(resource: string): Promise<AccessToken> {
        try {
            const response = await this.myMSALObj.acquireTokenSilent({
                scopes: [resource],
            });
            return {
                token: response.accessToken,
                expiresAt: response.expiresOn,
            };
        } catch (authError) {
            if (!(authError instanceof AuthError)) {
                throw 'Unknown error in getAccessToken';
            }
            this.myMSALObj.acquireTokenRedirect({
                scopes: [resource],
            });
        }
        throw 'Failed to login';
    }

    getCurrentUser(): AuthUser | null {
        const account = this.myMSALObj.getActiveAccount();
        if (!account) return null;
        return new AuthUser({
            username: account.username,
            fullname: account.name || '',
            id: account.localAccountId,
        });
    }
}

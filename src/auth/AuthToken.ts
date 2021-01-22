
type ParsedToken = {
    aud: string;
    iss: string;
    iat: number;
    nbf: number;
    exp: number;
    aio: string;
    name: string;
    nonce: string;
    oid: string;
    preferred_username: string;
    sub: string;
    tid: string;
    uti: string;
    ver: string;
}

class InvalidToken extends Error {}

export default class AuthToken {

    static parse(token: string): AuthToken {
        try {
            const userData = JSON.parse(atob(token.split('.')[1])) as ParsedToken;
            return new AuthToken(userData);

        } catch (err) {
            throw new InvalidToken(err);
        }
    }

    constructor(json: ParsedToken) {
        this._exp = json.exp;
        this._oid = json.oid;
        this._name = json.name;
        this._username = json.preferred_username;
    }

    private _exp: number;
    private _oid: string;
    private _name: string;
    private _username: string;

    get expiresAt(): Date {
        return new Date(this._exp * 1000);
    }

    get oid(): string {
        return this._oid;
    }

    get name(): string {
        return this._name;
    }

    get username(): string {
        return this._username;
    }

    get isValid(): boolean {
        return this.expiresAt > new Date();
    }
}

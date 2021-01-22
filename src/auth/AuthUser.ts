import AuthToken from './AuthToken';

interface IAuthUser {
    username: string;
    fullname: string;
    id: string;
    idToken: string;
}

type ParsedUser = {
    username: string;
    fullname: string;
    id: string;
    idToken: string;
}


export default class AuthUser implements IAuthUser {

    static fromToken(token: string): AuthUser {
        const userToken = AuthToken.parse(token);
        return new AuthUser({username: userToken.username, fullname: userToken.name, id: userToken.oid, idToken: token});
    }

    constructor(user: ParsedUser) {
        this._id = user.id;
        this._username = user.username;
        this._fullname = user.fullname;
        this._idToken = user.idToken;
    }

    private _id: string;
    private _username: string;
    private _fullname: string;
    private _idToken: string;

    get id(): string {
        return this._id;
    }

    get username(): string {
        return this._username;
    }

    get fullname(): string {
        return this._fullname;
    }

    get idToken(): string {
        return this._idToken;
    }
}

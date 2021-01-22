import AuthToken from './AuthToken';

interface IAuthUser {
    username: string;
    fullname: string;
    id: string;
}

type ParsedUser = {
    username: string;
    fullname: string;
    id: string;
}


export default class AuthUser implements IAuthUser {

    static fromToken(token: string): AuthUser {
        const userToken = AuthToken.parse(token);
        return new AuthUser({username: userToken.username, fullname: userToken.name, id: userToken.oid});
    }

    constructor(user: ParsedUser) {
        this._id = user.id;
        this._username = user.username;
        this._fullname = user.fullname;
    }

    private _id: string;
    private _username: string;
    private _fullname: string;

    get id(): string {
        return this._id;
    }

    get username(): string {
        return this._username;
    }

    get fullname(): string {
        return this._fullname;
    }
}

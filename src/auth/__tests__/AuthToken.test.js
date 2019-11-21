import AuthToken from '../AuthToken';

const header = {
    'typ': 'jwt'
};

const payload = {
    'aud': 'fake-audience',
    'iss': 'fake-issuer',
    'iat': (Math.floor(Date.now() / 1000)),
    'nbf': (Math.floor(Date.now() / 1000)),
    'exp': (Math.floor(Date.now() / 1000 + 500)),
    'aio': 'aio-placeholder-value',
    'name': 'Luke Skywalker',
    'nonce': 'nonce-placeholder-value',
    'oid': 'abc-def',
    'preferred_username': 'luke.skywalker@disney.com',
    'sub': 'subject-placeholder-value',
    'tid': 'tid-placeholder-value',
    'uti': 'uti-placeholder-value',
    'ver': '2.0'
};

const signature = 'super-secret';

const token = [btoa(JSON.stringify(header)), btoa(JSON.stringify(payload)), btoa(signature)].join('.');

describe('Authtoken', () => {
    const userToken = AuthToken.parse(token);

    it('Should parse expiry correctly', () => {
        expect(userToken.expiresAt).toEqual(new Date(payload.exp * 1000));
    });

    it('Should have valid timeframe', () => {
        expect(userToken.isValid).toBe(true);
    });

    it('Should have correct name', () => {
        expect(userToken.name).toBe(payload.name);
    });

    it('Should have correct username', () => {
        expect(userToken.username).toBe(payload.preferred_username);
    });
});

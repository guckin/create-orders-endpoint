import {GetPublicKeyOrSecret, verify} from 'jsonwebtoken';
import {failureFrom, Result, successFrom} from '../common/result';
import {JwksClient} from 'jwks-rsa';

export type TokenVerificationDependencies = {
    readonly verify: typeof verify;
    readonly jwksClient: JwksClient;
}

export type TokenVerification = (token: string) => Promise<TokenVerificationResult>;

export type TokenVerificationResult = Result<void, void>;

export const tokenVerificationFactory = (
    {
        verify,
        jwksClient
    }: TokenVerificationDependencies
): TokenVerification => token => {
    return new Promise<TokenVerificationResult>(resolve => {
        verify(token, getKeyFactory(jwksClient), err => {
            const result = err ? failureFrom(undefined) : successFrom(undefined);
            resolve(result);
        });
    });
};

const getKeyFactory = (jwksClient: JwksClient): GetPublicKeyOrSecret => (header, callback) => {
    jwksClient.getSigningKey(header.kid, (err, key) => {
        const signingKey = key.getPublicKey();
        callback(null, signingKey);
    });
};

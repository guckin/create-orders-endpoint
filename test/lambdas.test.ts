import * as lambdas from '../src/lambdas';

describe('lambdas.ts', () => {
    [
        {
            hasLambda: 'postOrderLambda',
        },
        {
            hasLambda: 'getOrderLambda',
        },
        {
            hasLambda: 'patchOrderLambda'
        },
        {
            hasLambda: 'recordProcessor'
        },
        {
            hasLambda: 'authorizer'
        }
    ].forEach(({hasLambda}) => {
        it(`exports ${hasLambda}`, () => {
            expect(!!(lambdas as {[_: string]: unknown})[hasLambda]).toEqual(true);
        });
    });
});

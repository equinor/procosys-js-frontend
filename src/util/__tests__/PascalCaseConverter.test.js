import PascalCaseConverter from '../PascalCaseConverter';

describe('util/PascalCaseConverter', () => {


    it('Should convert string Pascal Case to camelCase', () => {
        const result = PascalCaseConverter.stringToCamelCase('DarthVader');

        expect(result).toEqual('darthVader');
    });

    it('Should convert object keys with Pascal Case to camelCase', () => {
        const objectUnderTest = {
            Hello: 'World'
        };
        const result = PascalCaseConverter.objectToCamelCase(objectUnderTest);

        expect(result).toEqual({hello: 'World'});
    });

    it('Should convert array of objects with Pascal Case keys to camelCase', () => {
        const objectUnderTest = [{
            Hello: 'World',
            Nested: [{
                IsNested: true
            }]
        }];
        const result = PascalCaseConverter.objectToCamelCase(objectUnderTest);

        const expectedResult = [{
            hello: 'World',
            nested: [{
                isNested: true
            }]
        }];

        expect(result).toEqual(expectedResult);
    });
});

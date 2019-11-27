
const isObject = function (subject: Record<string, any>): boolean {
    return subject === Object(subject) && !Array.isArray(subject) && typeof subject !== 'function';
};


const stringToCamelCase = (input: string): string => {
    return input[0].toLowerCase() + input.substr(1, input.length);
};

const objectToCamelCase = (input: Record<string, any>): Record<string, any> => {

    if (isObject(input)) {
        const n: Record<string, any> = {};

        Object.keys(input)
            .forEach((k) => {
                n[stringToCamelCase(k)] = objectToCamelCase(input[k]);
            });

        return n;
    } else if (Array.isArray(input)) {
        return input.map((i) => {
            return objectToCamelCase(i);
        });
    }

    return input;

};

export default {
    stringToCamelCase,
    objectToCamelCase
};

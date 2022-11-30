export const isOfType = <T>(
    varToBeChecked: unknown,
    propertyToCheckFor: keyof T
): varToBeChecked is T => {
    return (varToBeChecked as T)[propertyToCheckFor] !== undefined;
};

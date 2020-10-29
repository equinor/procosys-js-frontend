class InvalidFileTypeException extends Error {};


const fileTypeValidator = (filePath: string): void => {
    const rejectedFileExtensions = /(\.exe|\.msi|\.dotm|\.docm|\.xlsm|\.xltm)$/i;
    const rejected = rejectedFileExtensions.exec(filePath);
    if (rejected) {
        throw new InvalidFileTypeException(`File type not accepted: '${rejected[0]}'`);
    };
};


export default fileTypeValidator;

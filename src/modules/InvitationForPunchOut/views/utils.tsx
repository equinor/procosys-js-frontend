

export const getFileTypeIconName = (fileName: string): string => {
    const ext = getFileExtension(fileName).toUpperCase();

    switch (ext) {
        case 'JPG':
        case 'JPEG':
        case 'PNG':
        case 'SVG':
            return 'image';
        case 'PDF':
            return 'file_description';
        case 'DOC':
        case 'DOCX':
            return 'microsoft_word';
        case 'XLS':
        case 'XLSX':
            return 'microsoft_excel';
        case 'PPT':
            return 'microsoft_powerpoint';
        default:
            return 'file';

    }
};

export const getFileExtension = (filename: string): string => {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

export const getFileName = (fullName: string): string => {
    return fullName.includes('.') ? (
        fullName.split('.').slice(0, -1).join('.')
    ) : (
        fullName
    );
};

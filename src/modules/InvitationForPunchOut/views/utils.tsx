import { Organization } from '../types';

export enum OrganizationsEnum {
    Commissioning = 'Commissioning',
    ConstructionCompany = 'ConstructionCompany',
    Contractor = 'Contractor',
    Operation = 'Operation',
    TechnicalIntegrity = 'TechnicalIntegrity',
    Supplier = 'Supplier',
    External = 'External',
};

const createOrganizationMap = (): Map<Organization, string> => {
    const orgMap = new Map<Organization, string>();
    orgMap.set(OrganizationsEnum.Commissioning, 'Commissioning');
    orgMap.set(OrganizationsEnum.ConstructionCompany, 'Construction company');
    orgMap.set(OrganizationsEnum.Contractor, 'Contractor');
    orgMap.set(OrganizationsEnum.Operation, 'Operation');
    orgMap.set(OrganizationsEnum.TechnicalIntegrity, 'Technical integrity');
    orgMap.set(OrganizationsEnum.Supplier, 'Supplier');
    orgMap.set(OrganizationsEnum.External, 'Guest user (external)');
    return orgMap;
};

export const OrganizationMap = createOrganizationMap();


export const getFileTypeIconName = (fileName: string): string => {
    const ext = getFileExtension(fileName).toUpperCase();

    switch (ext) {
        case 'JPG':
        case 'JPEG':
        case 'PNG':
        case 'SVG':
        case 'ICO':
            return 'image';
        case 'PDF':
            return 'file_description';
        case 'DOC':
        case 'DOCX':
            return 'microsoft_word';
        case 'XLS':
        case 'XLSX':
        case 'CSV':
            return 'microsoft_excel';
        case 'PPT':
        case 'PPTX':
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
    ) :
        (
            fullName
        );
};

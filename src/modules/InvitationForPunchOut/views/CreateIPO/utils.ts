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

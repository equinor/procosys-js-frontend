import { addHours, addMinutes } from 'date-fns';

import { Organization } from '../../types';

export enum OrganizationsEnum {
    Commissioning = 'Commissioning',
    ConstructionCompany = 'ConstructionCompany',
    Contractor = 'Contractor',
    Operation = 'Operation',
    TechnicalIntegrity = 'TechnicalIntegrity',
    Supplier = 'Supplier',
    External = 'External',
};

export enum ComponentName {
    CreateIPO = 'CreateIPO'
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

export const getEndTime = (date: Date): Date => {
    if (date.getHours() === 23) {
        const minutes = date.getMinutes();
        return addMinutes(date, 59 - minutes);
    } else {
        return addHours(date, 1);
    }
};

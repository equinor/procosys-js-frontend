import { Organization } from './types';

const createOrganizationMap = (): Map<Organization, string> => {
    const orgMap = new Map<Organization, string>();
    orgMap.set('Commissioning', 'Commissioning');
    orgMap.set('ConstructionCompany', 'Constr. company');
    orgMap.set('Contractor', 'Contractor');
    orgMap.set('Operation', 'Operation');
    orgMap.set('TechnicalIntegrity', 'Tech. integrity');
    orgMap.set('Supplier', 'Supplier');
    orgMap.set('External', 'External');
    return orgMap;
};


export const OrganizationMap = createOrganizationMap();

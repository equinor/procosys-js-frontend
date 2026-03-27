import { useCurrentPlant } from '@procosys/core/PlantContext';
import { PERMISSIONS } from './permissions';

type LibraryPreservationPermissions = {
  canCreate: boolean;
  canWrite: boolean;
  canDelete: boolean;
  canVoidUnvoid: boolean;
  insufficientPrivilegesTitle: string;
};

const useLibraryPreservationPermissions = (): LibraryPreservationPermissions => {
  const { permissions } = useCurrentPlant();

  return {
    canCreate: permissions.includes(PERMISSIONS.LIBRARY_PRESERVATION.CREATE),
    canWrite: permissions.includes(PERMISSIONS.LIBRARY_PRESERVATION.WRITE),
    canDelete: permissions.includes(PERMISSIONS.LIBRARY_PRESERVATION.DELETE),
    canVoidUnvoid: permissions.includes(PERMISSIONS.LIBRARY_PRESERVATION.VOID_UNVOID),
    insufficientPrivilegesTitle: 'You do not have sufficient privilege to perform this action',
  };
};

export { useLibraryPreservationPermissions };

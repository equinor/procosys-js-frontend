import { Container, DropdownItem } from './index.style';
import React, { useEffect, useState } from 'react';

import { Canceler } from '@procosys/http/HttpClient';
import Dropdown  from '@procosys/components/Dropdown';
import { SelectItem } from '@procosys/components/Select';
import Spinner from '@procosys/components/Spinner';
import { rolePersonParamType } from '..';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { useInvitationForPunchOutContext } from '@procosys/modules/InvitationForPunchOut/context/InvitationForPunchOutContext';

interface RoleSelectorProps {
    functionalRoleCode: string;
    onChange: (filterParam: rolePersonParamType, value: string) => void;
}

const RoleSelector = ({
    functionalRoleCode,
    onChange,
}: RoleSelectorProps): JSX.Element => {
    const [availableRoles, setAvailableRoles] = useState<SelectItem[]>([]);
    const { apiClient } = useInvitationForPunchOutContext();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedRole, setSelectedRole] = useState<SelectItem>();


    useEffect(() => {
        setSelectedRole(availableRoles.find(p => p.value === functionalRoleCode));
    }, [functionalRoleCode]);

    /**
     * Fetch available functional roles 
     */
    useEffect(() => {
        let requestCanceler: Canceler;
        setIsLoading(true);
        try {
            (async (): Promise<void> => {
                const functionalRoles = await apiClient.getFunctionalRolesAsync()
                    .then(roles => roles.map((role): SelectItem => {
                        return {
                            text: role.code,
                            value: role.code
                        };
                    }));
                setAvailableRoles(functionalRoles);
                setIsLoading(false);
            })();
            return (): void => requestCanceler && requestCanceler();
        } catch (error) {
            showSnackbarNotification(error.message);
            setIsLoading(false);
        }
    }, []);



    const setRole = (event: React.MouseEvent, roleIndex: number): void => {
        event.preventDefault();
        const role = availableRoles[roleIndex];
        if (role) {
            onChange('functionalRoleCode', role.value);
        }
    };


    return (<Container>
        <Dropdown
            label={'Role'}
            maxHeight='300px'
            variant='form'
            text={selectedRole ? selectedRole.text : 'Select'}
        >
            {isLoading && <div style={{ margin: 'calc(var(--grid-unit))' }} ><Spinner medium /></div>}
            {!isLoading &&
                                            availableRoles.map((role, i) => {
                                                return (
                                                    <DropdownItem
                                                        key={i}
                                                        onClick={(event: React.MouseEvent): void =>
                                                            setRole(event, i)
                                                        }
                                                    >
                                                        <div>{role.text}</div>
                                                    </DropdownItem>
                                                );
                                            })}
        </Dropdown>
    </Container>);
};

export default RoleSelector;



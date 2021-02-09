import { ClearContainer, Container, DropdownItem } from './index.style';
import React, { useEffect, useState } from 'react';

import Dropdown  from '@procosys/components/Dropdown';
import { SelectItem } from '@procosys/components/Select';
import Spinner from '@procosys/components/Spinner';
import { Typography } from '@equinor/eds-core-react';
import { rolePersonParamType } from '..';

interface RoleSelectorProps {
    functionalRoleCode: string;
    onChange: (filterParam: rolePersonParamType, value: string) => void;
    roles: SelectItem[];
}

const RoleSelector = ({
    functionalRoleCode,
    onChange,
    roles
}: RoleSelectorProps): JSX.Element => {
    const [selectedRole, setSelectedRole] = useState<SelectItem>();


    useEffect(() => {
        setSelectedRole(roles.find(p => p.value === functionalRoleCode));
    }, [functionalRoleCode]);


    const setRole = (event: React.MouseEvent, roleIndex: number): void => {
        event.preventDefault();
        const role = roles[roleIndex];
        onChange('functionalRoleCode', role ? role.value : '');
    };


    return (<Container>
        <Dropdown
            label={'Role'}
            maxHeight='300px'
            variant='form'
            text={selectedRole ? selectedRole.text : 'Select'}
        >
            {roles.length < 1 && <div style={{ margin: 'calc(var(--grid-unit))' }} ><Spinner medium /></div>}
            {roles.length > 0 &&
                                            roles.map((role, i) => {
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
        <ClearContainer onClick={(e): void => setRole(e, -1)}>
            <Typography variant='meta'>Clear</Typography>
        </ClearContainer>
    </Container>);
};

export default RoleSelector;



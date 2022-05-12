import { Collapse, CollapseInfo } from '../index.style';
import React, { useState } from 'react';
import { FilterContainer } from './index.style';
import PersonSelector from '../PersonSelector';
import RoleSelector from '../RoleSelector';
import { SelectItem } from '@procosys/components/Select';
import { rolePersonParamType } from '..';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';

type SelectProps = {
    headerLabel: string;
    selectedItems: string[];
    onChange: (filterParam: rolePersonParamType, value: string) => void;
    icon: JSX.Element;
    roles: SelectItem[];
};

const SelectFilter = ({
    headerLabel,
    selectedItems,
    onChange,
    icon,
    roles,
}: SelectProps): JSX.Element => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <>
            <Collapse
                isExpanded={isExpanded}
                onClick={(): void => setIsExpanded((isExpanded) => !isExpanded)}
                data-testid="selectfilter-collapse"
                filterActive={!!selectedItems[0] || !!selectedItems[1]}
            >
                {icon}
                <CollapseInfo>{headerLabel}</CollapseInfo>
                {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </Collapse>
            {isExpanded && (
                <>
                    <FilterContainer>
                        <RoleSelector
                            onChange={onChange}
                            roles={roles}
                            functionalRoleCode={selectedItems[0]}
                        />
                    </FilterContainer>
                    <PersonSelector
                        onChange={onChange}
                        personOid={selectedItems[1]}
                    />
                </>
            )}
        </>
    );
};

export default SelectFilter;

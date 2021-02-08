import { Collapse, CollapseInfo } from '../index.style';
import React, { useState } from 'react';

import { FilterContainer } from './index.style';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import PersonSelector from '../PersonSelector';
import RoleSelector from '../RoleSelector';
import { rolePersonParamType } from '..';

type SelectProps = {
    headerLabel: string;
    selectedItems: string[];
    onChange: (filterParam: rolePersonParamType, value: string) => void;
    icon: JSX.Element;
}

const SelectFilter = ({headerLabel, selectedItems, onChange, icon}: SelectProps): JSX.Element => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <>
            <Collapse isExpanded={isExpanded} onClick={(): void => setIsExpanded((isExpanded) => !isExpanded)} data-testid="MultiSelectHeader" filterActive={!!selectedItems[0] || !!selectedItems[1]} >
                {icon}
                <CollapseInfo>
                    {headerLabel}
                </CollapseInfo>
                {
                    isExpanded
                        ? <KeyboardArrowUpIcon />
                        : <KeyboardArrowDownIcon />
                }
            </Collapse>
            {
                isExpanded && (
                    <>
                        <FilterContainer>
                            <RoleSelector onChange={onChange} functionalRoleCode={selectedItems[0]} />
                        </FilterContainer>
                        <PersonSelector onChange={onChange} personOid={selectedItems[1]} />
                    </>
                )
            }
        </>
    );
};


export default SelectFilter;

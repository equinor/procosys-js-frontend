import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import EdsIcon from '@procosys/components/EdsIcon';
import React, { ChangeEvent, useState } from 'react';
import { ExpandedContainer, ScopeFilterCheckbox } from './CheckboxFilter.style';
import { CheckboxFilterValue, TagListFilterParamType } from './ScopeFilter';
import { Collapse, CollapseInfo } from './ScopeFilter.style';

interface CheckboxFilterProps {
    title: string;
    filterValues: CheckboxFilterValue[];
    itemsChecked: string[];
    tagListFilterParam: TagListFilterParamType;
    onCheckboxFilterChange: (
        tagListFilterParam: TagListFilterParamType,
        id: string,
        checked: boolean
    ) => void;
    icon: string;
}

const CheckboxFilter = ({
    title,
    filterValues = [],
    tagListFilterParam,
    itemsChecked,
    onCheckboxFilterChange,
    icon,
}: CheckboxFilterProps): JSX.Element => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    return (
        <>
            <Collapse
                isExpanded={isExpanded}
                onClick={(): void => setIsExpanded(!isExpanded)}
                data-testid="CheckboxHeader"
                filterActive={itemsChecked.length > 0}
            >
                <EdsIcon name={icon} />
                <CollapseInfo>{title}</CollapseInfo>
                {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </Collapse>
            {isExpanded && (
                <ExpandedContainer>
                    {filterValues.map((value) => {
                        return (
                            <ScopeFilterCheckbox
                                key={value.title}
                                checked={itemsChecked.some((elementId) => {
                                    return (
                                        String(value.id) === String(elementId)
                                    );
                                })}
                                onChange={(
                                    e: ChangeEvent<HTMLInputElement>
                                ): void => {
                                    onCheckboxFilterChange(
                                        tagListFilterParam,
                                        String(value.id),
                                        e.target.checked
                                    );
                                }}
                                label={value.title}
                            ></ScopeFilterCheckbox>
                        );
                    })}
                </ExpandedContainer>
            )}
        </>
    );
};

export default CheckboxFilter;

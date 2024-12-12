import React, { ChangeEvent, useState } from 'react';
import {
    Collapse,
    CollapseInfo,
    ScopeFilterCheckbox,
} from './ScopeFilter.style';
import { ExpandedContainer } from './CheckboxFilter.style';
import { Typography } from '@equinor/eds-core-react';
import { CheckboxFilterValue, TagListFilterParamType } from './ScopeFilter';
import EdsIcon from '@procosys/components/EdsIcon';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { Checkbox } from '@equinor/eds-core-react';

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
                                    console.log(
                                        'CheckboxFilter.tsx: ',
                                        tagListFilterParam,
                                        value.id,
                                        e.target.checked
                                    );
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

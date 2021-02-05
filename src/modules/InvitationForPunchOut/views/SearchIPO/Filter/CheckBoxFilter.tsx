import { CheckboxFilterValue, filterParamType } from './index';
import { Collapse, CollapseInfo, ExpandedContainer, Section } from './index.style';
import React, { useState } from 'react';

import Checkbox from '../../../../../components/Checkbox';
import EdsIcon from '@procosys/components/EdsIcon';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { Typography } from '@equinor/eds-core-react';

interface CheckboxFilterProps {
    title: string;
    filterValues: CheckboxFilterValue[];
    itemsChecked: string[];
    filterParam: filterParamType;
    onCheckboxFilterChange: (tagListFilterParam: filterParamType, id: string, checked: boolean) => void;
    icon: string;
}

const CheckboxFilter = ({
    title,
    filterValues = [],
    filterParam,
    itemsChecked,
    onCheckboxFilterChange,
    icon
}: CheckboxFilterProps): JSX.Element => {

    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    return (
        <>
            <Collapse isExpanded={isExpanded} onClick={(): void => setIsExpanded(!isExpanded)} data-testid="CheckboxHeader" filterActive={itemsChecked.length > 0} >
                <EdsIcon name={icon} />
                <CollapseInfo >
                    {title}
                </CollapseInfo>
                {
                    isExpanded
                        ? <KeyboardArrowUpIcon />
                        : <KeyboardArrowDownIcon />
                }
            </Collapse>
            {
                isExpanded && (
                    <ExpandedContainer>
                        {
                            filterValues.map(value => {
                                return (<Section key={value.id}>
                                    <Checkbox
                                        checked={itemsChecked.some(elementId => {
                                            return String(value.id) === String(elementId);
                                        })}
                                        onChange={(checked: boolean): void => {
                                            onCheckboxFilterChange(filterParam, String(value.id), checked);
                                        }}
                                    >
                                        <Typography variant='body_long'>{value.title}</Typography>
                                    </Checkbox>
                                </Section>);
                            })
                        }
                    </ExpandedContainer>
                )
            }
        </>
    );
};

export default CheckboxFilter;


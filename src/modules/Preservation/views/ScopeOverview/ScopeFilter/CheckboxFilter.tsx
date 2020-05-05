import React, { useState } from 'react';
import { Collapse, CollapseInfo, Section } from './ScopeFilter.style';
import { Typography } from '@equinor/eds-core-react';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Checkbox from '../../../../../components/Checkbox';
import { CheckboxFilterValue, TagListFilterParamType } from './ScopeFilter';

interface CheckboxFilterProps {
    title: string;
    filterValues: CheckboxFilterValue[];
    itemsChecked: string[];
    tagListFilterParam: TagListFilterParamType;
    onCheckboxFilterChange: (tagListFilterParam: TagListFilterParamType, id: string, checked: boolean) => void;
}

const CheckboxFilter = ({
    title,
    filterValues = [],
    tagListFilterParam,
    itemsChecked,
    onCheckboxFilterChange,
}: CheckboxFilterProps): JSX.Element => {

    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    return (
        <>
            <Collapse isExpanded={isExpanded} onClick={(): void => setIsExpanded(!isExpanded)} data-testid="CheckboxHeader" >
                <CollapseInfo>
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
                    <>
                        {
                            filterValues.map(value => {
                                return (<Section key={value.id}>
                                    <Checkbox
                                        checked={itemsChecked.some(elementId => {
                                            return value.id === elementId;
                                        })}
                                        onChange={(checked: boolean): void => {
                                            onCheckboxFilterChange(tagListFilterParam, value.id, checked);
                                        }}
                                    >
                                        <Typography variant='body_long'>{value.title}</Typography>
                                    </Checkbox>
                                </Section>);
                            })
                        }
                    </>
                )
            }
        </>
    );
};

export default CheckboxFilter;

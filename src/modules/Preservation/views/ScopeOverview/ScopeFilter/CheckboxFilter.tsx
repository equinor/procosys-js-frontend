import React, { useState } from 'react';
import { Collapse, CollapseInfo, Section } from './ScopeFilter.style';
import { Typography } from '@equinor/eds-core-react';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Checkbox from '../../../../../components/Checkbox';
import { CheckboxFilterValue, TagListFilterParamType } from './ScopeFilter';
import { TagListFilter } from '../types';



interface CheckboxFilterProps {
    title: string;
    filterValues: CheckboxFilterValue[];
    checkedIds: number[];
    tagListFilterParam: TagListFilterParamType;
    tagListFilter: TagListFilter;
    setTagListFilter: any;
}

const CheckboxFilter = ({
    title,
    filterValues,
    checkedIds,
    tagListFilterParam,
    tagListFilter,
    setTagListFilter
}: CheckboxFilterProps): JSX.Element => {

    const [isExpanded, setIsExpanded] = useState<boolean>(false);


    const updateFilter = (id: number, checked: boolean): void => {
        const newTagListFilter: TagListFilter = { ...tagListFilter };
        if (checked) {
            newTagListFilter[tagListFilterParam] = [...checkedIds, id];
        } else {
            newTagListFilter[tagListFilterParam] = [...checkedIds.filter(item => item != id)];
        }
        setTagListFilter(newTagListFilter);

    };

    return (
        <>
            <Collapse isExpanded={isExpanded} onClick={(): void => setIsExpanded(!isExpanded)}>
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
                            filterValues?.map(value => {
                                return (<Section key={value.id}>
                                    <Checkbox
                                        checked={checkedIds.some(elementId => {
                                            return value.id === elementId;
                                        })}
                                        onChange={(checked: boolean): void => {
                                            updateFilter(value.id, checked);
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
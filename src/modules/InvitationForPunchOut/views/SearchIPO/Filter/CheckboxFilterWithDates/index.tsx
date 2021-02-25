import { CheckboxFilterValue, dateFilterParamType, filterParamType } from '../index';
import { CheckboxSection, DateField, DatesContainer } from './index.style';
import { Collapse, CollapseInfo } from '../index.style';
import React, { ChangeEvent, useState } from 'react';

import Checkbox from '../../../../../../components/Checkbox';
import EdsIcon from '@procosys/components/EdsIcon';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { Typography } from '@equinor/eds-core-react';
import { getFormattedDate } from '@procosys/core/services/DateService';

interface CheckboxFilterWithDatesProps {
    title: string;
    filterValues: CheckboxFilterValue[];
    itemsChecked: string[];
    filterParam: filterParamType;
    dateFields: CheckboxFilterValue[];
    dateValues: (Date|undefined)[];
    onDateChange: (filterParam: dateFilterParamType, value: Date) => void;
    onCheckboxFilterChange: (filterParam: filterParamType, id: string, checked: boolean) => void;
    icon: string;
}

const CheckboxFilterWithDates = ({
    title,
    filterValues = [],
    filterParam,
    itemsChecked,
    dateFields,
    dateValues,
    onDateChange,
    onCheckboxFilterChange,
    icon
}: CheckboxFilterWithDatesProps): JSX.Element => {

    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    return (
        <>
            <Collapse isExpanded={isExpanded} onClick={(): void => setIsExpanded(!isExpanded)} data-testid="checkbox-collapse" filterActive={itemsChecked.length > 0} >
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
                    <div>
                        {
                            filterValues.map(value => {
                                return (<CheckboxSection key={value.id}>
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
                                </CheckboxSection>);
                            })
                        }
                        <DatesContainer>
                            {
                                dateFields.map((value, index) => {
                                    const dateValue = dateValues[index];
                                    return (
                                        <DateField
                                            key={value.id}
                                            label={value.title}
                                            type='date'
                                            value={dateValue ? getFormattedDate(dateValue): ''}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => onDateChange(value.id as dateFilterParamType, new Date(event.target.value))}
                                        />
                                    );
                                })
                            }

                        </DatesContainer>
                    </div>
                )
            }
        </>
    );
};

export default CheckboxFilterWithDates;


import {
    CheckboxFilterValue,
    dateFilterParamType,
    filterParamType,
} from '../InvitationsFilter';
import { CheckboxSection, DateField, DatesContainer } from './index.style';
import { Collapse, CollapseInfo } from '../index.style';
import React, { ChangeEvent, useState } from 'react';

import Checkbox from '../../../../../../components/Checkbox';
import EdsIcon from '@procosys/components/EdsIcon';
import { Typography } from '@equinor/eds-core-react';
import { formatForDatePicker } from '@procosys/core/services/DateService';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import { Label } from '@equinor/eds-core-react';

interface CheckboxFilterWithDatesProps {
    title: string;
    filterValues: CheckboxFilterValue[];
    itemsChecked: any[];
    filterParam: filterParamType;
    dateFields: CheckboxFilterValue[];
    dateValues: (Date | undefined)[];
    onDateChange: (filterParam: dateFilterParamType, value: string) => void;
    onCheckboxFilterChange: (
        filterParam: filterParamType,
        id: string,
        checked: boolean
    ) => void;
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
    icon,
}: CheckboxFilterWithDatesProps): JSX.Element => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const filterActive =
        itemsChecked.find((item) => item !== undefined) !== undefined;

    return (
        <>
            <Collapse
                isExpanded={isExpanded}
                onClick={(): void => setIsExpanded(!isExpanded)}
                data-testid="checkbox-collapse"
                filterActive={filterActive}
            >
                <EdsIcon name={icon} />
                <CollapseInfo>{title}</CollapseInfo>
                {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </Collapse>
            {isExpanded && (
                <div>
                    {filterValues.map((value) => {
                        return (
                            <CheckboxSection key={value.id}>
                                <Checkbox
                                    checked={itemsChecked.some((elementId) => {
                                        return (
                                            String(value.id) ===
                                            String(elementId)
                                        );
                                    })}
                                    onChange={(checked: boolean): void => {
                                        onCheckboxFilterChange(
                                            filterParam,
                                            String(value.id),
                                            checked
                                        );
                                    }}
                                >
                                    <Typography variant="body_long">
                                        {value.title}
                                    </Typography>
                                </Checkbox>
                            </CheckboxSection>
                        );
                    })}
                    <DatesContainer>
                        {dateFields.map((value, index) => {
                            const dateValue = dateValues[index];
                            return (
                                <div key={value.id}>
                                    <Label label={value.title} />
                                    <DateField
                                        InputProps={{
                                            inputProps: { max: '2121-01-01' },
                                        }}
                                        type="date"
                                        value={formatForDatePicker(
                                            dateValue,
                                            'yyyy-MM-dd'
                                        )}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        onChange={(
                                            event: ChangeEvent<
                                                | HTMLInputElement
                                                | HTMLTextAreaElement
                                            >
                                        ): void =>
                                            onDateChange(
                                                value.id as dateFilterParamType,
                                                event.target.value
                                            )
                                        }
                                    />
                                </div>
                            );
                        })}
                    </DatesContainer>
                </div>
            )}
        </>
    );
};

export default CheckboxFilterWithDates;

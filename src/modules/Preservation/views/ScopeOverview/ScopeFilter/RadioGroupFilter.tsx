import React, {useState} from 'react';
import { CollapseInfo, Collapse } from './ScopeFilter.style';
import { RadioGroup, Radio, FormControlLabel } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';


interface Option {
    title: string;
    value: string;
}

interface RadioGroupFilterProps {
    options: Option[];
    value: string | null;
    onChange: (value: string) => void;
}

const RadioGroupFilter = ({options, value, onChange}: RadioGroupFilterProps): JSX.Element => {

    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    return (
        <>
            <Collapse isExpanded={isExpanded} onClick={(): void => setIsExpanded((isExpanded) => !isExpanded)} data-testid="PreservationStatusHeader">
                <CollapseInfo>
                    Preservation Status
                </CollapseInfo>
                {
                    isExpanded
                        ? <KeyboardArrowUpIcon />
                        : <KeyboardArrowDownIcon />
                }
            </Collapse>
            {
                isExpanded && (
                    <RadioGroup aria-label="Preservation Status" name="preservationStatus" value={value} onChange={(e, newValue): void => onChange(newValue)}>
                        {options.map(option => (<FormControlLabel key={option.value} value={option.value} label={option.title} control={<Radio />} />))}
                    </RadioGroup>
                )
            }
        </>
    );



};

export default RadioGroupFilter;

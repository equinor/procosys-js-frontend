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
    label?: string;
}

const RadioGroupFilter = ({options,value, onChange, label = ''}: RadioGroupFilterProps): JSX.Element => {

    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    const [inputName] = useState(() => {
        if (label) return label.toLowerCase().replace(' ', '_');
        return `RadioGroup_${Date.now()}`;
    });

    const onSelectionChanged = (e: React.ChangeEvent<HTMLInputElement>, newValue: string): void => {
        onChange(newValue);
    };

    return (
        <>
            <Collapse isExpanded={isExpanded} onClick={(): void => setIsExpanded((isExpanded) => !isExpanded)} data-testid="RadioGroupHeader">
                <CollapseInfo>
                    {label}
                </CollapseInfo>
                {
                    isExpanded
                        ? <KeyboardArrowUpIcon />
                        : <KeyboardArrowDownIcon />
                }
            </Collapse>
            {
                isExpanded && (
                    <RadioGroup value={value} name={inputName} onChange={onSelectionChanged}>
                        {options.map(option => (<FormControlLabel key={option.value} value={option.value} label={option.title} control={<Radio />} />))}
                    </RadioGroup>
                )
            }
        </>
    );



};

export default RadioGroupFilter;

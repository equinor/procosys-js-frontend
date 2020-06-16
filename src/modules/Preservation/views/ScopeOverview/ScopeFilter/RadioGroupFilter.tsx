import React, {useState, useEffect} from 'react';
import { CollapseInfo, Collapse, ExpandedContainer } from './ScopeFilter.style';
import { RadioGroup, Radio, FormControlLabel } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import EdsIcon from '@procosys/components/EdsIcon';

interface Option {
    title: string;
    value: string;
    default?: boolean;
}

interface RadioGroupFilterProps {
    options: Option[];
    value: string | null;
    onChange: (value: string) => void;
    label?: string;
    icon: string;
}

const RadioGroupFilter = ({options, value, onChange, label = '', icon}: RadioGroupFilterProps): JSX.Element => {

    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [isActiveFilter, setIsActiveFilter] = useState<boolean>(false);

    const [inputName] = useState(() => {
        if (label) return label.toLowerCase().replace(' ', '_');
        return `RadioGroup_${Date.now()}`;
    });

    const onSelectionChanged = (e: React.ChangeEvent<HTMLInputElement>, newValue: string): void => {
        onChange(newValue);
    };

    useEffect(() => {
        setIsActiveFilter(value && value != 'no-filter' ? true : false);
    }, [value]);

    return (
        <>
            <Collapse isExpanded={isExpanded} onClick={(): void => setIsExpanded((isExpanded) => !isExpanded)} data-testid="RadioGroupHeader" filterActive={isActiveFilter}>
                <EdsIcon name={icon} />
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
                    <ExpandedContainer>
                        <RadioGroup value={value} name={inputName} onChange={onSelectionChanged}>
                            {options.map(option => (<FormControlLabel key={option.value} value={option.value} label={option.title} checked={((!value && option.default) || option.value === value)} control={<Radio />} />))}
                        </RadioGroup>
                    </ExpandedContainer>
                )
            }
        </>
    );
};

export default RadioGroupFilter;

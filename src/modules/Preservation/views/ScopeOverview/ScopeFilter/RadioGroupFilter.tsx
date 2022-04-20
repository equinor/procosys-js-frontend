import React, { useState, useEffect } from 'react';
import { CollapseInfo, Collapse, ExpandedContainer } from './ScopeFilter.style';
import EdsIcon from '@procosys/components/EdsIcon';
import { Radio } from '@equinor/eds-core-react';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import { RadioGroup, FormControlLabel } from '@mui/material';

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

const RadioGroupFilter = ({
    options,
    value,
    onChange,
    label = '',
    icon,
}: RadioGroupFilterProps): JSX.Element => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [isActiveFilter, setIsActiveFilter] = useState<boolean>(false);

    const [inputName] = useState(() => {
        if (label) return label.toLowerCase().replace(' ', '_');
        return `RadioGroup_${Date.now()}`;
    });

    const onSelectionChanged = (
        e: React.ChangeEvent<HTMLInputElement>,
        newValue: string
    ): void => {
        onChange(newValue);
    };

    useEffect(() => {
        const option = options.find((o) => o.value == value);
        if (option) {
            setIsActiveFilter(option.default ? false : true);
        } else {
            setIsActiveFilter(false);
        }
    }, [value]);

    return (
        <>
            <Collapse
                isExpanded={isExpanded}
                onClick={(): void => setIsExpanded((isExpanded) => !isExpanded)}
                data-testid="RadioGroupHeader"
                filterActive={isActiveFilter}
            >
                <EdsIcon name={icon} />
                <CollapseInfo>{label}</CollapseInfo>
                {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </Collapse>
            {isExpanded && (
                <ExpandedContainer>
                    <RadioGroup
                        value={value}
                        name={inputName}
                        onChange={onSelectionChanged}
                    >
                        {options.map((option) => (
                            <FormControlLabel
                                key={option.value}
                                value={option.value}
                                label={option.title}
                                checked={
                                    (!value && option.default) ||
                                    option.value === value
                                }
                                control={<Radio />}
                            />
                        ))}
                    </RadioGroup>
                </ExpandedContainer>
            )}
        </>
    );
};

export default RadioGroupFilter;

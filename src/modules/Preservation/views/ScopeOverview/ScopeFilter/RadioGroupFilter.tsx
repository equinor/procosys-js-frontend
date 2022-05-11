import React, { useState, useEffect } from 'react';
import { CollapseInfo, Collapse, ExpandedContainer } from './ScopeFilter.style';
import EdsIcon from '@procosys/components/EdsIcon';
import { Radio } from '@equinor/eds-core-react';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import styled from 'styled-components';

export const UnstyledList = styled.ul`
    margin: 0;
    padding: 0;
    list-style-type: none;
`;
interface Option {
    title: string;
    value: string | null;
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

    const onSelectionChanged = (
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        onChange(e.target.value);
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
                    <UnstyledList>
                        {options.map((option) => (
                            <li key={option.value}>
                                <Radio
                                    label={option.title}
                                    value={option.value}
                                    checked={
                                        (!value && option.default) ||
                                        value === option.value
                                    }
                                    onChange={onSelectionChanged}
                                />
                            </li>
                        ))}
                    </UnstyledList>
                </ExpandedContainer>
            )}
        </>
    );
};

export default RadioGroupFilter;

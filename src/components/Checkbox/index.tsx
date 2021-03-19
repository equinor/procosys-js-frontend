import React, { ReactNode } from 'react';
import { Container, CheckmarkWrapper } from './style';
import EdsIcon from '../EdsIcon';
import { tokens } from '@equinor/eds-tokens';

const disabledIcon = <EdsIcon name='checkbox_outline' color={tokens.colors.interactive.disabled__border.rgba} size={24} />;
const disabledCheckedIcon = <EdsIcon name='checkbox' color={tokens.colors.interactive.disabled__border.rgba} size={24} />;
const checkboxIcon = <EdsIcon name='checkbox_outline' color={tokens.colors.interactive.primary__resting.rgba} size={24} />;
const checkedCheckboxIcon = <EdsIcon name='checkbox' color={tokens.colors.interactive.primary__resting.rgba} size={24} />;

interface CheckboxProps {
    children?: ReactNode;
    onChange?: (checked: boolean) => void;
    checked?: boolean;
    disabled?: boolean;
    heightInGridUnits?: number
}

const Checkbox = ({
    children,
    onChange,
    checked = false,
    disabled = false,
    heightInGridUnits = 6
}: CheckboxProps): JSX.Element => {

    const iconType = disabled?
        checked? disabledCheckedIcon : disabledIcon
        : checked? checkedCheckboxIcon: checkboxIcon;

    const handleOnChange = (event: React.FormEvent<HTMLInputElement>): void => {
        onChange && onChange(event.currentTarget.checked);
    };

    return (
        <Container disabled={disabled}>
            <input
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={handleOnChange}
            />
            <CheckmarkWrapper className="checkmarkWrapper" size={heightInGridUnits.toString()}>
                {iconType}
            </CheckmarkWrapper>
            {children}
        </Container>
    );
};

export default Checkbox;
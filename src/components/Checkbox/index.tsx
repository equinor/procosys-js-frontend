import React, { ReactNode } from 'react';

import { Container, Checkmark } from './style';

interface CheckboxProps {
    children?: ReactNode;
    onChange?: (checked: boolean) => void;
    checked?: boolean;
    disabled?: boolean;
}

const Checkbox = ({
    children,
    onChange,
    checked = false,
    disabled = false
}: CheckboxProps): JSX.Element => {

    const handleOnChange = (event: React.FormEvent<HTMLInputElement>): void => {
        onChange && onChange(event.currentTarget.checked);
    };

    return (
        <Container disabled={disabled}>
            {children}
            <input
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={handleOnChange}
            />
            <Checkmark className="checkmark" disabled={disabled} checked={checked} />
        </Container>
    );
};

export default Checkbox;
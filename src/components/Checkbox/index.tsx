import React, { ReactNode } from 'react';

import { Container, Checkmark } from './style';

interface CheckboxProps {
    children?: ReactNode;
    checked?: boolean;
    disabled?: boolean;
}

const Checkbox = ({
    children,
    checked = false,
    disabled = false
}: CheckboxProps): JSX.Element => {
    return (
        <Container disabled={disabled}>
            { children }
            <input type="checkbox" defaultChecked={checked} disabled={disabled} />
            <Checkmark className="checkmark" disabled={disabled} />
        </Container>
    );
};

export default Checkbox;
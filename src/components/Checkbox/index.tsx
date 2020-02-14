import React, { ReactNode } from 'react';

import { Container, Checkmark } from './style';

interface CheckboxProps {
    children?: ReactNode;
    checked?: boolean;
}

const Checkbox = ({
    children,
    checked = false
}: CheckboxProps): JSX.Element => {
    return (
        <Container>
            { children }
            <input type="checkbox" defaultChecked={checked} />
            <Checkmark className="checkmark" />
        </Container>
    );
};

export default Checkbox;
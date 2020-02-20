import React, { ReactNode } from 'react';

import { Container, Checkmark } from './style';

interface CheckboxProps {
    children?: ReactNode;
    onChange?: (event: React.FormEvent<HTMLInputElement>) => void;
    checked?: boolean;
    disabled?: boolean;
}

const Checkbox = ({
    children,
    onChange,
    checked = false,
    disabled = false
}: CheckboxProps): JSX.Element => {
    return (
        <Container disabled={disabled}>
            { children }
            <input 
                type="checkbox" 
                defaultChecked={checked} 
                disabled={disabled} 
                onChange={onChange} 
            />
            <Checkmark className="checkmark" disabled={disabled} />
        </Container>
    );
};

export default Checkbox;
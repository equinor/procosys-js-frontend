import React from 'react';
import { StyledButton } from './style';

interface ButtonProps {
    primary?: boolean;
    disabled?: boolean;
    text: string;
}

const Button = (props: ButtonProps): JSX.Element => {
    return (
        <StyledButton {...props}>
            {props.text}
        </StyledButton>
    );
};

export default Button;
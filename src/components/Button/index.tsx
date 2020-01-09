import React from 'react';
import { StyledButton, StyledButtonLabel } from './style';

interface ButtonProps {
    primary?: boolean;
    disabled?: boolean;
    text: string;
}

const Button = (props: ButtonProps): JSX.Element => {
    return (
        <StyledButton {...props}>
            <StyledButtonLabel {...props}>
                {props.text}
            </StyledButtonLabel>
        </StyledButton>
    );
};

export default Button;
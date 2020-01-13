import React from 'react';
import { StyledButton } from './style';

interface ButtonProps {
    primary?: boolean;
    disabled?: boolean;
    text: string;
    onClick?: () => void;
}

const Button = (props: ButtonProps): JSX.Element => {
    return (
        <StyledButton onClick={props.onClick} {...props}>
            {props.text}
        </StyledButton>
    );
};

export default Button;
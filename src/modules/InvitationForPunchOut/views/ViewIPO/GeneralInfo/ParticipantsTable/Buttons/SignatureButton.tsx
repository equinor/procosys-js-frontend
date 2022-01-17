import { Button } from '@equinor/eds-core-react';
import React from 'react';

interface SignatureButtonProps {
    name: string;
    onClick: () => Promise<void>;
    disabled: boolean;
}

const SignatureButton = ({
    name,
    onClick,
    disabled,
}: SignatureButtonProps): JSX.Element => {
    return (
        <Button onClick={onClick} disabled={disabled}>
            {name}
        </Button>
    );
};

export default SignatureButton;

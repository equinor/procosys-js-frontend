import { Button } from '@equinor/eds-core-react';
import React from 'react';

interface SignatureButtonProps {
    name: string;
    onClick: () => void;
}

const SignatureButton = ({
    name,
    onClick,
}: SignatureButtonProps): JSX.Element => {
    return <Button onClick={onClick}>{name}</Button>;
};

export default SignatureButton;

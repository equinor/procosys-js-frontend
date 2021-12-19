import { Button } from '@equinor/eds-core-react';
import React from 'react';
import CustomTooltip from '../CustomTooltip';

interface SignatureButtonWithTooltipProps {
    name: string;
    tooltip: JSX.Element;
    onClick: () => void;
}

const SignatureButtonWithTooltip = ({
    name,
    tooltip,
    onClick,
}: SignatureButtonWithTooltipProps): JSX.Element => {
    return (
        <CustomTooltip title={tooltip} arrow>
            <span>
                <Button onClick={onClick}>{name}</Button>
            </span>
        </CustomTooltip>
    );
};

export default SignatureButtonWithTooltip;

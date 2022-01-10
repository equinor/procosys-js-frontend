import { Button } from '@equinor/eds-core-react';
import React from 'react';
import CustomTooltip from '../CustomTooltip';

interface SignatureButtonWithTooltipProps {
    name: string;
    tooltip: JSX.Element;
    onClick: () => void;
    disabled: boolean;
}

const SignatureButtonWithTooltip = ({
    name,
    tooltip,
    onClick,
    disabled,
}: SignatureButtonWithTooltipProps): JSX.Element => {
    return (
        <CustomTooltip title={tooltip} arrow>
            <span>
                <Button onClick={onClick} disabled={disabled}>
                    {name}
                </Button>
            </span>
        </CustomTooltip>
    );
};

export default SignatureButtonWithTooltip;

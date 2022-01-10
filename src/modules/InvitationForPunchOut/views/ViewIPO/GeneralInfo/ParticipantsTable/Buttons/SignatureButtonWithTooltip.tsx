import { Button } from '@equinor/eds-core-react';
import React, { useEffect, useState } from 'react';
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
    const [show, setShow] = useState<boolean>(false);

    useEffect(() => {
        if (disabled) setShow(false);
    }, [disabled]);

    return (
        <CustomTooltip
            title={tooltip}
            open={show}
            disableHoverListener
            onMouseEnter={(): void => (disabled ? undefined : setShow(true))}
            onMouseLeave={(): void => setShow(false)}
            arrow
        >
            <span>
                <Button onClick={onClick} disabled={disabled}>
                    {name}
                </Button>
            </span>
        </CustomTooltip>
    );
};

export default SignatureButtonWithTooltip;

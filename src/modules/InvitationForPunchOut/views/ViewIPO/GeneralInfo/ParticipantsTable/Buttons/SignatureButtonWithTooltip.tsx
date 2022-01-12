import React, { useEffect, useState } from 'react';
import CustomTooltip from '../CustomTooltip';
import SignatureButton from './SignatureButton';

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
                <SignatureButton
                    name={name}
                    onClick={onClick}
                    disabled={disabled}
                />
            </span>
        </CustomTooltip>
    );
};

export default SignatureButtonWithTooltip;

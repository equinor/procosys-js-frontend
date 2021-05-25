import React, { MouseEvent, useRef, useEffect, ReactNode } from 'react';

import { Overlay, FlyoutContainer } from './style';

export interface FlyoutProps {
    close: () => void;
    children: ReactNode;
    position?: string;
    minWidth?: string;
    maxWidth?: string;
}

const Flyout = ({
    position,
    minWidth,
    maxWidth,
    close,
    children
}: FlyoutProps): JSX.Element => {

    const flyoutRef = useRef<HTMLDivElement>(null);

    // fade-in effect
    useEffect((): void => {
        setTimeout((): void => {
            if (flyoutRef.current) {
                flyoutRef.current.style.opacity = '1';
            }
        }, 1);
    }, [flyoutRef]);

    return (
        <Overlay
            onMouseDown={close}>
            <FlyoutContainer
                position={position ? position : 'right'}
                minWidth={minWidth ? minWidth : '300px'}
                maxWidth={maxWidth ? maxWidth : '580px'}
                ref={flyoutRef}
                onMouseDown={(event: MouseEvent): void => event.stopPropagation()}>
                {children}
            </FlyoutContainer>
        </Overlay>
    );
};

export default Flyout;
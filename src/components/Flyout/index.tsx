import React, { MouseEvent, useRef, useEffect, ReactNode } from 'react';

import { Overlay, FlyoutContainer } from './style';

interface FlyoutProps {
    close: () => void;
    children: ReactNode;
}

const Flyout = ({
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
                ref={flyoutRef} 
                onMouseDown={(event: MouseEvent): void => event.stopPropagation()}>
                {children}
            </FlyoutContainer>
        </Overlay>
    );
};

export default Flyout;
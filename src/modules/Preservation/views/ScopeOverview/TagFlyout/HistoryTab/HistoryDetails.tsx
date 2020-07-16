import React, { MouseEvent, ReactNode } from 'react';
import { Overlay, Container, Details } from './HistoryDetails.style';

interface HistoryDetailsProps {
    close: () => void;
    children: ReactNode;
}

const HistoryDetails = ({
    close,
    children
}: HistoryDetailsProps): JSX.Element => {
    return (
        <Overlay onMouseDown={close}>
            <Container onMouseDown={(event: MouseEvent): void => event.stopPropagation()}>
                <Details>
                    {children}
                </Details>
            </Container>            
        </Overlay>
    );
};

export default HistoryDetails;

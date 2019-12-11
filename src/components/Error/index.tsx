import {Container} from './style';
import React from 'react';
import { Warning } from '../../assets/icons';

type ErrorProps = {
    title?: string;
    large?: boolean;
    medium?: boolean;
}

/**
 *
 * @param title Text to display with loading indicator
 */
const Error = ({title, large = false, medium = false}: ErrorProps): JSX.Element => {
    let size = '24px';

    size = medium && '48px' || size;
    size = large && '72px' || size;
    return (
        <Container>
            <img src={Warning} width={size} />
            {(<h1>{title || 'Unknown Error'}</h1>)}
        </Container>
    );
};

export default Error;

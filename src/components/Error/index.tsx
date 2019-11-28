import {Container} from './style';
import React from 'react';

type ErrorProps = {
    title?: string;
}

/**
 *
 * @param title Text to display with loading indicator
 */
const Error = (props: ErrorProps): JSX.Element => {
    return (
        <Container>
            {(<h1>{props.title || 'Unknown Error'}</h1>)}
        </Container>
    );
};

export default Error;

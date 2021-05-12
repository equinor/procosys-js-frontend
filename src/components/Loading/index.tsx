import { Container } from './style';
import React from 'react';
import Spinner from '../../components/Spinner';
import { Typography } from '@equinor/eds-core-react';

export type LoadingProps = {
    title?: string;
    variant?: string;
}

/**
 *
 * @param title Text to display with loading indicator
 */
const Loading = (props: LoadingProps): JSX.Element => {
    return (
        <Container>
            <Spinner large />
            {props.title && (<Typography variant={props.variant || 'h1'}>{props.title}</Typography>)}
        </Container>
    );
};

export default Loading;

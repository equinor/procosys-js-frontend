import {Container} from './style';
import React from 'react';
import Spinner from '../../components/Spinner';

type LoadingProps = {
    title?: string;
}

/**
 *
 * @param title Text to display with loading indicator
 */
const Loading = (props: LoadingProps): JSX.Element => {
    return (
        <Container>
            <Spinner large />
            {props.title && (<h1>{props.title}</h1>)}
        </Container>
    );
};

export default Loading;

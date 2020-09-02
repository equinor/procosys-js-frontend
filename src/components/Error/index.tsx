import {Container} from './style';
import React from 'react';
import WarningOutlinedIcon from '@material-ui/icons/WarningOutlined';

type ErrorProps = {
    title?: string;
    large?: boolean;
    medium?: boolean;
}

type size = 'inherit' | 'default' | 'small' | 'large';

/**
 *
 * @param title Text to display with loading indicator
 */
const Error = ({title, large = false, medium = false}: ErrorProps): JSX.Element => {
    let size: size = 'small';

    size = medium && 'default' || size;
    size = large && 'large' || size;
    return (
        <Container>
            <WarningOutlinedIcon fontSize={size} />

            {(<h1>{title || 'Unknown error'}</h1>)}
        </Container>
    );
};

export default Error;

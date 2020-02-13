import React from 'react';

import { Typography } from '@equinor/eds-core-react';
import { Container, Checkmark } from './style';

interface CheckboxProps {
    text?: string;
    textVariant?: string;
}

const Checkbox = ({
    text,
    textVariant
}: CheckboxProps): JSX.Element => {

    const getTextElement = (): JSX.Element | null => {
        if (text && textVariant) {
            return <Typography variant={textVariant}>{text}</Typography>;
        } else if (text) {
            return <span>{text}</span>;
        } 

        return null;
    };

    return (
        <Container>
            { getTextElement() }
            <input type="checkbox" />
            <Checkmark className="checkmark" />
        </Container>
    );
};

export default Checkbox;
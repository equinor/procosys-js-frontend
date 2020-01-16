import {Button} from '@equinor/eds-core-react';
import React from 'react';
import { Tag } from './types';

type SelectTagsProps = {
    nextStep: () => void;
    previousStep: () => void;
    tags: Tag[];
}

const SetTagProperties = (props: SelectTagsProps): JSX.Element => {

    return (
        <>
            <h1>Set Tag Properties</h1>
            <Button onClick={props.nextStep}>Next</Button>
            <Button onClick={props.previousStep}>Previous</Button>
        </>
    );

};

export default SetTagProperties;

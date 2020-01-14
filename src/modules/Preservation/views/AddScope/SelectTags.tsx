import {Button} from '@equinor/eds-core-react';
import React from 'react';
import { Tag } from './types';

type SelectTagsProps = {
    setSelectedTags: (tags: Array<Tag>) => void;
    nextStep: () => void;
}

const SelectTags = (props: SelectTagsProps): JSX.Element => {

    return (
        <>
            <h1>Select tags</h1>
            <Button onClick={props.nextStep}>Next</Button>
        </>
    );

};

export default SelectTags;

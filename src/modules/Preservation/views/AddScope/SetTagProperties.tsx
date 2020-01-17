import { Button } from '@equinor/eds-core-react';
import React from 'react';
import SelectInput from '../../../../components/SelectInput';
import { Tag } from './types';

type SelectTagsProps = {
    nextStep: () => void;
    previousStep: () => void;
    tags: Tag[];
};

const SetTagProperties = (props: SelectTagsProps): JSX.Element => {
    return (
        <>
            <h1>Set Tag Properties</h1>
            <SelectInput
                onChange={(data: any): void =>
                    console.log('Element changed: ', data)
                }
                data={[{ text: 'Option 1' }, { text: 'Option 2' }]}
                label={'Select Journey'}
            />
            <Button onClick={props.nextStep}>Next</Button>
            <Button onClick={props.previousStep}>Previous</Button>
        </>
    );
};

export default SetTagProperties;

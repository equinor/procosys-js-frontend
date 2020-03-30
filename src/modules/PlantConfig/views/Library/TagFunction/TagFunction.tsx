import React from 'react';


type TagFunctionProps = {
    tagFunctionId: string;
};


const TagFunction = (props: TagFunctionProps): JSX.Element => {

    //JUST IMPLEMENTED AS PROOF OF CONCEPT

    return (

        <div>
            <h3>TagFunction</h3>

            <div>
                {props.tagFunctionId}
            </div>

        </div>
    );
};


export default TagFunction;

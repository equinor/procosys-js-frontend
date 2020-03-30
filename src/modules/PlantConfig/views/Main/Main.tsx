import React from 'react';
import { Link } from 'react-router-dom';

const MainView = (): JSX.Element => {

    //THIS VIEW WILL NOT BE USED AS LONG AS THIS IMPL ONLY SUPPORT LIBRARY. INCLUDED AS PROOF OF CONCEPT. 

    return (
        <div>
            <h1>Plant Configuration</h1>
            <Link
                to={'/Library/root/NotSelected/_'}
            >
                Library
            </Link>
        </div>
    );
};


export default MainView;

import { Link } from 'react-router-dom';
import React from 'react';
import { Typography } from '@equinor/eds-core-react';

const MainView = (): JSX.Element => {
    //THIS VIEW WILL NOT BE USED AS LONG AS THIS IMPL ONLY SUPPORT LIBRARY. INCLUDED AS PROOF OF CONCEPT.

    return (
        <div>
            <Typography variant="h1">Plant Configuration</Typography>
            <Link to={'/Library/root/NotSelected/_'}>Library</Link>
        </div>
    );
};

export default MainView;

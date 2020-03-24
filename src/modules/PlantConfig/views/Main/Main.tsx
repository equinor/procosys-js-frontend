import React from 'react';
import { Link } from 'react-router-dom';


const MainView = (): JSX.Element => {
    //    const { url } = useRouteMatch();

    return (
        <div>
            <h1>Plant Configuration</h1>
            <Link
                to={'/Library/'}
            >
                Library
            </Link>
        </div>
    );
};


export default MainView;

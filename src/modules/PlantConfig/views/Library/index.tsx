
import React from 'react';
//import withAccessControl from '../../../../core/security/withAccessControl';
import LibraryComponentRouter from './LibraryComponentRouter';
import LibraryTreeView from './LibraryTreeView/LibraryView';

const Library = (): JSX.Element => {

    return (
        <div>
            <h1>Library</h1>
            <LibraryTreeView />
            <LibraryComponentRouter />

        </div >
    );
};

export default Library;

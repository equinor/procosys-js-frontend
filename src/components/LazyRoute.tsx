import React, { Suspense } from 'react';

import { RouteComponentProps } from 'react-router';

const LazyRoute = (CustomComponent: React.FC<any>, routeProps: RouteComponentProps<any>): JSX.Element => {
    return (
        <Suspense fallback={<div>Loading...</div>} >
            <CustomComponent {...routeProps} />
        </Suspense>
    );
};

export default LazyRoute;

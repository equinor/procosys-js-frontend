import React, { Suspense } from 'react';

import Loading from './Loading';
import { RouteComponentProps } from 'react-router-dom';

const LazyRoute = (
    CustomComponent: React.FC<any>,
    routeProps: RouteComponentProps<any>
): JSX.Element => {
    return (
        <Suspense fallback={<Loading />}>
            <CustomComponent {...routeProps} />
        </Suspense>
    );
};

export default LazyRoute;

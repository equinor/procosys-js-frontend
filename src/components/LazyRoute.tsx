import React, { Suspense } from 'react';

import Loading from './Loading';

const LazyRoute = (CustomComponent: React.FC<any>): JSX.Element => {
    return (
        <Suspense fallback={<Loading />}>
            <CustomComponent />
        </Suspense>
    );
};

export default LazyRoute;

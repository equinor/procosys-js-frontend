import { RouteComponentProps } from "react-router"
import React, { Suspense } from "react"


const LazyRoute = (CustomComponent: React.FC<any>, routeProps: RouteComponentProps<any>) => {
    return (
        <div>
            <Suspense fallback={<div>Loading...</div>} >
                <CustomComponent {...routeProps} />
            </Suspense>
        </div>
    )
}

export default LazyRoute;

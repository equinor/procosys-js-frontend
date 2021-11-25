import {
    useHistory,
    useLocation,
    useParams,
    useRouteMatch,
} from 'react-router-dom';

import { useMemo } from 'react';

const useRouter = (): any => {
    const params = useParams();
    const location = useLocation();
    const history = useHistory();
    const match = useRouteMatch();

    return useMemo(() => {
        return {
            push: history.push,
            replace: history.replace,
            pathname: location.pathname,
            match,
            location,
            history,
        };
    }, [params, match, location, history]);
};

export default useRouter;

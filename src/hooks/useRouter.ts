import {
    useNavigate,
    useLocation,
    useParams,
    useResolvedPath,
    useMatch,
} from 'react-router-dom';

import { useMemo } from 'react';

const useRouter = (): any => {
    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const resolvedPath = useResolvedPath('');
    const match = useMatch({ path: resolvedPath.pathname, end: false });

    return useMemo(() => {
        return {
            push: navigate,
            replace: (path: string) => navigate(path, { replace: true }),
            pathname: location.pathname,
            match,
            location,
            navigate,
        };
    }, [params, match, location, navigate]);
};

export default useRouter;

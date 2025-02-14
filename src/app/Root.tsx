import '../assets/sass/procosys-styles.scss';
import ProcosysContext, {
    createProcosysContext,
} from '../core/ProcosysContext';
import { useRef } from 'react';

import App from './index';
import { Helmet } from 'react-helmet';
import { IAuthService } from 'src/auth/AuthService';

type AppProps = {
    authService: IAuthService;
};

/**
 * Loads initial application configuration before
 * rendering the main application
 * @param props
 */
const Root = (props: AppProps): JSX.Element => {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const overlayRef = useRef<HTMLDivElement | null>(null);

    const context = createProcosysContext({
        auth: props.authService,
    });

    return (
        <ProcosysContext.Provider value={context}>
            <Helmet>
                <title>&nbsp;</title>
            </Helmet>
            <div id="procosys-root" ref={rootRef}>
                <App />
            </div>
            <div id="procosys-overlay" ref={overlayRef}>
                {/* Empty on purpose */}
            </div>
        </ProcosysContext.Provider>
    );
};

export default Root;

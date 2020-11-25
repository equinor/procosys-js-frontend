import { CommPkgScope, McPkgScope } from '../types';
import { Container, HeaderContainer, TableContainer } from './style';

import CommPkgsTable from './CommPkgsTable';
import McPkgsTable from './McPkgsTable';
import React from 'react';
import { Typography } from '@equinor/eds-core-react';

interface Props {
    mcPkgScope: McPkgScope[];
    commPkgScope: CommPkgScope[];
    projectName: string;
}

const Scope = ({ mcPkgScope, commPkgScope, projectName }: Props): JSX.Element => {
    return (
        <Container>
            {/* <HeaderContainer>
                <Typography variant="h5">Reports</Typography>
            </HeaderContainer>
            <TableContainer>
                // reports table here
            </TableContainer> */}
            {commPkgScope && commPkgScope.length > 0 && (
                <>
                    <HeaderContainer>
                        <Typography variant="h5">Included Comm Packages</Typography>
                    </HeaderContainer>
                    <TableContainer>
                        <CommPkgsTable commPkgScope={commPkgScope} projectName={projectName}/>
                    </TableContainer>
                </>
            )}
            {mcPkgScope && mcPkgScope.length > 0 && (
                <>
                    <HeaderContainer>
                        <Typography variant="h5">Included MC Packages</Typography>
                    </HeaderContainer>
                    <TableContainer>
                        <McPkgsTable mcPkgScope={mcPkgScope} projectName={projectName} />
                    </TableContainer>
                </>
            )}
        </Container>
    );
};

export default Scope;

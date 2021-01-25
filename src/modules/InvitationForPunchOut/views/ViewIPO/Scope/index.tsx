import { CommPkgScope, McPkgScope } from '../types';
import { Container, HeaderContainer, TableContainer } from './style';

import CommPkgsTable from './CommPkgsTable';
import McPkgsTable from './McPkgsTable';
import React from 'react';
import ReportsTable from './ReportsTable';
import { Typography } from '@equinor/eds-core-react';

interface ScopeProps {
    mcPkgScope: McPkgScope[];
    commPkgScope: CommPkgScope[];
    projectName: string;
}

const Scope = ({ mcPkgScope, commPkgScope, projectName }: ScopeProps): JSX.Element => {
    return (
        <Container>
            <HeaderContainer>
                <Typography variant="h5">Reports</Typography>
            </HeaderContainer>
            <TableContainer>
                <ReportsTable commPkgNumbers={commPkgScope.map((commPkg) => { return commPkg.commPkgNo; })} mcPkgNumbers={mcPkgScope.map((mcPkg) => { return mcPkg.mcPkgNo; })} />
            </TableContainer>
            {commPkgScope && commPkgScope.length > 0 && (
                <>
                    <HeaderContainer>
                        <Typography variant="h5">Included Comm Packages</Typography>
                    </HeaderContainer>
                    <TableContainer>
                        <CommPkgsTable commPkgScope={commPkgScope} projectName={projectName} />
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

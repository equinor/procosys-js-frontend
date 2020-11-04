import { Container, HeaderContainer, TableContainer } from './style';
import { commPkgs, mcPkgs, projects } from './dummyData';

import CommPkgsTable from './CommPkgsTable';
import McPkgsTable from './McPkgsTable';
import React from 'react';
import ReportsTable from './ReportsTable';
import { Typography } from '@equinor/eds-core-react';

interface Props {
    type: string;
}

const Scope = ({ type }: Props): JSX.Element => {

    return (
        <Container>
            <HeaderContainer>
                <Typography variant="h5">Reports</Typography>
            </HeaderContainer>
            <TableContainer>
                <ReportsTable projects={projects} />
            </TableContainer>
            <HeaderContainer>
                <Typography variant="h5">Included Comm Packages</Typography>
            </HeaderContainer>
            <TableContainer>
                <CommPkgsTable commPkgs={commPkgs} />
            </TableContainer>
            <HeaderContainer>
                <Typography variant="h5">Included MC Packages</Typography>
            </HeaderContainer>
            <TableContainer>
                <McPkgsTable mcPkgs={mcPkgs} />
            </TableContainer>
        </Container>
    );
};

export default Scope;

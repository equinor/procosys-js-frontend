import { Card } from '@equinor/eds-core-react';
import { Typography } from '@equinor/eds-core-react';
import EdsIcon from '@procosys/components/EdsIcon';
import React from 'react';
import { ContentDocument } from '../../http/GlobalSearchApiClient';
import { LinkIndicator } from '../MCPkgTab/style';
import { Container, StyledCard100, StyledCard50, StyledCardHeader, StyledHeaderTitle } from './style';

const { CardHeader, CardHeaderTitle } = Card;

export interface CommPkgTabProperties {
    commPkg: ContentDocument;
}

const CommPkgTab = ({ commPkg }: CommPkgTabProperties): JSX.Element => {

    const navigateToCommPkg = (): void => {
        // let url = location.origin + "/" + commPkg.plant?.replace('PCS$', '') + "/link";
        let url = 'https://procosysqp.equinor.com' + "/" + commPkg.plant?.replace('PCS$', '') + "/link";
        url += "/CommPkg?commPkgNo=" + commPkg.commPkg?.commPkgNo + "&project=" + commPkg.project;
        window.open(url, '_blank');
    };

    return (
        <Container>
            <StyledCard100>
                <StyledCardHeader onClick={(): void => navigateToCommPkg()}>
                    <StyledHeaderTitle className="link-container">
                        <Typography variant="caption">Comm pkg.</Typography>
                        <Typography variant="body_short">{commPkg.commPkg?.commPkgNo || ''}<LinkIndicator><EdsIcon name='launch' /></LinkIndicator></Typography>
                    </StyledHeaderTitle>
                </StyledCardHeader>
            </StyledCard100>

            <StyledCard50>
                <CardHeader>
                    <CardHeaderTitle>
                        <Typography variant="caption">Plant</Typography>
                        <Typography variant="body_short">{commPkg.plantName || ''}</Typography>
                    </CardHeaderTitle>
                </CardHeader>
            </StyledCard50>

            <StyledCard50>
                <CardHeader>
                    <CardHeaderTitle>
                        <Typography variant="caption">Project</Typography>
                        <Typography variant="body_short">{commPkg.project || ''}</Typography>
                    </CardHeaderTitle>
                </CardHeader>
            </StyledCard50>

            <StyledCard100>
                <CardHeader>
                    <CardHeaderTitle>
                        <Typography variant="caption">Description of work</Typography>
                        <Typography variant="body_short">{commPkg.commPkg?.descriptionOfWork || ''}</Typography>
                    </CardHeaderTitle>
                </CardHeader>
            </StyledCard100>

            <StyledCard100>
                <CardHeader>
                    <CardHeaderTitle>
                        <Typography variant="caption">Area</Typography>
                        <Typography variant="body_short">{commPkg.commPkg?.area || ''}</Typography>
                    </CardHeaderTitle>
                </CardHeader>
            </StyledCard100>

            <StyledCard100>
                <CardHeader>
                    <CardHeaderTitle>
                        <Typography variant="caption">Responsible</Typography>
                        <Typography variant="body_short">{commPkg.commPkg?.responsible || ''}</Typography>
                    </CardHeaderTitle>
                </CardHeader>
            </StyledCard100>

            <StyledCard100>
                <CardHeader>
                    <CardHeaderTitle>
                        <Typography variant="caption">Path</Typography>
                        <Typography variant="body_short">{commPkg.commPkg?.path || ''}</Typography>
                    </CardHeaderTitle>
                </CardHeader>
            </StyledCard100>

        </Container>
    )
};

export default CommPkgTab;
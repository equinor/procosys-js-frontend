import { Card } from '@equinor/eds-core-react';
import { Typography } from '@equinor/eds-core-react';
import React from 'react';
import { ContentDocument } from '../../http/GlobalSearchApiClient';
import { LinkIndicator } from '../MCPkgTab/style';
import { Container, MCPackageEntry, StyledCard100, StyledCard50, StyledCardHeader, StyledDivider, StyledHeaderTitle } from './style';
import EdsIcon from '@procosys/components/EdsIcon';

const { CardHeader, CardHeaderTitle, CardMedia, CardActions } = Card;

export interface RelatedMCPkgTabProperties {
    commPkg: ContentDocument;
}

const RelatedMCPkgTab = ({ commPkg }: RelatedMCPkgTabProperties): JSX.Element => {

    const navigateToMCPkg = (mcPkgNo: string): void => {
        // let url = location.origin + "/" + commPkg.plant?.replace('PCS$', '') + "/link";
        let url = 'https://procosysqp.equinor.com' + "/" + commPkg.plant?.replace('PCS$', '') + "/link";
        url += "/MCPkg?mcPkgNo=" + mcPkgNo + "&project=" + commPkg.project;
        window.open(url, '_blank');
    };

    return (
        <Container>
            {
                commPkg.commPkg?.mcPkgs?.map((pkg) => {
                    return (
                        <MCPackageEntry key={pkg.mcPkgId}>
                            <StyledCard100>
                                <StyledCardHeader onClick={() => navigateToMCPkg(pkg.mcPkgNo as string)}>
                                    <StyledHeaderTitle className="link-container">
                                        <Typography variant="caption">MC pkg.</Typography>
                                        <Typography variant="body_short">{pkg.mcPkgNo || ''}<LinkIndicator><EdsIcon name='launch' /></LinkIndicator></Typography>
                                    </StyledHeaderTitle>
                                </StyledCardHeader>
                            </StyledCard100>

                            <StyledCard100>
                                <CardHeader>
                                    <CardHeaderTitle>
                                        <Typography variant="caption">Description</Typography>
                                        <Typography variant="body_short">{pkg.mcPkgDescription || ''}</Typography>
                                    </CardHeaderTitle>
                                </CardHeader>
                            </StyledCard100>
                            <StyledDivider
                                color="medium"
                                variant="small"
                            />
                        </MCPackageEntry>

                    );
                })
            }
        </Container>
    )

};

export default RelatedMCPkgTab;
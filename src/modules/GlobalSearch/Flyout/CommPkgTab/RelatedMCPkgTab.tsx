import { Card } from '@equinor/eds-core-react';
import { Typography } from '@equinor/eds-core-react';
import React from 'react';
import { ContentDocument } from '../../http/GlobalSearchApiClient';
import { Container, MCPackageEntry, StyledCard100, StyledCard50, StyledDivider } from './style';

const { CardHeader, CardHeaderTitle, CardMedia, CardActions } = Card;

export interface RelatedMCPkgTabProperties {
    commPkg: ContentDocument;
}

const RelatedMCPkgTab = ({ commPkg }: RelatedMCPkgTabProperties): JSX.Element => {

    return (
        <Container>
            {
                commPkg.commPkg?.mcPkgs?.map((pkg) => {
                    return (
                        <MCPackageEntry key={pkg.mcPkgId}>
                            <StyledCard100>
                                <CardHeader>
                                    <CardHeaderTitle>
                                        <Typography variant="caption">MC pkg no.</Typography>
                                        <Typography variant="body_short">{pkg.mcPkgNo || ''}</Typography>
                                    </CardHeaderTitle>
                                </CardHeader>
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
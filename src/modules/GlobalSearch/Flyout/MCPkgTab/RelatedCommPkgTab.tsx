import { Card } from '@equinor/eds-core-react';
import { Typography } from '@equinor/eds-core-react';
import React from 'react';
import { ContentDocument } from '../../http/GlobalSearchApiClient';
import { Container, StyledCard100 } from './style';

const { CardHeader, CardHeaderTitle } = Card;

export interface MCPkgTabTabProperties {
    mcPkg: ContentDocument;
}

const RelatedCommPkgTab = ({ mcPkg }: MCPkgTabTabProperties): JSX.Element => {

    return (
        <Container>
            <StyledCard100>
                <CardHeader>
                    <CardHeaderTitle>
                        <Typography variant="caption">Comm pkg no.</Typography>
                        <Typography variant="body_short">{mcPkg.mcPkg?.commPkgNo || ''}</Typography>
                    </CardHeaderTitle>
                </CardHeader>
            </StyledCard100>

            <StyledCard100>
                <CardHeader>
                    <CardHeaderTitle>
                        <Typography variant="caption">Description</Typography>
                        <Typography variant="body_short">{mcPkg.mcPkg?.commPkgDescription || ''}</Typography>
                    </CardHeaderTitle>
                </CardHeader>
            </StyledCard100>
        </Container>
    )

};

export default RelatedCommPkgTab;
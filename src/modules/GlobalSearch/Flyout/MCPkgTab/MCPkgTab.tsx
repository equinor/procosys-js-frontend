import { Card } from '@equinor/eds-core-react';
import { Typography } from '@equinor/eds-core-react';
import React from 'react';
import { ContentDocument } from '../../http/GlobalSearchApiClient';
import { Container, StyledCard100, StyledCard50, StyledDivider } from './style';

const { CardHeader, CardHeaderTitle } = Card;

export interface MCPkgTabTabProperties {
    mcPkg: ContentDocument;
}

const MCPkgTab = ({ mcPkg }: MCPkgTabTabProperties): JSX.Element => {

    return (
        <Container>
            <StyledCard100>
                <CardHeader>
                    <CardHeaderTitle>
                        <Typography variant="caption">MC pkg.no.</Typography>
                        <Typography variant="body_short">{mcPkg.mcPkg?.mcPkgNo || ''}</Typography>
                    </CardHeaderTitle>
                </CardHeader>
            </StyledCard100>

            <StyledCard50>
                <CardHeader>
                    <CardHeaderTitle>
                        <Typography variant="caption">Plant</Typography>
                        <Typography variant="body_short">{mcPkg.plantName || ''}</Typography>
                    </CardHeaderTitle>
                </CardHeader>
            </StyledCard50>

            <StyledCard50>
                <CardHeader>
                    <CardHeaderTitle>
                        <Typography variant="caption">Project</Typography>
                        <Typography variant="body_short">{mcPkg.project || ''}</Typography>
                    </CardHeaderTitle>
                </CardHeader>
            </StyledCard50>

            <StyledCard100>
                <CardHeader>
                    <CardHeaderTitle>
                        <Typography variant="caption">Discipline</Typography>
                        <Typography variant="body_short">{mcPkg.mcPkg?.discipline || ''}</Typography>
                    </CardHeaderTitle>
                </CardHeader>
            </StyledCard100>

            <StyledCard100>
                <CardHeader>
                    <CardHeaderTitle>
                        <Typography variant="caption">Description</Typography>
                        <Typography variant="body_short">{mcPkg.mcPkg?.description || ''}</Typography>
                    </CardHeaderTitle>
                </CardHeader>
            </StyledCard100>

            <StyledCard100>
                <CardHeader>
                    <CardHeaderTitle>
                        <Typography variant="caption">Area</Typography>
                        <Typography variant="body_short">{mcPkg.mcPkg?.area || ''}</Typography>
                    </CardHeaderTitle>
                </CardHeader>
            </StyledCard100>

            <StyledCard100>
                <CardHeader>
                    <CardHeaderTitle>
                        <Typography variant="caption">Responsible</Typography>
                        <Typography variant="body_short">{mcPkg.mcPkg?.responsible || ''}</Typography>
                    </CardHeaderTitle>
                </CardHeader>
            </StyledCard100>

            <StyledDivider
                color="medium"
                variant="small"
            />

            <Typography variant="h6">Comm package info</Typography>

            <StyledCard100>
                <CardHeader>
                    <CardHeaderTitle>
                        <Typography variant="caption">Comm pkg.</Typography>
                        <Typography variant="body_short">{mcPkg.mcPkg?.commPkgNo || ''}</Typography>
                    </CardHeaderTitle>
                </CardHeader>
            </StyledCard100>

            <StyledCard100>
                <CardHeader>
                    <CardHeaderTitle>
                        <Typography variant="caption">Description.</Typography>
                        <Typography variant="body_short">{mcPkg.mcPkg?.commPkgDescription || ''}</Typography>
                    </CardHeaderTitle>
                </CardHeader>
            </StyledCard100>

        </Container>
    )

};

export default MCPkgTab;
import { Card } from '@equinor/eds-core-react';
import { Typography } from '@equinor/eds-core-react';
import React from 'react';
import { ContentDocument } from '../../http/GlobalSearchApiClient';
import { Container, StyledCard100, StyledCard50 } from './style';

const { CardHeader, CardHeaderTitle, CardMedia, CardActions } = Card;

export interface CommPkgTabProperties {
    commPkg: ContentDocument;
}

const CommPkgTab = ({ commPkg }: CommPkgTabProperties): JSX.Element => {

    return (
        <Container>
            <StyledCard100>
                <CardHeader>
                    <CardHeaderTitle>
                        <Typography variant="caption">Comm pkg no.</Typography>
                        <Typography variant="body_short">{commPkg.commPkg?.commPkgNo || ''}</Typography>
                    </CardHeaderTitle>
                </CardHeader>
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
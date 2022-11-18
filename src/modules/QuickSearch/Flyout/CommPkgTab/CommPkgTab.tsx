import {
    Container,
    StyledCard100,
    StyledCard50,
    StyledTypographyLink,
    StyledHeaderTitle,
    StyledHeaderTitleLink,
} from './style';

import { Card } from '@equinor/eds-core-react';
import { ContentDocument } from '../../http/QuickSearchApiClient';
import EdsIcon from '@procosys/components/EdsIcon';
import Highlighter from 'react-highlight-words';
import { LinkIndicator } from '../MCPkgTab/style';
import React from 'react';
import { Typography } from '@equinor/eds-core-react';

export interface CommPkgTabProperties {
    commPkg: ContentDocument;
    searchValue: string;
    highlightOn: boolean;
}

const CommPkgTab = ({
    commPkg,
    searchValue,
    highlightOn,
}: CommPkgTabProperties): JSX.Element => {
    const navigateToCommPkg = (): void => {
        if (!commPkg.plant || !commPkg.commPkg)
            throw new Error('Unable to navigate. Plant or CommPkg is missing.');

        let url =
            location.origin + '/' + commPkg.plant.replace('PCS$', '') + '/link';
        url +=
            '/CommPkg?commPkgNo=' +
            encodeURIComponent(commPkg.commPkg.commPkgNo ?? '') +
            '&project=' +
            encodeURIComponent(commPkg.project?.toLocaleUpperCase() ?? '');
        window.open(url, '_blank');
    };

    const highlightSearchValue = (text: string): JSX.Element => {
        if (!highlightOn) return <span>{text}</span>;

        return (
            <Highlighter
                searchWords={searchValue.split(' ')}
                autoEscape={true}
                textToHighlight={text}
            />
        );
    };

    return (
        <Container>
            <StyledCard100>
                <Card.Header>
                    <StyledHeaderTitleLink className="link-container">
                        <Typography variant="caption">Comm pkg.</Typography>
                        <StyledTypographyLink
                            variant="body_short"
                            onClick={(): void => navigateToCommPkg()}
                        >
                            {highlightSearchValue(
                                commPkg.commPkg?.commPkgNo ?? ''
                            )}
                            <LinkIndicator>
                                <EdsIcon name="launch" />
                            </LinkIndicator>
                        </StyledTypographyLink>
                    </StyledHeaderTitleLink>
                </Card.Header>
            </StyledCard100>

            <StyledCard50>
                <Card.Header>
                    <StyledHeaderTitle>
                        <Typography variant="caption">Plant</Typography>
                        <Typography variant="body_short">
                            {highlightSearchValue(commPkg.plantName ?? '')}
                        </Typography>
                    </StyledHeaderTitle>
                </Card.Header>
            </StyledCard50>

            <StyledCard50>
                <Card.Header>
                    <StyledHeaderTitle>
                        <Typography variant="caption">Project</Typography>
                        <Typography variant="body_short">
                            {highlightSearchValue(commPkg.project ?? '')}
                        </Typography>
                    </StyledHeaderTitle>
                </Card.Header>
            </StyledCard50>

            <StyledCard100>
                <Card.Header>
                    <StyledHeaderTitle>
                        <Typography variant="caption">
                            Description of work
                        </Typography>
                        <Typography variant="body_short">
                            {highlightSearchValue(
                                commPkg.commPkg?.descriptionOfWork ?? ''
                            )}
                        </Typography>
                    </StyledHeaderTitle>
                </Card.Header>
            </StyledCard100>

            <StyledCard100>
                <Card.Header>
                    <StyledHeaderTitle>
                        <Typography variant="caption">Area</Typography>
                        <Typography variant="body_short">
                            {highlightSearchValue(commPkg.commPkg?.area ?? '')}
                        </Typography>
                    </StyledHeaderTitle>
                </Card.Header>
            </StyledCard100>

            <StyledCard100>
                <Card.Header>
                    <StyledHeaderTitle>
                        <Typography variant="caption">Responsible</Typography>
                        <Typography variant="body_short">
                            {highlightSearchValue(
                                commPkg.commPkg?.responsible ?? ''
                            )}
                        </Typography>
                    </StyledHeaderTitle>
                </Card.Header>
            </StyledCard100>

            <StyledCard100>
                <Card.Header>
                    <StyledHeaderTitle>
                        <Typography variant="caption">Remark</Typography>
                        <Typography variant="body_short">
                            {highlightSearchValue(
                                commPkg.commPkg?.remark ?? ''
                            )}
                        </Typography>
                    </StyledHeaderTitle>
                </Card.Header>
            </StyledCard100>
        </Container>
    );
};

export default CommPkgTab;

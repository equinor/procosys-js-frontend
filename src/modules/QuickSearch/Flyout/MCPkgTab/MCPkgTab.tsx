import {
    Container,
    LinkIndicator,
    StyledCard100,
    StyledCard50,
    StyledTypographyLink,
    StyledDivider,
    StyledHeaderTitle,
    StyledHeaderTitleLink,
} from './style';

import { Card } from '@equinor/eds-core-react';
import { ContentDocument } from '../../http/QuickSearchApiClient';
import EdsIcon from '@procosys/components/EdsIcon';
import Highlighter from 'react-highlight-words';
import React from 'react';
import { Typography } from '@equinor/eds-core-react';

export interface MCPkgTabProperties {
    mcPkg: ContentDocument;
    searchValue: string;
    highlightOn: boolean;
}

const MCPkgTab = ({
    mcPkg,
    searchValue,
    highlightOn,
}: MCPkgTabProperties): JSX.Element => {
    const navigateToCommPkg = (): void => {
        if (!mcPkg.plant || !mcPkg.mcPkg || !mcPkg.mcPkg.commPkgNo)
            throw new Error(
                'Unable to navigate. Plant or CommPkg is missing. '
            );

        let url =
            location.origin + '/' + mcPkg.plant.replace('PCS$', '') + '/link';
        url +=
            '/CommPkg?commPkgNo=' +
            encodeURIComponent(mcPkg.mcPkg.commPkgNo ?? '') +
            '&project=' +
            encodeURIComponent(mcPkg.project?.toLocaleUpperCase() ?? '');
        window.open(url, '_blank');
    };

    const navigateToMCPkg = (): void => {
        if (!mcPkg.plant || !mcPkg.mcPkg || !mcPkg.mcPkg.mcPkgNo)
            throw new Error('Unable to navigate. Plant or MCPkg is missing. ');

        let url =
            location.origin + '/' + mcPkg.plant.replace('PCS$', '') + '/link';
        url +=
            '/MCPkg?mcPkgNo=' +
            encodeURIComponent(mcPkg.mcPkg.mcPkgNo ?? '') +
            '&project=' +
            encodeURIComponent(mcPkg.project?.toLocaleUpperCase() ?? '');
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
                        <Typography variant="caption">MC pkg.</Typography>
                        <StyledTypographyLink
                            variant="body_short"
                            onClick={(): void => navigateToMCPkg()}
                        >
                            {highlightSearchValue(mcPkg.mcPkg?.mcPkgNo || '')}
                            <LinkIndicator>
                                <EdsIcon name="launch" />
                            </LinkIndicator>
                        </StyledTypographyLink>
                    </StyledHeaderTitleLink>
                </Card.Header>
            </StyledCard100>

            <StyledCard100>
                <Card.Header>
                    <StyledHeaderTitle>
                        <Typography variant="caption">Description</Typography>
                        <Typography variant="body_short">
                            {highlightSearchValue(
                                mcPkg.mcPkg?.description || ''
                            )}
                        </Typography>
                    </StyledHeaderTitle>
                </Card.Header>
            </StyledCard100>

            <StyledCard50>
                <Card.Header>
                    <StyledHeaderTitle>
                        <Typography variant="caption">Plant</Typography>
                        <Typography variant="body_short">
                            {highlightSearchValue(mcPkg.plantName || '')}
                        </Typography>
                    </StyledHeaderTitle>
                </Card.Header>
            </StyledCard50>

            <StyledCard50>
                <Card.Header>
                    <StyledHeaderTitle>
                        <Typography variant="caption">Project</Typography>
                        <Typography variant="body_short">
                            {highlightSearchValue(mcPkg.project || '')}
                        </Typography>
                    </StyledHeaderTitle>
                </Card.Header>
            </StyledCard50>

            <StyledCard100>
                <Card.Header>
                    <StyledHeaderTitle>
                        <Typography variant="caption">Discipline</Typography>
                        <Typography variant="body_short">
                            {highlightSearchValue(
                                mcPkg.mcPkg?.discipline || ''
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
                            {highlightSearchValue(mcPkg.mcPkg?.area || '')}
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
                                mcPkg.mcPkg?.responsible || ''
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
                            {highlightSearchValue(mcPkg.mcPkg?.remark || '')}
                        </Typography>
                    </StyledHeaderTitle>
                </Card.Header>
            </StyledCard100>

            <StyledDivider color="medium" variant="small" />

            <Typography variant="h6">Comm package info</Typography>

            <StyledCard100>
                <Card.Header>
                    {mcPkg.mcPkg?.commPkgNo ? (
                        <StyledHeaderTitleLink className="link-container">
                            <Typography variant="caption">Comm pkg.</Typography>
                            <StyledTypographyLink
                                variant="body_short"
                                onClick={(): void =>
                                    mcPkg.mcPkg?.commPkgNo
                                        ? navigateToCommPkg()
                                        : undefined
                                }
                            >
                                {highlightSearchValue(
                                    mcPkg.mcPkg?.commPkgNo || ''
                                )}
                                <LinkIndicator>
                                    <EdsIcon name="launch" />
                                </LinkIndicator>
                            </StyledTypographyLink>
                        </StyledHeaderTitleLink>
                    ) : (
                        <StyledHeaderTitle className="link-container">
                            <Typography variant="caption">Comm pkg.</Typography>
                        </StyledHeaderTitle>
                    )}
                </Card.Header>
            </StyledCard100>

            <StyledCard100>
                <Card.Header>
                    <StyledHeaderTitle>
                        <Typography variant="caption">Description.</Typography>
                        <Typography variant="body_short">
                            {highlightSearchValue(
                                mcPkg.mcPkg?.description || ''
                            )}
                        </Typography>
                    </StyledHeaderTitle>
                </Card.Header>
            </StyledCard100>
        </Container>
    );
};

export default MCPkgTab;

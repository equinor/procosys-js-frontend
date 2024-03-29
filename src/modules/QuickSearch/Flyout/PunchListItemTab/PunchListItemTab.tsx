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

export interface PunchListItemTabProperties {
    punchItem: ContentDocument;
    searchValue: string;
    highlightOn: boolean;
}

const PunchListItemTab = ({
    punchItem,
    searchValue,
    highlightOn,
}: PunchListItemTabProperties): JSX.Element => {
    const navigateToTag = (): void => {
        if (
            !punchItem.plant ||
            !punchItem.punchItem ||
            !punchItem.punchItem.tagNo
        )
            throw new Error('Unable to navigate.');

        let url =
            location.origin +
            '/' +
            punchItem.plant.replace('PCS$', '') +
            '/link';
        url +=
            '/Tag?tagNo=' +
            encodeURIComponent(punchItem.punchItem.tagNo ?? '') +
            '&project=' +
            encodeURIComponent(punchItem.project?.toLocaleUpperCase() ?? '');
        window.open(url, '_blank');
    };

    const navigateToPunchItem = (): void => {
        if (
            !punchItem.plant ||
            !punchItem.punchItem ||
            !punchItem.punchItem.punchItemNo
        )
            throw new Error('Unable to navigate. Plant or MCPkg is missing. ');

        let url =
            location.origin +
            '/' +
            punchItem.plant.replace('PCS$', '') +
            '/link';
        url +=
            '/PunchListItem?punchListItemNo=' +
            encodeURIComponent(punchItem.punchItem.punchItemNo ?? '');
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
                        <Typography variant="caption">
                            Punch List Item no.
                        </Typography>
                        <StyledTypographyLink
                            variant="body_short"
                            onClick={(): void => navigateToPunchItem()}
                        >
                            {highlightSearchValue(
                                punchItem.punchItem?.punchItemNo ?? ''
                            )}
                            <LinkIndicator>
                                <EdsIcon name="external_link" />
                            </LinkIndicator>
                        </StyledTypographyLink>
                    </StyledHeaderTitleLink>
                </Card.Header>
            </StyledCard100>

            {punchItem.punchItem?.tagNo && (
                <StyledCard100>
                    <Card.Header>
                        <StyledHeaderTitleLink className="link-container">
                            <Typography variant="caption">Tag no.</Typography>
                            <StyledTypographyLink
                                variant="body_short"
                                onClick={(): void => navigateToTag()}
                            >
                                {highlightSearchValue(
                                    punchItem.punchItem?.tagNo ?? ''
                                )}
                                <LinkIndicator>
                                    <EdsIcon name="external_link" />
                                </LinkIndicator>
                            </StyledTypographyLink>
                        </StyledHeaderTitleLink>
                    </Card.Header>
                </StyledCard100>
            )}

            <StyledCard100>
                <Card.Header>
                    <StyledHeaderTitle>
                        <Typography variant="caption">Description</Typography>
                        <Typography variant="body_short">
                            {highlightSearchValue(
                                punchItem.punchItem?.description ?? ''
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
                            {highlightSearchValue(punchItem.plantName ?? '')}
                        </Typography>
                    </StyledHeaderTitle>
                </Card.Header>
            </StyledCard50>

            <StyledCard50>
                <Card.Header>
                    <StyledHeaderTitle>
                        <Typography variant="caption">Project</Typography>
                        <Typography variant="body_short">
                            {highlightSearchValue(punchItem.project ?? '')}
                        </Typography>
                    </StyledHeaderTitle>
                </Card.Header>
            </StyledCard50>

            <StyledCard50>
                <Card.Header>
                    <StyledHeaderTitle>
                        <Typography variant="caption">Form type</Typography>
                        <Typography variant="body_short">
                            {highlightSearchValue(
                                punchItem.punchItem?.formType ?? ''
                            )}
                        </Typography>
                    </StyledHeaderTitle>
                </Card.Header>
            </StyledCard50>

            <StyledCard50>
                <Card.Header>
                    <StyledHeaderTitle>
                        <Typography variant="caption">Category</Typography>
                        <Typography variant="body_short">
                            {highlightSearchValue(
                                punchItem.punchItem?.category ?? ''
                            )}
                        </Typography>
                    </StyledHeaderTitle>
                </Card.Header>
            </StyledCard50>

            <StyledCard100>
                <Card.Header>
                    <StyledHeaderTitle>
                        <Typography variant="caption">Responsible</Typography>
                        <Typography variant="body_short">
                            {highlightSearchValue(
                                punchItem.punchItem?.responsible ?? ''
                            )}
                        </Typography>
                    </StyledHeaderTitle>
                </Card.Header>
            </StyledCard100>
        </Container>
    );
};

export default PunchListItemTab;

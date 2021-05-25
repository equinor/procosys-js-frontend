import { Card } from '@equinor/eds-core-react';
import { Typography } from '@equinor/eds-core-react';
import React from 'react';
import { ContentDocument } from '../../http/QuickSearchApiClient';
import { Container, LinkIndicator, StyledCard100, StyledCard50, StyledCardHeader, StyledDivider, StyledHeaderTitle, StyledHeaderTitleLink } from './style';
import EdsIcon from '@procosys/components/EdsIcon';
import Highlighter from 'react-highlight-words';

const { CardHeader } = Card;

export interface PunchListItemTabProperties {
    punchItem: ContentDocument;
    searchValue: string;
    highlightOn: boolean;
}

const PunchListItemTab = ({ punchItem, searchValue, highlightOn }: PunchListItemTabProperties): JSX.Element => {

    const navigateToTag = (): void => {
        if (!punchItem.plant || !punchItem.punchItem || !punchItem.punchItem.tagNo) throw new Error("Unable to navigate.");

        let url = location.origin + "/" + punchItem.plant.replace('PCS$', '') + "/link";
        url += "/Tag?tagNo=" + encodeURIComponent(punchItem.punchItem.tagNo ?? '') + "&project=" + encodeURIComponent(punchItem.project ?? '');
        window.open(url, '_blank');
    };

    const navigateToPunchItem = (): void => {
        if (!punchItem.plant || !punchItem.punchItem || !punchItem.punchItem.punchItemNo) throw new Error("Unable to navigate. Plant or MCPkg is missing. ");

        let url = location.origin + "/" + punchItem.plant.replace('PCS$', '') + "/link";
        url += "/PunchListItem?punchListItemNo=" + encodeURIComponent(punchItem.punchItem.punchItemNo ?? '');
        window.open(url, '_blank');
    };

    const highlightSearchValue = (text: string): JSX.Element => {
        if (!highlightOn) return <span>{text}</span>;

        return <Highlighter
            searchWords={searchValue.split(' ')}
            autoEscape={true}
            textToHighlight={text}
        />
    };

    return (
        <Container>
            <StyledCard100>
                <StyledCardHeader onClick={(): void => navigateToPunchItem()}>
                    <StyledHeaderTitleLink className="link-container">
                        <Typography variant="caption">Punch List Item no.</Typography>
                        <Typography variant="body_short">{highlightSearchValue(punchItem.punchItem?.punchItemNo ?? '')}<LinkIndicator><EdsIcon name='launch' /></LinkIndicator></Typography>
                    </StyledHeaderTitleLink>
                </StyledCardHeader>
            </StyledCard100>

            {punchItem.punchItem?.tagNo && (
                <StyledCard100>
                    <StyledCardHeader onClick={(): void => navigateToTag()}>
                        <StyledHeaderTitleLink className="link-container">
                            <Typography variant="caption">Tag no.</Typography>
                            <Typography variant="body_short">{highlightSearchValue(punchItem.punchItem?.tagNo ?? '')}<LinkIndicator><EdsIcon name='launch' /></LinkIndicator></Typography>
                        </StyledHeaderTitleLink>
                    </StyledCardHeader>
                </StyledCard100>
            )}

            <StyledCard100>
                <CardHeader>
                    <StyledHeaderTitle>
                        <Typography variant="caption">Description</Typography>
                        <Typography variant="body_short">{highlightSearchValue(punchItem.punchItem?.description ?? '')}</Typography>
                    </StyledHeaderTitle>
                </CardHeader>
            </StyledCard100>

            <StyledCard50>
                <CardHeader>
                    <StyledHeaderTitle>
                        <Typography variant="caption">Plant</Typography>
                        <Typography variant="body_short">{highlightSearchValue(punchItem.plantName ?? '')}</Typography>
                    </StyledHeaderTitle>
                </CardHeader>
            </StyledCard50>

            <StyledCard50>
                <CardHeader>
                    <StyledHeaderTitle>
                        <Typography variant="caption">Project</Typography>
                        <Typography variant="body_short">{highlightSearchValue(punchItem.project ?? '')}</Typography>
                    </StyledHeaderTitle>
                </CardHeader>
            </StyledCard50>

            <StyledCard50>
                <CardHeader>
                    <StyledHeaderTitle>
                        <Typography variant="caption">Form type</Typography>
                        <Typography variant="body_short">{highlightSearchValue(punchItem.punchItem?.formType ?? '')}</Typography>
                    </StyledHeaderTitle>
                </CardHeader>
            </StyledCard50>

            <StyledCard50>
                <CardHeader>
                    <StyledHeaderTitle>
                        <Typography variant="caption">Category</Typography>
                        <Typography variant="body_short">{highlightSearchValue(punchItem.punchItem?.category ?? '')}</Typography>
                    </StyledHeaderTitle>
                </CardHeader>
            </StyledCard50>

            <StyledCard100>
                <CardHeader>
                    <StyledHeaderTitle>
                        <Typography variant="caption">Responsible</Typography>
                        <Typography variant="body_short">{highlightSearchValue(punchItem.punchItem?.responsible ?? '')}</Typography>
                    </StyledHeaderTitle>
                </CardHeader>
            </StyledCard100>
        </Container>
    )
};

export default PunchListItemTab;
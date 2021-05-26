import { Card } from '@equinor/eds-core-react';
import { Typography } from '@equinor/eds-core-react';
import React from 'react';
import { ContentDocument } from '../../http/QuickSearchApiClient';
import { Container, LinkIndicator, StyledCard100, StyledCard50, StyledCardHeader, StyledHeaderTitle, StyledHeaderTitleLink } from './style';
import EdsIcon from '@procosys/components/EdsIcon';
import Highlighter from 'react-highlight-words';

const { CardHeader } = Card;

export interface TagTabProperties {
    tag: ContentDocument;
    searchValue: string;
    highlightOn: boolean;
}

const TagTab = ({ tag: tag, searchValue, highlightOn }: TagTabProperties): JSX.Element => {

    const navigateToCommPkg = (): void => {
        if (!tag.plant || !tag.tag || !tag.tag.commPkgNo) throw new Error("Unable to navigate. Plant or CommPkg is missing. ");

        let url = location.origin + "/" + tag.plant.replace('PCS$', '') + "/link";
        url += "/CommPkg?commPkgNo=" + encodeURIComponent(tag.tag.commPkgNo ?? '') + "&project=" + encodeURIComponent(tag.project?.toLocaleUpperCase() ?? '');
        window.open(url, '_blank');
    };

    const navigateToMCPkg = (): void => {
        if (!tag.plant || !tag.tag || !tag.tag.mcPkgNo) throw new Error("Unable to navigate. Plant or MCPkg is missing. ");

        let url = location.origin + "/" + tag.plant.replace('PCS$', '') + "/link";
        url += "/MCPkg?mcPkgNo=" + encodeURIComponent(tag.tag.mcPkgNo ?? '') + "&project=" + encodeURIComponent(tag.project?.toLocaleUpperCase() ?? '');
        window.open(url, '_blank');
    };

    const navigateToTag = (): void => {
        if (!tag.plant || !tag.tag || !tag.tag.tagNo) throw new Error("Unable to navigate. Plant or Tag is missing. ");

        let url = location.origin + "/" + tag.plant.replace('PCS$', '') + "/link";
        url += "/Tag?tagNo=" + encodeURIComponent(tag.tag.tagNo ?? '') + "&project=" + encodeURIComponent(tag.project?.toLocaleUpperCase() ?? '');
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
                <StyledCardHeader onClick={(): void => navigateToTag()}>
                    <StyledHeaderTitleLink className="link-container">
                        <Typography variant="caption">Tag no.</Typography>
                        <Typography variant="body_short">{highlightSearchValue(tag.tag?.tagNo ?? '')}<LinkIndicator><EdsIcon name='launch' /></LinkIndicator></Typography>
                    </StyledHeaderTitleLink>
                </StyledCardHeader>
            </StyledCard100>

            <StyledCard100>
                <CardHeader>
                    <StyledHeaderTitle>
                        <Typography variant="caption">Description</Typography>
                        <Typography variant="body_short">{highlightSearchValue(tag.tag?.description ?? '')}</Typography>
                    </StyledHeaderTitle>
                </CardHeader>
            </StyledCard100>

            <StyledCard50>
                <CardHeader>
                    <StyledHeaderTitle>
                        <Typography variant="caption">Plant</Typography>
                        <Typography variant="body_short">{highlightSearchValue(tag.plantName ?? '')}</Typography>
                    </StyledHeaderTitle>
                </CardHeader>
            </StyledCard50>

            <StyledCard50>
                <CardHeader>
                    <StyledHeaderTitle>
                        <Typography variant="caption">Project</Typography>
                        <Typography variant="body_short">{highlightSearchValue(tag.project ?? '')}</Typography>
                    </StyledHeaderTitle>
                </CardHeader>
            </StyledCard50>

            <StyledCard100>
                <CardHeader>
                    <StyledHeaderTitle>
                        <Typography variant="caption">Discipline</Typography>
                        <Typography variant="body_short">{highlightSearchValue(tag.tag?.disciplineCode ?? '')}, {highlightSearchValue(tag.tag?.disciplineDescription ?? '')}</Typography>
                    </StyledHeaderTitle>
                </CardHeader>
            </StyledCard100>

            <StyledCard50>
                <CardHeader>
                    <StyledHeaderTitle>
                        <Typography variant="caption">Purchase order</Typography>
                        <Typography variant="body_short">{highlightSearchValue(tag.tag?.purchaseOrderNo ?? '')}</Typography>
                    </StyledHeaderTitle>
                </CardHeader>
            </StyledCard50>

            <StyledCard50>
                <CardHeader>
                    <StyledHeaderTitle>
                        <Typography variant="caption">Tag function code</Typography>
                        <Typography variant="body_short">{highlightSearchValue(tag.tag?.tagFunctionCode ?? '')}</Typography>
                    </StyledHeaderTitle>
                </CardHeader>
            </StyledCard50>

            <StyledCard100>
                <StyledCardHeader onClick={(): void => tag.tag?.commPkgNo ? navigateToCommPkg() : undefined}>
                    {
                        tag.tag?.commPkgNo ? (
                            <StyledHeaderTitleLink className="link-container">
                                <Typography variant="caption">Comm pkg.</Typography>
                                <Typography variant="body_short">{highlightSearchValue(tag.tag?.commPkgNo ?? '')} {tag.tag?.commPkgNo && <LinkIndicator><EdsIcon name='launch' /></LinkIndicator>}</Typography>
                            </StyledHeaderTitleLink>
                        ) : (
                            <StyledHeaderTitle>
                                <Typography variant="caption">Comm pkg.</Typography>
                            </StyledHeaderTitle>
                        )
                    }

                </StyledCardHeader>
            </StyledCard100>

            <StyledCard100>
                <StyledCardHeader onClick={(): void => tag.tag?.mcPkgNo ? navigateToMCPkg() : undefined}>
                    {
                        tag.tag?.mcPkgNo ? (
                            <StyledHeaderTitleLink className="link-container">
                                <Typography variant="caption">MC pkg.</Typography>
                                <Typography variant="body_short">{highlightSearchValue(tag.tag?.mcPkgNo ?? '')} {tag.tag?.mcPkgNo && <LinkIndicator><EdsIcon name='launch' /></LinkIndicator>}</Typography>
                            </StyledHeaderTitleLink>
                        ) : (
                            <StyledHeaderTitle>
                                <Typography variant="caption">MC pkg.</Typography>
                            </StyledHeaderTitle>
                        )
                    }
                </StyledCardHeader>
            </StyledCard100>
        </Container>
    )
};

export default TagTab;
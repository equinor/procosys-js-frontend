import { Card } from '@equinor/eds-core-react';
import { Typography } from '@equinor/eds-core-react';
import React from 'react';
import { ContentDocument } from '../../http/QuickSearchApiClient';
import { Container, LinkIndicator, StyledCard100, StyledCard50, StyledCardHeader, StyledDivider, StyledHeaderTitle, StyledHeaderTitleLink } from './style';
import EdsIcon from '@procosys/components/EdsIcon';
import Highlighter from 'react-highlight-words';

const { CardHeader, CardHeaderTitle } = Card;

export interface MCPkgTabTabProperties {
    mcPkg: ContentDocument;
    searchValue: string;
    highlightOn: boolean;
}

const MCPkgTab = ({ mcPkg, searchValue, highlightOn }: MCPkgTabTabProperties): JSX.Element => {

    const navigateToCommPkg = (): void => {
        if(!mcPkg.plant || !mcPkg.mcPkg || !mcPkg.mcPkg.commPkgNo) throw new Error("Unable to navigate. Plant or CommPkg is missing. ");

        let url = location.origin + "/" + mcPkg.plant.replace('PCS$', '') + "/link";
        url += "/CommPkg?commPkgNo=" + mcPkg.mcPkg.commPkgNo + "&project=" + mcPkg.project;
        window.open(url, '_blank');
    };

    const navigateToMCPkg = (): void => {
        if(!mcPkg.plant || !mcPkg.mcPkg || !mcPkg.mcPkg.mcPkgNo) throw new Error("Unable to navigate. Plant or MCPkg is missing. ");

        let url = location.origin + "/" + mcPkg.plant.replace('PCS$', '') + "/link";
        url += "/MCPkg?mcPkgNo=" + mcPkg.mcPkg.mcPkgNo + "&project=" + mcPkg.project;
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
                <StyledCardHeader onClick={(): void => navigateToMCPkg()}>
                    <StyledHeaderTitleLink className="link-container">
                        <Typography variant="caption">MC pkg.</Typography>
                        <Typography variant="body_short">{highlightSearchValue(mcPkg.mcPkg?.mcPkgNo || '')}<LinkIndicator><EdsIcon name='launch' /></LinkIndicator></Typography>
                    </StyledHeaderTitleLink>
                </StyledCardHeader>
            </StyledCard100>

            <StyledCard100>
                <CardHeader>
                    <StyledHeaderTitle>
                        <Typography variant="caption">Description</Typography>
                        <Typography variant="body_short">{highlightSearchValue(mcPkg.mcPkg?.description || '')}</Typography>
                    </StyledHeaderTitle>
                </CardHeader>
            </StyledCard100>

            <StyledCard50>
                <CardHeader>
                    <StyledHeaderTitle>
                        <Typography variant="caption">Plant</Typography>
                        <Typography variant="body_short">{highlightSearchValue(mcPkg.plantName || '')}</Typography>
                    </StyledHeaderTitle>
                </CardHeader>
            </StyledCard50>

            <StyledCard50>
                <CardHeader>
                    <StyledHeaderTitle>
                        <Typography variant="caption">Project</Typography>
                        <Typography variant="body_short">{highlightSearchValue(mcPkg.project || '')}</Typography>
                    </StyledHeaderTitle>
                </CardHeader>
            </StyledCard50>

            <StyledCard100>
                <CardHeader>
                    <StyledHeaderTitle>
                        <Typography variant="caption">Discipline</Typography>
                        <Typography variant="body_short">{highlightSearchValue(mcPkg.mcPkg?.discipline || '')}</Typography>
                    </StyledHeaderTitle>
                </CardHeader>
            </StyledCard100>

            <StyledCard100>
                <CardHeader>
                    <StyledHeaderTitle>
                        <Typography variant="caption">Area</Typography>
                        <Typography variant="body_short">{highlightSearchValue(mcPkg.mcPkg?.area || '')}</Typography>
                    </StyledHeaderTitle>
                </CardHeader>
            </StyledCard100>

            <StyledCard100>
                <CardHeader>
                    <StyledHeaderTitle>
                        <Typography variant="caption">Responsible</Typography>
                        <Typography variant="body_short">{highlightSearchValue(mcPkg.mcPkg?.responsible || '')}</Typography>
                    </StyledHeaderTitle>
                </CardHeader>
            </StyledCard100>

            <StyledCard100>
                <CardHeader>
                    <StyledHeaderTitle>
                        <Typography variant="caption">Remark</Typography>
                        <Typography variant="body_short">{highlightSearchValue(mcPkg.mcPkg?.remark || '')}</Typography>
                    </StyledHeaderTitle>
                </CardHeader>
            </StyledCard100>

            <StyledDivider
                color="medium"
                variant="small"
            />

            <Typography variant="h6">Comm package info</Typography>

            <StyledCard100>
                <StyledCardHeader onClick={(): void => navigateToCommPkg()}>
                    <StyledHeaderTitle className="link-container">
                        <Typography variant="caption">Comm pkg.</Typography>
                        <Typography variant="body_short">{highlightSearchValue(mcPkg.mcPkg?.commPkgNo || '')}<LinkIndicator><EdsIcon name='launch' /></LinkIndicator></Typography>
                    </StyledHeaderTitle>
                </StyledCardHeader>
            </StyledCard100>

            <StyledCard100>
                <CardHeader>
                    <StyledHeaderTitle>
                        <Typography variant="caption">Description.</Typography>
                        <Typography variant="body_short">{highlightSearchValue(mcPkg.mcPkg?.description || '')}</Typography>
                    </StyledHeaderTitle>
                </CardHeader>
            </StyledCard100>
        </Container>
    )
};

export default MCPkgTab;
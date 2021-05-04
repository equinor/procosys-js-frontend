import { Card } from '@equinor/eds-core-react';
import { Typography } from '@equinor/eds-core-react';
import EdsIcon from '@procosys/components/EdsIcon';
import React from 'react';
import Highlighter from 'react-highlight-words';
import { ContentDocument } from '../../http/QuickSearchApiClient';
import { LinkIndicator } from '../MCPkgTab/style';
import { Container, StyledCard100, StyledCard50, StyledCardHeader, StyledHeaderTitle } from './style';

const { CardHeader, CardHeaderTitle } = Card;

export interface CommPkgTabProperties {
    commPkg: ContentDocument;
    searchValue: string;
    highlightOn: boolean;
}

const CommPkgTab = ({ commPkg, searchValue, highlightOn }: CommPkgTabProperties): JSX.Element => {

    const navigateToCommPkg = (): void => {
        // let url = location.origin + "/" + commPkg.plant?.replace('PCS$', '') + "/link";
        let url = 'https://procosysqp.equinor.com' + "/" + commPkg.plant?.replace('PCS$', '') + "/link";
        url += "/CommPkg?commPkgNo=" + commPkg.commPkg?.commPkgNo + "&project=" + commPkg.project;
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
                <StyledCardHeader onClick={(): void => navigateToCommPkg()}>
                    <StyledHeaderTitle className="link-container">
                        <Typography variant="caption">Comm pkg.</Typography>
                        <Typography variant="body_short">{highlightSearchValue(commPkg.commPkg?.commPkgNo || '')}<LinkIndicator><EdsIcon name='launch' /></LinkIndicator></Typography>
                    </StyledHeaderTitle>
                </StyledCardHeader>
            </StyledCard100>

            <StyledCard50>
                <CardHeader>
                    <CardHeaderTitle>
                        <Typography variant="caption">Plant</Typography>
                        <Typography variant="body_short">{highlightSearchValue(commPkg.plantName || '')}</Typography>
                    </CardHeaderTitle>
                </CardHeader>
            </StyledCard50>

            <StyledCard50>
                <CardHeader>
                    <CardHeaderTitle>
                        <Typography variant="caption">Project</Typography>
                        <Typography variant="body_short">{highlightSearchValue(commPkg.project || '')}</Typography>
                    </CardHeaderTitle>
                </CardHeader>
            </StyledCard50>

            <StyledCard100>
                <CardHeader>
                    <CardHeaderTitle>
                        <Typography variant="caption">Description of work</Typography>
                        <Typography variant="body_short">{highlightSearchValue(commPkg.commPkg?.descriptionOfWork || '')}</Typography>
                    </CardHeaderTitle>
                </CardHeader>
            </StyledCard100>

            <StyledCard100>
                <CardHeader>
                    <CardHeaderTitle>
                        <Typography variant="caption">Area</Typography>
                        <Typography variant="body_short">{highlightSearchValue(commPkg.commPkg?.area || '')}</Typography>
                    </CardHeaderTitle>
                </CardHeader>
            </StyledCard100>

            <StyledCard100>
                <CardHeader>
                    <CardHeaderTitle>
                        <Typography variant="caption">Responsible</Typography>
                        <Typography variant="body_short">{highlightSearchValue(commPkg.commPkg?.responsible || '')}</Typography>
                    </CardHeaderTitle>
                </CardHeader>
            </StyledCard100>

            <StyledCard100>
                <CardHeader>
                    <CardHeaderTitle>
                        <Typography variant="caption">Remark</Typography>
                        <Typography variant="body_short">{highlightSearchValue(commPkg.commPkg?.remark || '')}</Typography>
                    </CardHeaderTitle>
                </CardHeader>
            </StyledCard100>

            <StyledCard100>
                <CardHeader>
                    <CardHeaderTitle>
                        <Typography variant="caption">Path</Typography>
                        <Typography variant="body_short">{highlightSearchValue(commPkg.commPkg?.path || '')}</Typography>
                    </CardHeaderTitle>
                </CardHeader>
            </StyledCard100>
        </Container>
    )
};

export default CommPkgTab;
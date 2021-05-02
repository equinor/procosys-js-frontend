import { Card } from '@equinor/eds-core-react';
import { Typography } from '@equinor/eds-core-react';
import React from 'react';
import { ContentDocument } from '../../http/QuickSearchApiClient';
import { LinkIndicator } from '../MCPkgTab/style';
import { Container, MCPackageEntry, StyledCard100, StyledCardHeader, StyledDivider, StyledHeaderTitle } from './style';
import EdsIcon from '@procosys/components/EdsIcon';
import Highlighter from 'react-highlight-words';

const { CardHeader, CardHeaderTitle } = Card;

export interface RelatedMCPkgTabProperties {
    commPkg: ContentDocument;
    searchValue: string;
    highlightOn: boolean;
}

const RelatedMCPkgTab = ({ commPkg, searchValue, highlightOn }: RelatedMCPkgTabProperties): JSX.Element => {

    const navigateToMCPkg = (mcPkgNo: string): void => {
        // let url = location.origin + "/" + commPkg.plant?.replace('PCS$', '') + "/link";
        let url = 'https://procosysqp.equinor.com' + "/" + commPkg.plant?.replace('PCS$', '') + "/link";
        url += "/MCPkg?mcPkgNo=" + mcPkgNo + "&project=" + commPkg.project;
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
            {
                commPkg.commPkg?.mcPkgs?.map((pkg) => {
                    return (
                        <MCPackageEntry key={pkg.mcPkgId}>
                            <StyledCard100>
                                <StyledCardHeader onClick={(): void => navigateToMCPkg(pkg.mcPkgNo as string)}>
                                    <StyledHeaderTitle className="link-container">
                                        <Typography variant="caption">MC pkg.</Typography>
                                        <Typography variant="body_short">{highlightSearchValue(pkg.mcPkgNo || '')}<LinkIndicator><EdsIcon name='launch' /></LinkIndicator></Typography>
                                    </StyledHeaderTitle>
                                </StyledCardHeader>
                            </StyledCard100>

                            <StyledCard100>
                                <CardHeader>
                                    <CardHeaderTitle>
                                        <Typography variant="caption">Description</Typography>
                                        <Typography variant="body_short">{highlightSearchValue(pkg.mcPkgDescription || '')}</Typography>
                                    </CardHeaderTitle>
                                </CardHeader>
                            </StyledCard100>
                            <StyledDivider
                                color="medium"
                                variant="small"
                            />
                        </MCPackageEntry>
                    );
                })
            }
        </Container>
    )
};

export default RelatedMCPkgTab;
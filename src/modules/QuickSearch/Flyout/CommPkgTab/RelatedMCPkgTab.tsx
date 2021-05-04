import { Card } from '@equinor/eds-core-react';
import { Typography } from '@equinor/eds-core-react';
import React, { useEffect, useState } from 'react';
import { ContentDocument, SearchResult } from '../../http/QuickSearchApiClient';
import { LinkIndicator } from '../MCPkgTab/style';
import { Container, LoadingDiv, MCPackageEntry, StyledCard100, StyledCardHeader, StyledDivider, StyledHeaderTitle } from './style';
import EdsIcon from '@procosys/components/EdsIcon';
import Highlighter from 'react-highlight-words';
import { useQuickSearchContext } from '../../context/QuickSearchContext';
import Loading from '@procosys/components/Loading';

const { CardHeader, CardHeaderTitle } = Card;

export interface RelatedMCPkgTabProperties {
    commPkg: ContentDocument;
    searchValue: string;
    highlightOn: boolean;
}

const RelatedMCPkgTab = ({ commPkg, searchValue, highlightOn }: RelatedMCPkgTabProperties): JSX.Element => {
    const [searching, setSearching] = useState<boolean>(false);
    const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
    const { apiClient } = useQuickSearchContext();

    const navigateToMCPkg = (mcPkgNo: string): void => {
        // let url = location.origin + "/" + commPkg.plant?.replace('PCS$', '') + "/link";
        let url = 'https://procosysqp.equinor.com' + "/" + commPkg.plant?.replace('PCS$', '') + "/link";
        url += "/MCPkg?mcPkgNo=" + mcPkgNo + "&project=" + commPkg.project;
        window.open(url, '_blank');
    };

    useEffect(() => {
        getMCPackages();
    }, [])

    const getMCPackages = (): void => {
        setSearching(true);
        apiClient.getMCPackages(commPkg.commPkg?.commPkgNo || '', commPkg.plant || '').then((searchResult: SearchResult) => {
            setSearchResult(searchResult);
        }).finally(() => {
            setSearching(false);
        });
    }

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
                searching ? <LoadingDiv><Loading title="Getting MC packages..." variant="h4" /></LoadingDiv> : (
                    searchResult?.items.map((pkg) => {
                        return (
                            <MCPackageEntry key={pkg.key}>
                                <StyledCard100>
                                    <StyledCardHeader onClick={(): void => navigateToMCPkg(pkg.mcPkg?.mcPkgNo as string)}>
                                        <StyledHeaderTitle className="link-container">
                                            <Typography variant="caption">MC pkg.</Typography>
                                            <Typography variant="body_short">{highlightSearchValue(pkg.mcPkg?.mcPkgNo || '')}<LinkIndicator><EdsIcon name='launch' /></LinkIndicator></Typography>
                                        </StyledHeaderTitle>
                                    </StyledCardHeader>
                                </StyledCard100>

                                <StyledCard100>
                                    <CardHeader>
                                        <CardHeaderTitle>
                                            <Typography variant="caption">Description</Typography>
                                            <Typography variant="body_short">{highlightSearchValue(pkg.mcPkg?.description || '')}</Typography>
                                        </CardHeaderTitle>
                                    </CardHeader>
                                </StyledCard100>

                                <StyledCard100>
                                    <CardHeader>
                                        <CardHeaderTitle>
                                            <Typography variant="caption">Discipline</Typography>
                                            <Typography variant="body_short">{highlightSearchValue(pkg.mcPkg?.discipline || '')}</Typography>
                                        </CardHeaderTitle>
                                    </CardHeader>
                                </StyledCard100>

                                <StyledCard100>
                                    <CardHeader>
                                        <CardHeaderTitle>
                                            <Typography variant="caption">Responsible</Typography>
                                            <Typography variant="body_short">{highlightSearchValue(pkg.mcPkg?.responsible || '')}</Typography>
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
                )
            }
        </Container>
    )
};

export default RelatedMCPkgTab;
import {
    Container,
    LoadingDiv,
    MCPackageEntry,
    StyledCard100,
    StyledTypographyLink,
    StyledDivider,
    StyledHeaderTitle,
    StyledHeaderTitleLink,
} from './style';
import { ContentDocument, SearchResult } from '../../http/QuickSearchApiClient';
import React, { useEffect, useState } from 'react';

import { Card } from '@equinor/eds-core-react';
import EdsIcon from '@procosys/components/EdsIcon';
import Highlighter from 'react-highlight-words';
import { LinkIndicator } from '../MCPkgTab/style';
import Loading from '@procosys/components/Loading';
import { Typography } from '@equinor/eds-core-react';
import { useQuickSearchContext } from '../../context/QuickSearchContext';

export interface RelatedMCPkgTabProperties {
    commPkg: ContentDocument;
    searchValue: string;
    highlightOn: boolean;
}

const RelatedMCPkgTab = ({
    commPkg,
    searchValue,
    highlightOn,
}: RelatedMCPkgTabProperties): JSX.Element => {
    const [searching, setSearching] = useState<boolean>(false);
    const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
    const { apiClient } = useQuickSearchContext();

    const navigateToMCPkg = (mcPkgNo: string): void => {
        if (!commPkg.plant)
            throw new Error('Unable to navigate. Plant is missing.');

        let url =
            location.origin +
            '/' +
            commPkg.plant?.replace('PCS$', '') +
            '/link';
        url +=
            '/MCPkg?mcPkgNo=' +
            mcPkgNo +
            '&project=' +
            commPkg.project?.toLocaleUpperCase();
        window.open(url, '_blank');
    };

    useEffect(() => {
        getMCPackages();
    }, []);

    const getMCPackages = async (): Promise<void> => {
        setSearching(true);
        const searchResult = await apiClient.getMCPackages(
            commPkg.commPkg?.commPkgNo ?? '',
            commPkg.plant ?? ''
        );
        setSearchResult(searchResult);
        setSearching(false);
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
            {searching ? (
                <LoadingDiv>
                    <Loading title="Getting MC packages..." variant="h4" />
                </LoadingDiv>
            ) : (
                searchResult?.items.map((pkg) => {
                    return (
                        <MCPackageEntry key={pkg.key}>
                            <StyledCard100>
                                <Card.Header>
                                    <StyledHeaderTitleLink className="link-container">
                                        <Typography variant="caption">
                                            MC pkg.
                                        </Typography>
                                        <StyledTypographyLink
                                            variant="body_short"
                                            onClick={(): void =>
                                                navigateToMCPkg(
                                                    pkg.mcPkg?.mcPkgNo as string
                                                )
                                            }
                                        >
                                            {highlightSearchValue(
                                                pkg.mcPkg?.mcPkgNo ?? ''
                                            )}
                                            <LinkIndicator>
                                                <EdsIcon name="external_link" />
                                            </LinkIndicator>
                                        </StyledTypographyLink>
                                    </StyledHeaderTitleLink>
                                </Card.Header>
                            </StyledCard100>

                            <StyledCard100>
                                <Card.Header>
                                    <StyledHeaderTitle>
                                        <Typography variant="caption">
                                            Description
                                        </Typography>
                                        <Typography variant="body_short">
                                            {highlightSearchValue(
                                                pkg.mcPkg?.description ?? ''
                                            )}
                                        </Typography>
                                    </StyledHeaderTitle>
                                </Card.Header>
                            </StyledCard100>

                            <StyledCard100>
                                <Card.Header>
                                    <StyledHeaderTitle>
                                        <Typography variant="caption">
                                            Discipline
                                        </Typography>
                                        <Typography variant="body_short">
                                            {highlightSearchValue(
                                                pkg.mcPkg?.discipline ?? ''
                                            )}
                                        </Typography>
                                    </StyledHeaderTitle>
                                </Card.Header>
                            </StyledCard100>

                            <StyledCard100>
                                <Card.Header>
                                    <StyledHeaderTitle>
                                        <Typography variant="caption">
                                            Responsible
                                        </Typography>
                                        <Typography variant="body_short">
                                            {highlightSearchValue(
                                                pkg.mcPkg?.responsible ?? ''
                                            )}
                                        </Typography>
                                    </StyledHeaderTitle>
                                </Card.Header>
                            </StyledCard100>
                            <StyledDivider color="medium" variant="small" />
                        </MCPackageEntry>
                    );
                })
            )}
        </Container>
    );
};

export default RelatedMCPkgTab;

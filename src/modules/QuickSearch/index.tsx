import EdsIcon from '@procosys/components/EdsIcon';
import Loading from '@procosys/components/Loading';
import ProcosysTable from '@procosys/components/Table';
import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { useLocation } from 'react-router-dom';
import { TableOptions, UseTableRowProps } from 'react-table';
import { useQuickSearchContext } from './context/QuickSearchContext';
import QuickSearchFilters from './Filters';
import QuickSearchFlyout from './Flyout/QuickSearchFlyout';
import { StyledSideSheet } from './Flyout/style';
import { ContentDocument, SearchResult } from './http/QuickSearchApiClient';
import {
    Container,
    DescriptionCell,
    DescriptionPart,
    FilterChip,
    FiltersAndSortRow,
    LinkButton,
    PackageNoPart,
    ResultsContainer,
    SearchContainer,
    SelectedFilters,
    StyledButton,
    TopDiv,
    StyledHeader
} from './style';
import queryString from 'query-string'
import Highlighter from 'react-highlight-words';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { getFormattedDate } from '@procosys/core/services/DateService';

const QuickSearch = (): JSX.Element => {
    const [showFilter, setShowFilter] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>('');
    const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
    const [filteredItems, setFilteredItems] = useState<ContentDocument[]>([]);
    const [searching, setSearching] = useState<boolean>(false);
    const [pageSize, setPageSize] = useState<number>(25);
    const [displayFlyout, setDisplayFlyout] = useState<boolean>(false);
    const [filterPlants, setFilterPlants] = useState<string[]>([]);
    const [filterTypes, setFilterTypes] = useState<string[]>([]);
    const [selectedPlants, setSelectedPlants] = useState<string[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [plantFilterExpanded, setPlantFilterExpanded] = useState<boolean>(true);
    const [typeFilterExpanded, setTypeFilterExpanded] = useState<boolean>(true);
    const [currentItem, setCurrentItem] = useState<ContentDocument | null>(null);
    const highlightOn = true;

    const { search } = useLocation();

    useEffect(() => {
        const values = queryString.parse(search)

        if (values && values.query) {
            const searchVal = values.query as string;
            setSearchValue(searchVal);

            if (values) {
                if (searchVal.length > 2) {
                    setSearching(true);
                    apiClient.doSearch(searchVal).then((searchResult: SearchResult) => {
                        setSearchResult(searchResult);
                        setFilteredItems(searchResult.items);
                        prepareFilters(searchResult.items || []);
                    }).finally(() => {
                        const filteredPlants = [];
                        if (values.plant && values.plant.length > 0) {
                            if (typeof (values.plant) === 'string')
                                filteredPlants.push(values.plant as string);
                            else {
                                (values.plant as string[]).forEach(p => {
                                    filteredPlants.push(p);
                                })

                            }
                            setSelectedPlants(filteredPlants);
                        }

                        const filteredTypes = [];
                        if (values.type && values.type.length > 0) {
                            if (typeof (values.type) === 'string')
                                filteredTypes.push(values.type as string);
                            else {
                                (values.type as string[]).forEach(p => {
                                    filteredTypes.push(p);
                                })

                            }
                            setSelectedTypes(filteredTypes);
                        }

                        setSearching(false);
                    });
                } else {
                    setSearchResult(null);
                }
            }
        }
    }, [])

    const generateUrl = (): void => {
        navigator.clipboard.writeText(location.href);
        showSnackbarNotification('Link copied to clipboard.', 5000);
    }

    const navigateToItem = (item: ContentDocument): void => {
        let url = location.origin + "/" + item.plant?.replace('PCS$', '') + "/link";

        if (item.commPkg) {
            url += "/CommPkg?commPkgNo=" + item.commPkg.commPkgNo + "&project=" + item.project;
        }

        if (item.mcPkg) {
            url += "/MCPkg?mcPkgNo=" + item.mcPkg.mcPkgNo + "&project=" + item.project;
        }

        window.open(url, '_blank');
    }

    const highlightSearchValue = (text: string): JSX.Element => {
        if (!highlightOn) return <span>{text}</span>;

        return <Highlighter
            searchWords={searchValue.split(' ')}
            autoEscape={true}
            textToHighlight={text}
        />
    };

    const getLink = (row: TableOptions<ContentDocument>): JSX.Element => {
        const doc = row.value as ContentDocument;
        return (
            <DescriptionCell className={currentItem && currentItem.key === doc.key ? 'selected' : ''} onClick={(): void => { handleItemClick(doc) }}>
                <LinkButton variant="ghost" onClick={(): void => navigateToItem(doc)}>
                    <EdsIcon name='launch' />
                </LinkButton>
            </DescriptionCell>
        )
    }

    const getNumber = (row: TableOptions<ContentDocument>): JSX.Element => {
        const doc = row.value as ContentDocument;
        const pkgNo = doc.commPkg ? doc.commPkg.commPkgNo || '' : doc.mcPkg ? doc.mcPkg.mcPkgNo || '' : '';

        return (
            <DescriptionCell className={currentItem && currentItem.key === doc.key ? 'selected' : ''} onClick={(): void => { handleItemClick(doc) }}>
                <PackageNoPart>
                    {highlightSearchValue(pkgNo)}
                </PackageNoPart>
            </DescriptionCell>
        )
    }

    const getDescription = (row: TableOptions<ContentDocument>): JSX.Element => {
        const doc = row.value as ContentDocument;
        if (doc.commPkg) {

            return (
                <DescriptionCell className={currentItem && currentItem.key === doc.key ? 'selected' : ''} onClick={(): void => { handleItemClick(doc) }}>
                    {/* <TypeIndicator><span>{doc.type}</span></TypeIndicator> */}

                    <DescriptionPart>
                        {highlightSearchValue(doc.commPkg.description || '')}
                    </DescriptionPart>
                </DescriptionCell>
            );
        }

        if (doc.mcPkg) {

            return (
                <DescriptionCell className={currentItem && currentItem.key === doc.key ? 'selected' : ''} onClick={(): void => { handleItemClick(doc) }}>
                    {/* <TypeIndicator><span>{doc.type}</span></TypeIndicator> */}
                    <DescriptionPart>
                        {highlightSearchValue(doc.mcPkg.description || '')}
                    </DescriptionPart>
                </DescriptionCell>
            )
        }
        return <div></div>;
    };

    const getDateColumn = (row: TableOptions<ContentDocument>): JSX.Element => {
        const doc = row.value as ContentDocument;
        return (
            <DescriptionCell className={currentItem && currentItem.key === doc.key ? 'selected' : ''} onClick={(): void => { handleItemClick(doc) }}>
                {getFormattedDate(doc.lastUpdated)}
            </DescriptionCell>
        );
    };

    const handleItemClick = (item: ContentDocument): void => {
        setCurrentItem(item);
        setShowFilter(false);
    }

    useEffect(() => {
        if (currentItem) {
            setDisplayFlyout(true);
        } else {
            setDisplayFlyout(false);
        }
    }, [currentItem])

    const columns = [
        {
            Header: '',
            accessor: (d: UseTableRowProps<ContentDocument>): UseTableRowProps<ContentDocument> => d,
            id: 'link',
            Cell: getLink,
            width: 30,
            minWidth: 30,
            maxWidth: 40,
            defaultCanSort: false
        },
        {
            Header: 'No.',
            accessor: (d: UseTableRowProps<ContentDocument>): UseTableRowProps<ContentDocument> => d,
            id: 'no',
            Cell: getNumber,
            width: 110,
            maxWidth: 110,
            minWidth: 50,
            sortType: (a: UseTableRowProps<ContentDocument>, b: UseTableRowProps<ContentDocument>): 0 | -1 | 1 => {
                const firstValue = (a.original.commPkg ? a.original.commPkg.commPkgNo : a.original.mcPkg?.mcPkgNo) || '';
                const secondValue = (b.original.commPkg ? b.original.commPkg.commPkgNo : b.original.mcPkg?.mcPkgNo) || '';
                if (firstValue > secondValue)
                    return 1;
                else if (firstValue < secondValue)
                    return -1;
                else
                    return 0;
            }
        },
        {
            Header: 'Description',
            accessor: (d: UseTableRowProps<ContentDocument>): UseTableRowProps<ContentDocument> => d,
            id: 'id',
            Cell: getDescription,
            width: 250,
            minWidth: 180,
            maxWidth: 500,
            sortType: (a: UseTableRowProps<ContentDocument>, b: UseTableRowProps<ContentDocument>): 0 | -1 | 1 => {
                const firstValue = (a.original.commPkg ? a.original.commPkg.description : a.original.mcPkg?.description) || '';
                const secondValue = (b.original.commPkg ? b.original.commPkg.description : b.original.mcPkg?.description) || '';
                if (firstValue > secondValue)
                    return 1;
                else if (firstValue < secondValue)
                    return -1;
                else
                    return 0;
            }
        },
        {
            Header: 'Last updated',
            accessor: (d: UseTableRowProps<ContentDocument>): UseTableRowProps<ContentDocument> => d,
            id: 'updated',
            Cell: getDateColumn,
            sortType: (a: UseTableRowProps<ContentDocument>, b: UseTableRowProps<ContentDocument>): 0 | -1 | 1 => {
                const firstDate = new Date(a.original.lastUpdated || '').getTime();
                const secondDate = new Date(b.original.lastUpdated || '').getTime();
                if (firstDate > secondDate)
                    return 1;
                else if (firstDate < secondDate)
                    return -1;
                else
                    return 0;
            }
        }
    ]

    const {
        apiClient
    } = useQuickSearchContext();

    const clearFilters = (): void => {
        setSelectedTypes([]);
        setSelectedPlants([]);
    }

    const prepareFilters = (items: ContentDocument[]): void => {
        if (items.length === 0) {
            clearFilters();
            return;
        }
        // plants
        const plants = [...new Set(items.map((res => res.plantName)))];
        plants.length > 0 ? setFilterPlants(plants as string[]) : setFilterPlants([]);

        // types
        const types = [...new Set(items.map((res => res.type)))];
        types.length > 0 ? setFilterTypes(types as string[]) : setFilterTypes([]);
    }

    const onCheckboxPlantFilterChange = (plant: string, checked: boolean): void => {
        if (checked) {
            setSelectedPlants([...selectedPlants, plant]);
            history.replaceState(null, '', location.href + '&plant=' + plant)
        } else {
            const newUrl = decodeURI(location.href).replace('&plant=' + plant, '');
            history.replaceState(null, '', encodeURI(newUrl));
            setSelectedPlants(selectedPlants.filter(s => s !== plant));
        }
    }

    const onCheckboxTypeFilterChange = (type: string, checked: boolean): void => {
        if (checked) {
            setSelectedTypes([...selectedTypes, type]);
            history.replaceState(null, '', location.href + '&type=' + type)
        } else {
            const newUrl = location.href.replace('&type=' + type, '');
            history.replaceState(null, '', newUrl);
            setSelectedTypes(selectedTypes.filter(s => s !== type));
        }
    }

    const handlePlantRemove = (plant: string): void => {
        setSelectedPlants(selectedPlants.filter(s => s !== plant));
    }

    const handleTypeRemove = (type: string): void => {
        setSelectedTypes(selectedTypes.filter(t => t !== type));
    }

    useEffect(() => {
        if (searchResult && searchResult.items.length > 0) {
            let currentItems = [...searchResult.items];

            if (selectedPlants.length > 0) {
                currentItems = currentItems.filter(item => selectedPlants.indexOf(item.plantName || '') > -1);
            }

            if (selectedTypes.length > 0) {
                currentItems = currentItems.filter(item => selectedTypes.indexOf(item.type || '') > -1);
            }

            setFilteredItems(currentItems);
        }
    }, [selectedPlants, selectedTypes]);

    const toggleShowFilter = (): void => {
        if (!showFilter) {
            setCurrentItem(null);
        }
        setShowFilter(!showFilter);
    }

    return (
        <Container>
            <SearchContainer withSidePanel={(showFilter && !currentItem)}>
                <Helmet titleTemplate={'ProCoSys - Quick Search'} />
                <TopDiv>
                    <StyledHeader variant="h1">Quick Search Results</StyledHeader>
                    <StyledButton onClick={(): void => toggleShowFilter()} variant="ghost">{showFilter ? 'Hide filters' : 'Show filters'} <EdsIcon name='filter_list' /></StyledButton>
                    {(selectedTypes.length > 0 || selectedPlants.length > 0) && (
                        <StyledButton onClick={(): void => clearFilters()} variant="ghost">Clear filters<EdsIcon name='close' /></StyledButton>
                    )}
                    <StyledButton onClick={(): void => { generateUrl() }} variant="ghost">Share link <EdsIcon name='share' /></StyledButton>
                </TopDiv>

                <FiltersAndSortRow currentItem={currentItem}>
                    <SelectedFilters>
                        {selectedPlants && (
                            selectedPlants.map((plant) => {
                                return (<FilterChip variant="active" onDelete={(): void => handlePlantRemove(plant)} key={plant}>{plant}</FilterChip>)
                            })
                        )}

                        {selectedTypes && (
                            selectedTypes.map((type) => {
                                return (<FilterChip variant="active" onDelete={(): void => handleTypeRemove(type)} key={type}>{'Type: ' + (type === 'C' ? 'Comm pkg' : 'MC pkg')}</FilterChip>)
                            })
                        )}

                    </SelectedFilters>
                </FiltersAndSortRow>

                <ResultsContainer currentItem={currentItem}>
                    {
                        searching ? <Loading title="Searching" /> : (
                            !searchResult || searchResult.items.length === 0 ? 'No results' : (
                                <ProcosysTable
                                    data={filteredItems}
                                    maxRowCount={filteredItems.length}
                                    setPageSize={setPageSize}
                                    pageSize={pageSize}
                                    columns={columns}
                                    noHeader={false}
                                    clientPagination={true}
                                    clientSorting={true}
                                    pageIndex={0}
                                />
                            )
                        )
                    }
                </ResultsContainer>
                {
                    displayFlyout && currentItem && (
                        <StyledSideSheet
                            onClose={(): void => setCurrentItem(null)}
                            open={displayFlyout}
                            title={(currentItem as ContentDocument).commPkg ? 'Preview Comm package' : 'Preview MC package'}
                            variant="large">
                            <QuickSearchFlyout highlightOn={highlightOn} searchValue={searchValue} item={currentItem as ContentDocument} />
                        </StyledSideSheet>
                    )
                }
            </SearchContainer>
            {
                showFilter && !currentItem && (
                    <QuickSearchFilters
                        plantFilterExpanded={plantFilterExpanded}
                        setShowFilter={setShowFilter}
                        setPlantFilterExpanded={setPlantFilterExpanded}
                        filterPlants={filterPlants}
                        selectedPlants={selectedPlants}
                        onCheckboxPlantFilterChange={onCheckboxPlantFilterChange}
                        typeFilterExpanded={typeFilterExpanded}
                        setTypeFilterExpanded={setTypeFilterExpanded}
                        filterTypes={filterTypes}
                        selectedTypes={selectedTypes}
                        onCheckboxTypeFilterChange={onCheckboxTypeFilterChange}
                    />
                )
            }
        </Container>
    )
};

export default QuickSearch;
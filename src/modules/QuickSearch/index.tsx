import { NativeSelect, Typography } from '@equinor/eds-core-react';
import EdsIcon from '@procosys/components/EdsIcon';
import Loading from '@procosys/components/Loading';
import ProcosysTable from '@procosys/components/Table';
import debounce from "lodash/debounce";
import React, { useCallback, useEffect, useState } from 'react';
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
    QuickSearchSearchRow,
    LinkButton,
    PackageNoPart,
    ResultsContainer,
    SearchAndFilter,
    SearchContainer,
    SelectedFilters,
    SortOrder,
    StyledButton,
    StyledSearch,
    TypeIndicator,
    TopDiv,
    StyledHeader
} from './style';
import queryString from 'query-string'

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
    const test = useLocation();

    useEffect(() => {
        // console.log('search', search);
        // console.log('test', test)
        const values = queryString.parse(search)
        if (values && values.query) {
            const searchVal = values.query as string;
            setSearchValue(searchVal);

            if (values && values.dosearch) {
                // debounceSearchHandler(values.query as string);

                if (searchVal.length > 2) {
                    setSearching(true);
                    apiClient.doSearch(searchVal).then((searchResult: SearchResult) => {
                        setSearchResult(searchResult);
                        setFilteredItems(searchResult.items);
                        prepareFilters(searchResult.items || []);
                    }).finally(() => {
                        setSearching(false);
                    });
                } else {
                    setSearchResult(null);
                }

            }
        }
        // console.log(values.query);
        // console.log(values.filters);
    }, [])

    const navigateToItem = (item: ContentDocument): void => {
        // let url = location.origin + "/" + item.plant?.replace('PCS$', '') + "/link";
        let url = 'https://procosysqp.equinor.com' + "/" + item.plant?.replace('PCS$', '') + "/link";
        if (item.commPkg) {
            url += "/CommPkg?commPkgNo=" + item.commPkg.commPkgNo + "&project=" + item.project;
        }

        if (item.mcPkg) {
            url += "/MCPkg?mcPkgNo=" + item.mcPkg.mcPkgNo + "&project=" + item.project;
        }

        window.open(url, '_blank');
    }


    const getDescription = (row: TableOptions<ContentDocument>): JSX.Element => {
        const doc = row.value as ContentDocument;
        let startIndexNo = -1;
        let startIndexDescription = -1;
        let numberField = '';
        let descriptionField = '';

        if (doc.commPkg) {
            numberField = doc.commPkg.commPkgNo || '';
            descriptionField = doc.commPkg.description || '';

            startIndexNo = numberField.toLowerCase().indexOf(searchValue.toLowerCase());
            startIndexDescription = descriptionField.toLowerCase().indexOf(searchValue.toLowerCase());

            return (
                <DescriptionCell className={currentItem && currentItem.id === doc.id ? 'selected' : ''} onClick={(): void => { handleItemClick(doc) }}>
                    {/* <TypeIndicator><span>{doc.type}</span></TypeIndicator> */}
                    <LinkButton variant="ghost" onClick={(): void => navigateToItem(doc)}>
                        <EdsIcon name='launch' />
                    </LinkButton>
                    <PackageNoPart>
                        {
                            highlightOn ? (
                                startIndexNo > -1 ? (
                                    startIndexNo === 0 ? (
                                        <span><mark>{numberField.substr(0, searchValue.length)}</mark>{numberField.substr(searchValue.length)}</span>
                                    ) : (
                                        <span><mark>{numberField.substr(startIndexNo, searchValue.length)}</mark>{numberField.substr(startIndexNo + searchValue.length)}</span>
                                    )
                                ) : (<span>{numberField}</span>)
                            ) : (
                                numberField
                            )
                        }
                    </PackageNoPart>
                    <DescriptionPart>
                    {
                            highlightOn ? (
                                startIndexDescription > -1 ? (
                                    startIndexDescription === 0 ? (
                                        <span><mark>{descriptionField.substr(0, searchValue.length)}</mark>{descriptionField.substr(searchValue.length)}</span>
                                    ) : (
                                        <span><mark>{descriptionField.substr(startIndexDescription, searchValue.length)}</mark>{descriptionField.substr(startIndexDescription + searchValue.length)}</span>
                                    )
                                ) : (<span>{descriptionField}</span>)
                            ) : (
                                descriptionField
                            )
                        }
                    </DescriptionPart>

                </DescriptionCell>
            );
        }

        if (doc.mcPkg) {
            numberField = doc.mcPkg.mcPkgNo || '';
            descriptionField = doc.mcPkg.description || '';

            startIndexNo = numberField.toLowerCase().indexOf(searchValue.toLowerCase());
            startIndexDescription = descriptionField.toLowerCase().indexOf(searchValue.toLowerCase());

            return (
                <DescriptionCell className={currentItem && currentItem.id === doc.id ? 'selected' : ''} onClick={(): void => { handleItemClick(doc) }}>
                    {/* <TypeIndicator><span>{doc.type}</span></TypeIndicator> */}
                    <LinkButton variant="ghost" onClick={(): void => navigateToItem(doc)}>
                        <EdsIcon name='launch' />
                    </LinkButton>
                    <PackageNoPart>
                        {
                            highlightOn ? (
                                startIndexNo > -1 ? (
                                    startIndexNo === 0 ? (
                                        <span><mark>{numberField.substr(0, searchValue.length)}</mark>{numberField.substr(searchValue.length)}</span>
                                    ) : (
                                        <span><mark>{numberField.substr(startIndexNo, searchValue.length)}</mark>{numberField.substr(startIndexNo + searchValue.length)}</span>
                                    )
                                ) : (<span>{numberField}</span>)
                            ) : (
                                numberField
                            )
                        }
                    </PackageNoPart>
                    <DescriptionPart>
                    {
                            highlightOn ? (
                                startIndexDescription > -1 ? (
                                    startIndexDescription === 0 ? (
                                        <span><mark>{descriptionField.substr(0, searchValue.length)}</mark>{descriptionField.substr(searchValue.length)}</span>
                                    ) : (
                                        <span><mark>{descriptionField.substr(startIndexDescription, searchValue.length)}</mark>{descriptionField.substr(startIndexDescription + searchValue.length)}</span>
                                    )
                                ) : (<span>{descriptionField}</span>)
                            ) : (
                                descriptionField
                            )
                        }
                    </DescriptionPart>
                </DescriptionCell>
            )
        }
        return <div></div>;
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
            Header: 'Description',
            accessor: (d: UseTableRowProps<ContentDocument>): UseTableRowProps<ContentDocument> => d,
            id: 'id',
            width: 90,
            Cell: getDescription
        }
    ]

    const {
        apiClient
    } = useQuickSearchContext();

    const debounceSearchHandler = useCallback(
        debounce((value: string) => {
            if (value.length > 2) {
                setSearching(true);
                apiClient.doSearch(value).then((searchResult: SearchResult) => {
                    setSearchResult(searchResult);
                    setFilteredItems(searchResult.items);
                    prepareFilters(searchResult.items || []);
                }).finally(() => {
                    setSearching(false);
                });
            } else {
                setSearchResult(null);
            }
        }, 500),
        []
    );

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

    // const handleOnChange = useCallback((e: { target: { value: string; }; }) => {
    //     const searchVal = e.target.value;

    //     if (!searchVal) {
    //         setFilterPlants([]);
    //         setFilterTypes([]);
    //         setShowFilter(false);
    //     }

    //     setCurrentItem(null);
    //     clearFilters();
    //     setSearchValue(searchVal);
    //     debounceSearchHandler(searchVal);
    // }, [debounceSearchHandler])


    const onCheckboxPlantFilterChange = (plant: string, checked: boolean): void => {
        if (checked) {
            setSelectedPlants([...selectedPlants, plant]);
        } else {
            setSelectedPlants(selectedPlants.filter(s => s !== plant));
        }
    }

    const onCheckboxTypeFilterChange = (type: string, checked: boolean): void => {
        if (checked) {
            setSelectedTypes([...selectedTypes, type]);
        } else {
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
                    <SortOrder>
                        <NativeSelect
                            id="sort-by-select"
                            label="Sort by"
                        >
                            <option>Relevance</option>
                            <option>Date</option>
                        </NativeSelect>
                    </SortOrder>
                </TopDiv>

                {/* <QuickSearchSearchRow>
                    <SearchAndFilter>
                        <StyledSearch onChange={handleOnChange} name="procosys-qs" id="procosys-qs" autocomplete="on" autoFocus value={searchValue}></StyledSearch>
                        {searchResult && filteredItems.length > 0 && (
                            <>
                                <StyledButton onClick={(): void => toggleShowFilter()} variant="ghost">{showFilter ? 'Hide filters' : 'Show filters'} <EdsIcon name='filter_list' /></StyledButton>
                                {(selectedTypes.length > 0 || selectedPlants.length > 0) && (
                                    <StyledButton onClick={(): void => clearFilters()} variant="ghost">Clear filters<EdsIcon name='close' /></StyledButton>
                                )}
                                <SortOrder>
                                    <NativeSelect
                                        id="sort-by-select"
                                        label="Sort by"
                                    >
                                        <option>Relevance</option>
                                        <option>Date</option>
                                    </NativeSelect>
                                </SortOrder>
                            </>
                        )}
                    </SearchAndFilter>

                </QuickSearchSearchRow> */}
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
                                    noHeader={true}
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
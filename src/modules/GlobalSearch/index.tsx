import { SingleSelect, Typography } from '@equinor/eds-core-react';
import EdsIcon from '@procosys/components/EdsIcon';
import Loading from '@procosys/components/Loading';
import ProcosysTable from '@procosys/components/Table';
import debounce from "lodash/debounce";
import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { TableOptions, UseTableRowProps } from 'react-table';
import { useGlobalSearchContext } from './context/GlobalSearchContext';
import GlobalSearchFilters from './Filters';
import GlobalSearchFlyout from './Flyout/GlobalSearchFlyout';
import { StyledSideSheet } from './Flyout/style';
import { ContentDocument, SearchResult } from './http/GlobalSearchApiClient';
import { Container, DescriptionCell, DescriptionPart, FilterChip, FiltersAndSortRow, GlobalSearchSearchRow, LinkButton, PackageNoPart, ResultsContainer, SearchAndFilter, SearchContainer, SelectedFilters, SortOrder, StyledButton, StyledSearch, TypeIndicator } from './style';

const GlobalSearch = (): JSX.Element => {
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

    const navigateToItem = (item: ContentDocument): void => {
        let url = location.origin + "/" + item.plant?.replace('PCS$', '') + "/link";
        if (item.commPkg) {
            url += "/CommPkg?commPkgNo=" + item.commPkg.commPkgNo + "&project=" + item.project;
        }

        if (item.mcPkg) {
            url += "/MCPkg?commPkgNo=" + item.mcPkg.mcPkgNo + "&project=" + item.project;
        }

        window.open(url, '_blank');
    }


    const getDescription = (row: TableOptions<ContentDocument>): JSX.Element => {
        const doc = row.value as ContentDocument;

        if (doc.commPkg) {
            return (
                <DescriptionCell className={currentItem && currentItem.id === doc.id ? 'selected' : ''} onClick={(): void => { handleItemClick(doc) }}>
                    <LinkButton variant="ghost" onClick={(): void => navigateToItem(doc)}>
                        <EdsIcon name='launch' />
                    </LinkButton>
                    <PackageNoPart>
                        {doc.commPkg?.commPkgNo}
                    </PackageNoPart>
                    <DescriptionPart>
                        {/* <TypeIndicator><span>{doc.type}</span></TypeIndicator> */}
                        {doc.commPkg?.description}
                    </DescriptionPart>

                </DescriptionCell>
            );
        }

        if (doc.mcPkg) {
            return (
                <DescriptionCell className={currentItem && currentItem.id === doc.id ? 'selected' : ''} onClick={(): void => { handleItemClick(doc) }}>
                    <LinkButton variant="ghost" onClick={(): void => navigateToItem(doc)}>
                        <EdsIcon name='launch' />
                    </LinkButton>
                    <PackageNoPart>
                        {doc.mcPkg?.mcPkgNo}
                    </PackageNoPart>
                    <DescriptionPart>
                        {/* <TypeIndicator><span>{doc.type}</span></TypeIndicator> */}
                        {doc.mcPkg?.description}
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
    } = useGlobalSearchContext();

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

    const handleOnChange = useCallback((e: { target: { value: string; }; }) => {
        const searchVal = e.target.value;
        setSearchValue(searchVal);
        debounceSearchHandler(searchVal);
        setCurrentItem(null);
    }, [debounceSearchHandler])


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
                <Helmet titleTemplate={'ProCoSys - Global search'} />
                <Typography variant="h1">Global search</Typography>

                <GlobalSearchSearchRow>
                    <SearchAndFilter>
                        <StyledSearch onChange={handleOnChange} autoFocus value={searchValue}></StyledSearch>
                        {searchResult && filteredItems.length > 0 && (
                            <>
                                <StyledButton onClick={(): void => toggleShowFilter()} variant="ghost">{showFilter ? 'Hide filters' : 'Show filters'} <EdsIcon name='filter_list' /></StyledButton>
                                {(selectedTypes.length > 0 || selectedPlants.length > 0) && (
                                    <StyledButton onClick={(): void => clearFilters()} variant="ghost">Clear filters<EdsIcon name='close' /></StyledButton>
                                )}
                                <SortOrder>
                                    <SingleSelect
                                        selectedOption={'Relevance'}
                                        id="sort-by-select"
                                        label="Sort by"
                                        items={['Relevance', 'Date']}
                                    />
                                </SortOrder>
                            </>
                        )}
                    </SearchAndFilter>

                </GlobalSearchSearchRow>
                <FiltersAndSortRow currentItem={currentItem}>
                    <SelectedFilters>
                        {selectedPlants && (
                            selectedPlants.map((plant) => {
                                return (<FilterChip variant="active" onDelete={(): void => handlePlantRemove(plant)} key={plant}>{plant}</FilterChip>)
                            })
                        )}

                        {selectedTypes && (
                            selectedTypes.map((type) => {
                                return (<FilterChip variant="active" onDelete={(): void => handleTypeRemove(type)} key={type}>{'Type: ' + type}</FilterChip>)
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
                        <StyledSideSheet onClose={(): void => setCurrentItem(null)} open={displayFlyout} title={(currentItem as ContentDocument).commPkg ? 'Preview Comm package' : 'Preview MC package'} variant="large">
                            <GlobalSearchFlyout item={currentItem as ContentDocument} />
                        </StyledSideSheet>
                    )
                }
            </SearchContainer>
            {
                showFilter && !currentItem && (
                    <GlobalSearchFilters
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

export default GlobalSearch;
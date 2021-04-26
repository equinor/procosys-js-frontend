import { Chip } from '@equinor/eds-core-react';
import { Accordion, Button, SingleSelect, Typography } from '@equinor/eds-core-react';
import CloseIcon from '@material-ui/icons/Close';
import Checkbox from '@procosys/components/Checkbox';
import EdsIcon from '@procosys/components/EdsIcon';
import Loading from '@procosys/components/Loading';
import ProcosysTable from '@procosys/components/Table';
import debounce from "lodash/debounce";
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from "react-helmet";
import { TableOptions, UseTableRowProps } from 'react-table';
import { useGlobalSearchContext } from './context/GlobalSearchContext';
import { ContentDocument, SearchResult } from './http/GlobalSearchApiClient';
import { AccordionContent, Container, DescriptionCell, FilterChip, FiltersAndSortRow, FiltersContainer, FiltersTypes, GlobalSearchSearchRow, Header, LinkButton, ResultsContainer, SearchAndFilter, SearchContainer, SearchFilters, SelectedFilters, SortOrder, StyledButton, StyledSearch, TypeIndicator } from './style';

const { AccordionItem, AccordionHeader, AccordionPanel } = Accordion;

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

    const getLinkIcon = (): JSX.Element => {
        return (
            <LinkButton variant="ghost">
                <EdsIcon name='launch' />
            </LinkButton>
        );
    };

    const getDescription = useMemo(() => (row: TableOptions<ContentDocument>): JSX.Element => {
        const doc = row.value as ContentDocument;

        if (doc.commPkg) {
            return <DescriptionCell><TypeIndicator><span>{doc.type}</span></TypeIndicator>{doc.commPkg?.description}</DescriptionCell>;
        }

        if (doc.mcPkg) {
            return <DescriptionCell><TypeIndicator><span>{doc.type}</span></TypeIndicator>{doc.mcPkg?.description}</DescriptionCell>;
        }

        return <div></div>;
    }, []);

    const columns = [
        {
            Header: 'Description',
            accessor: (d: UseTableRowProps<ContentDocument>): UseTableRowProps<ContentDocument> => d,
            id: 'id',
            width: 90,
            Cell: getDescription
        },
        {
            Header: 'None',
            accessor: 'plant',
            id: 'plant',
            width: 10,
            Cell: getLinkIcon
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
                    prepareFilters(searchResult);
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

    const prepareFilters = (searchResult: SearchResult): void => {
        if (!searchResult || searchResult.hits === 0) {
            clearFilters();
            return;
        }

        // plants
        const plants = [...new Set(searchResult?.items.map((res => res.plantName)))];
        plants.length > 0 ? setFilterPlants(plants as string[]) : setFilterPlants([]);

        // types
        const types = [...new Set(searchResult?.items.map((res => res.type)))];
        types.length > 0 ? setFilterTypes(types as string[]) : setFilterTypes([]);
    }

    const handleOnChange = useCallback((e: { target: { value: any; }; }) => {
        const searchVal = e.target.value;
        setSearchValue(searchVal);
        debounceSearchHandler(searchVal);
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

    const handlePlantRemove = (plant: string) => {
        setSelectedPlants(selectedPlants.filter(s => s !== plant));
    }

    const handleTypeRemove = (type: string) => {
        setSelectedTypes(selectedTypes.filter(t => t !== type));
    }


    useEffect(() => {

        if (searchResult && searchResult.items.length > 0) {
            let tempItems = [...searchResult.items];

            if (selectedPlants.length > 0) {
                tempItems = tempItems.filter(item => selectedPlants.indexOf(item.plantName || '') > -1);
            }

            if (selectedTypes.length > 0) {
                tempItems = tempItems.filter(item => selectedTypes.indexOf(item.type || '') > -1);
            }

            setFilteredItems(tempItems);
        }
    }, [selectedPlants, selectedTypes]);

    return (
        <Container>
            <SearchContainer withSidePanel={showFilter}>
                <Helmet titleTemplate={'ProCoSys - Global search'} />
                <Typography variant="h1">Global search</Typography>

                <GlobalSearchSearchRow>
                    <SearchAndFilter>
                        <StyledSearch onChange={handleOnChange} value={searchValue}></StyledSearch>
                        <StyledButton onClick={(): void => setShowFilter(!showFilter)} variant="ghost">{showFilter ? 'Hide filters' : 'Show filters'} <EdsIcon name='filter_list' /></StyledButton>
                        {(selectedTypes.length > 0 || selectedPlants.length > 0) && (
                            <StyledButton onClick={(): void => clearFilters()} variant="ghost">Clear filters<EdsIcon name='close' /></StyledButton>
                        )}
                        
                    </SearchAndFilter>

                </GlobalSearchSearchRow>
                <FiltersAndSortRow>
                    <SelectedFilters>
                        {selectedPlants && (
                            selectedPlants.map((plant) => {
                                return (<FilterChip variant="active" onDelete={() => handlePlantRemove(plant)} key={plant}>{plant}</FilterChip>)
                            })
                        )}

                        {selectedTypes && (
                            selectedTypes.map((type) => {
                                return (<FilterChip variant="active" onDelete={() => handleTypeRemove(type)} key={type}>{'Type: ' + type}</FilterChip>)
                            })
                        )}

                    </SelectedFilters>
                    <SortOrder>
                        <SingleSelect
                            selectedOption={'Relevance'}
                            id="sort-by-select"
                            label="Sort by"
                            items={['Relevance', 'Date']}
                        />
                    </SortOrder>
                </FiltersAndSortRow>

                <ResultsContainer>
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
            </SearchContainer>
            {
                showFilter && (
                    <FiltersContainer>
                        <SearchFilters>
                            <Header filterActive={false}>
                                <Typography variant="h1">Filters</Typography>
                                <div style={{ display: 'flex' }}>
                                    <Button variant='ghost' title='Close' onClick={(): void => { setShowFilter(false); }}>
                                        <CloseIcon />
                                    </Button>
                                </div>
                            </Header>
                            <FiltersTypes>

                                <Accordion chevronPosition="right" headerLevel="h2">
                                    <AccordionItem isExpanded={plantFilterExpanded} onClick={() => setPlantFilterExpanded(!plantFilterExpanded)}>
                                        <AccordionHeader>
                                            Plant
                                        </AccordionHeader>
                                        <AccordionPanel>
                                            <AccordionContent>
                                                {
                                                    filterPlants.map((plant: string, i: number) => {
                                                        return (
                                                            <Checkbox
                                                                key={plant}
                                                                checked={selectedPlants.some(elementId => {
                                                                    return plant === String(elementId);
                                                                })}
                                                                onChange={(checked: boolean): void => {
                                                                    onCheckboxPlantFilterChange(plant, checked);
                                                                }}
                                                            >
                                                                <Typography variant='body_long'>{plant}</Typography>
                                                            </Checkbox>
                                                        )
                                                    })
                                                }
                                            </AccordionContent>

                                        </AccordionPanel>
                                    </AccordionItem>
                                    <AccordionItem isExpanded={typeFilterExpanded} onClick={() => setTypeFilterExpanded(!typeFilterExpanded)}>
                                        <AccordionHeader>
                                            Type
                                        </AccordionHeader>
                                        <AccordionPanel>
                                            <AccordionContent>
                                                {
                                                    filterTypes.map((type: string, i: number) => {
                                                        return (
                                                            <Checkbox
                                                                key={type}
                                                                checked={selectedTypes.some(elementId => {
                                                                    return type === String(elementId);
                                                                })}
                                                                onChange={(checked: boolean): void => {
                                                                    onCheckboxTypeFilterChange(type, checked);
                                                                }}
                                                            >
                                                                <Typography variant='body_long'>{type}</Typography>
                                                            </Checkbox>
                                                        )
                                                    })
                                                }
                                            </AccordionContent>

                                        </AccordionPanel>
                                    </AccordionItem>
                                </Accordion>
                            </FiltersTypes>
                        </SearchFilters>
                    </FiltersContainer>
                )
            }
        </Container>
    )
};

export default GlobalSearch;




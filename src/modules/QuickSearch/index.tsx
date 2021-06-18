import EdsIcon from '@procosys/components/EdsIcon';
import Loading from '@procosys/components/Loading';
import ProcosysTable from '@procosys/components/Table';
import React, { useEffect, useRef, useState } from 'react';
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
    ResultCell,
    FilterChip,
    FiltersAndSortRow,
    LinkButton,
    ResultsContainer,
    SearchContainer,
    SelectedFilters,
    StyledButton,
    TopDiv,
    StyledHeader,
    TypeIndicator,
    TypeCell,
    QuickSearchSearch,
    SearchFieldContainer,
    QSHeaderDiv,
    FlexDiv
} from './style';
import queryString from 'query-string'
import Highlighter from 'react-highlight-words';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { getFormattedDate } from '@procosys/core/services/DateService';
import ProCoSysSettings from '@procosys/core/ProCoSysSettings';
import CommPkgIcon from './icons/commPkg';
import MCPkgIcon from './icons/mcPkg';
import TagIcon from './icons/tag';
import styled from 'styled-components';
import { Tooltip } from '@material-ui/core';
import PunchIcon from './icons/punch';
import { useCurrentPlant } from '@procosys/core/PlantContext';
import { SearchSubText } from '../Header/style';

const StyledTooltip = styled(Tooltip)`
font-size: 14px;
`;

const QuickSearch = (): JSX.Element => {
    const [showFilter, setShowFilter] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>('');
    const [searchInputValue, setSearchInputValue] = useState<string>('');
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
    const [currentItem, setCurrentItem] = useState<ContentDocument | undefined>(undefined);
    const highlightOn = true;
    const [topDivHeight, setTopDivHeight] = useState<number>(0);
    const topDivRef = useRef<HTMLDivElement>(null);
    const { plant, setCurrentPlant } = useCurrentPlant();
    const [showSearchSubText, setShowSearchSubText] = useState<boolean>(true);
    const [searchAllPlants, setSearchAllPlants] = useState<boolean>(false);
    const { search } = useLocation();

    useEffect(() => {
        if (!ProCoSysSettings.featureIsEnabled('quickSearch')) window.location.href = location.origin;

        const values = queryString.parse(search);
        if (values && values.query) {
            const searchVal = values.query as string;
            const allPlants = values.allplants as string;

            if (allPlants === 'true') {
                setSearchAllPlants(true);
                setSearchValue(searchVal);
                setSearchInputValue(searchVal);
                return;
            }

            setSearchValue(searchVal);
            setSearchInputValue(searchVal);

            if (values) {
                if (searchVal.length > 2) {
                    setSearching(true);
                    apiClient.doSearch(searchVal, plant.id).then((searchResult: SearchResult) => {
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
            url += "/CommPkg?commPkgNo=" + encodeURIComponent(item.commPkg.commPkgNo ?? '') + "&project=" + encodeURIComponent(item.project?.toLocaleUpperCase() ?? '');
        }

        if (item.mcPkg) {
            url += "/MCPkg?mcPkgNo=" + encodeURIComponent(item.mcPkg.mcPkgNo ?? '') + "&project=" + encodeURIComponent(item.project?.toLocaleUpperCase() ?? '');
        }

        if (item.tag) {
            url += "/Tag?tagNo=" + encodeURIComponent(item.tag.tagNo ?? '') + "&project=" + encodeURIComponent(item.project?.toLocaleUpperCase() ?? '');
        }

        if (item.punchItem) {
            url += "/PunchListItem?punchListItemNo=" + encodeURIComponent(item.punchItem.punchItemNo ?? '');
        }

        window.open(url, '_blank');
    }

    const highlightSearchValue = (text: string): JSX.Element => {
        if (!highlightOn) return <span>{text}</span>;
        text = text.replaceAll('"', '');

        const searchFor = searchValue.replaceAll('"', '').split(' '); 
        
        if(searchValue.indexOf(':') === 1) {
            searchFor.push(searchValue.substr(2));
        }

        return <Highlighter
            searchWords={searchFor}
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

    const getTypeTooltipText = (type: string): string => {
        switch (type) {
            case 'C':
                return 'Comm package';
            case 'MC':
                return 'MC package';
            case 'T':
                return 'Tag';
            case 'PI':
                return 'Punch List Item';
            default:
                return 'Other';
        }
    }

    const getTypeIcon = (type: string): JSX.Element => {
        switch (type) {
            case 'C':
                return <CommPkgIcon />;
            case 'MC':
                return <MCPkgIcon />;
            case 'T':
                return <TagIcon />;
            case 'PI':
                return <PunchIcon />;
            default:
                return <TypeIndicator><span>{type}</span></TypeIndicator>;
        }
    }


    const getType = (row: TableOptions<ContentDocument>): JSX.Element => {
        const doc = row.value as ContentDocument;

        return (
            <StyledTooltip title={getTypeTooltipText(doc.type ?? '')} arrow={true} enterDelay={200} enterNextDelay={100}>
                <TypeCell className={currentItem && currentItem.key === doc.key ? 'selected' : ''} onClick={(): void => { handleItemClick(doc) }}>
                    {getTypeIcon(doc.type ?? '')}
                </TypeCell>
            </StyledTooltip>
        )
    }

    const getNumber = (row: TableOptions<ContentDocument>): JSX.Element => {
        const doc = row.value as ContentDocument;
        const pkgNo = doc.commPkg ? doc.commPkg.commPkgNo ?? ''
            : doc.mcPkg ? doc.mcPkg.mcPkgNo ?? ''
                : doc.tag ? doc.tag.tagNo ?? ''
                    : doc.punchItem ? doc.punchItem.punchItemNo ?? ''
                        : '';

        return (
            <DescriptionCell className={currentItem && currentItem.key === doc.key ? 'selected' : ''} onClick={(): void => { handleItemClick(doc) }}>
                <ResultCell variant="body_short" lines="1">
                    {highlightSearchValue(pkgNo)}
                </ResultCell>
            </DescriptionCell>
        )
    }

    const getDescription = (row: TableOptions<ContentDocument>): JSX.Element => {
        const doc = row.value as ContentDocument;

        return (
            <DescriptionCell className={currentItem && currentItem.key === doc.key ? 'selected' : ''} onClick={(): void => { handleItemClick(doc) }}>
                <ResultCell variant="body_short" lines="1" className={currentItem && currentItem.key === doc.key ? 'selected' : ''} onClick={(): void => { handleItemClick(doc) }}>
                    {highlightSearchValue(
                        doc.commPkg ? doc.commPkg.description ?? ''
                            : doc.mcPkg ? doc.mcPkg.description ?? ''
                                : doc.tag ? doc.tag.description ?? ''
                                    : doc.punchItem ? doc.punchItem.description ?? ''
                                        : '')}
                </ResultCell>
            </DescriptionCell>
        );
    };

    const getPlantName = (row: TableOptions<ContentDocument>): JSX.Element => {
        const doc = row.value as ContentDocument;
        return (
            <DescriptionCell className={currentItem && currentItem.key === doc.key ? 'selected' : ''} onClick={(): void => { handleItemClick(doc) }}>
                <ResultCell variant="body_short" lines="1">
                    {highlightSearchValue(doc.plantName ?? '')}
                </ResultCell>
            </DescriptionCell>
        );
    };

    const getProject = (row: TableOptions<ContentDocument>): JSX.Element => {
        const doc = row.value as ContentDocument;
        return (
            <DescriptionCell className={currentItem && currentItem.key === doc.key ? 'selected' : ''} onClick={(): void => { handleItemClick(doc) }}>
                <ResultCell variant="body_short" lines="1">
                    {highlightSearchValue(doc.project ?? '')}
                </ResultCell>
            </DescriptionCell>
        );
    };

    const getDateColumn = (row: TableOptions<ContentDocument>): JSX.Element => {
        const doc = row.value as ContentDocument;
        return (
            <DescriptionCell className={currentItem && currentItem.key === doc.key ? 'selected' : ''} onClick={(): void => { handleItemClick(doc) }}>
                <ResultCell variant="body_short" lines="1">
                    {highlightSearchValue(getFormattedDate(doc.lastUpdated))}
                </ResultCell>
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
            width: 40,
            defaultCanSort: false
        },
        {
            Header: 'Type',
            accessor: (d: UseTableRowProps<ContentDocument>): UseTableRowProps<ContentDocument> => d,
            id: 'type',
            Cell: getType,
            width: 55,
            sortType: (a: UseTableRowProps<ContentDocument>, b: UseTableRowProps<ContentDocument>): 0 | -1 | 1 => {
                const firstValue = (a.original.type) || '';
                const secondValue = (b.original.type) || '';
                if (firstValue > secondValue)
                    return 1;
                else if (firstValue < secondValue)
                    return -1;
                else
                    return 0;
            }
        },
        {
            Header: 'No.',
            accessor: (d: UseTableRowProps<ContentDocument>): UseTableRowProps<ContentDocument> => d,
            id: 'no',
            Cell: getNumber,
            width: 100,
            sortType: (a: UseTableRowProps<ContentDocument>, b: UseTableRowProps<ContentDocument>): 0 | -1 | 1 => {
                const firstValue = (a.original.commPkg ? a.original.commPkg.commPkgNo : a.original.mcPkg ? a.original.mcPkg.mcPkgNo : a.original.tag ? a.original.tag.tagNo : '') || '';
                const secondValue = (b.original.commPkg ? b.original.commPkg.commPkgNo : b.original.mcPkg ? b.original.mcPkg.mcPkgNo : b.original.tag ? b.original.tag.tagNo : '') || '';
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
            width: 200,
            sortType: (a: UseTableRowProps<ContentDocument>, b: UseTableRowProps<ContentDocument>): 0 | -1 | 1 => {
                const firstValue = a.original.type === 'C' ? a.original.commPkg?.description ?? '' : a.original.type === 'MC' ? a.original.mcPkg?.description ?? '' : a.original.type === 'T' ? a.original.tag?.description ?? '' : '';
                const secondValue = b.original.type === 'C' ? b.original.commPkg?.description ?? '' : b.original.type === 'MC' ? b.original.mcPkg?.description ?? '' : b.original.type === 'T' ? b.original.tag?.description ?? '' : '';
                if (firstValue > secondValue)
                    return 1;
                else if (firstValue < secondValue)
                    return -1;
                else
                    return 0;
            }
        },
        {
            Header: 'Plant',
            accessor: (d: UseTableRowProps<ContentDocument>): UseTableRowProps<ContentDocument> => d,
            id: 'plantName',
            Cell: getPlantName,
            width: 100,
            sortType: (a: UseTableRowProps<ContentDocument>, b: UseTableRowProps<ContentDocument>): 0 | -1 | 1 => {
                const firstValue = a.original.plantName ?? '';
                const secondValue = b.original.plantName ?? '';
                if (firstValue > secondValue)
                    return 1;
                else if (firstValue < secondValue)
                    return -1;
                else
                    return 0;
            }
        },
        {
            Header: 'Project',
            accessor: (d: UseTableRowProps<ContentDocument>): UseTableRowProps<ContentDocument> => d,
            id: 'project',
            Cell: getProject,
            width: 100,
            sortType: (a: UseTableRowProps<ContentDocument>, b: UseTableRowProps<ContentDocument>): 0 | -1 | 1 => {
                const firstValue = a.original.project ?? '';
                const secondValue = b.original.project ?? '';
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
            width: 100,
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
        setSearchAllPlants(false);
        let newUrl = location.origin + location.pathname + '?query=' + queryString.parse(search).query;
        if (searchAllPlants) {
            newUrl = location.origin + location.pathname + '?allplants=true&query=' + queryString.parse(search).query;
        }

        history.replaceState(null, '', encodeURI(newUrl));
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
        const newUrl = decodeURI(location.href).replace('&plant=' + plant, '');
        history.replaceState(null, '', encodeURI(newUrl));
        setSelectedPlants(selectedPlants.filter(s => s !== plant));
    }

    const handleTypeRemove = (type: string): void => {
        const newUrl = location.href.replace('&type=' + type, '');
        history.replaceState(null, '', newUrl);
        setSelectedTypes(selectedTypes.filter(t => t !== type));
    }

    const updateTopDivHeight = (): void => {
        if (!topDivRef.current) return;
        setTopDivHeight(topDivRef.current.clientHeight);
    };

    const KEYCODE_ENTER = 13;

    const doSearch = (): void => {
        const searchVal = (document.getElementById('procosysqs') as HTMLInputElement).value;
        if (!searchVal) return;


        setSearching(true);
        apiClient.doSearch(searchVal, searchAllPlants ? undefined : plant.id).then((searchResult: SearchResult) => {
            setSearchValue(searchVal);
            setSearchResult(searchResult);
            setFilteredItems(searchResult.items);

            const values = queryString.parse(location.search);
            const filteredPlants = [];
            values.query = searchVal;
            history.replaceState(null, '', location.origin + location.pathname + '?' + queryString.stringify(values));
            prepareFilters(searchResult.items || []);

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
        }).finally(() => {
            setSearching(false);
        });
    }

    useEffect(() => {
        window.addEventListener('resize', updateTopDivHeight);

        return (): void => {
            window.removeEventListener('resize', updateTopDivHeight);
        };
    }, []);

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

    useEffect(() => {
        updateTopDivHeight();
    }, [showFilter, selectedPlants, selectedTypes]);

    useEffect(() => {
        const values = queryString.parse(location.search);
        values.plant = [];

        setSelectedPlants([]);
        if (searchAllPlants && location.href.indexOf('allplants=true') < 0) {
            values.allplants = 'true';
        }
        else {
            values.allplants = 'false';
        }
        setFilterPlants([]);
        history.replaceState(null, '', location.origin + location.pathname + '?' + queryString.stringify(values));
        doSearch();
    }, [searchAllPlants])

    const toggleShowFilter = (): void => {
        if (!showFilter) {
            setCurrentItem(undefined);
        }
        setShowFilter(!showFilter);
    }

    const getFilterType = (type: string): string => {
        switch (type) {
            case 'C':
                return 'Comm pkg';
            case 'MC':
                return 'MC pkg';
            case 'T':
                return 'Tag';
            case 'PI':
                return "Punch List Item";
            case 'OTHER':
                return 'Other';
            default:
                return 'Other'
        }
    }

    const getFlyoutTitle = (type: string): string => {
        switch (type) {
            case 'C':
                return 'Preview Comm package';
            case 'MC':
                return 'Preview MC package';
            case 'T':
                return 'Preview Tag';
            case 'PI':
                return 'Preview Punch List Item';
            default:
                return 'Preview Other';
        }
    }

    return (
        <Container>
            <SearchContainer withSidePanel={(showFilter && !currentItem)}>
                <Helmet titleTemplate={'ProCoSys - Quick Search'} />
                <TopDiv ref={topDivRef}>
                    <QSHeaderDiv>
                        <div>
                            <StyledHeader variant="h1">Quick Search</StyledHeader>
                        </div>
                        <FlexDiv>
                            <StyledButton onClick={(): void => { generateUrl() }} variant="ghost">Share link <EdsIcon name='share' /></StyledButton>
                            <StyledButton onClick={(): void => toggleShowFilter()} variant="ghost"><EdsIcon name='filter_list' /></StyledButton>
                        </FlexDiv>
                        {/* <Checkbox
                        label="Search across all plants"
                        onChange={(e: ChangeEvent<HTMLInputElement>): void => {
                            setSearchAllPlants(e.target.checked);
                        }}
                        checked={searchAllPlants}
                    /> */}
                    </QSHeaderDiv>

                    <SearchFieldContainer>
                        <QuickSearchSearch
                            placeholder={'Quick Search'}
                            defaultValue={searchInputValue}
                            name="procosysqs"
                            id="procosysqs"
                            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>): void => {
                                e.keyCode === KEYCODE_ENTER &&
                                    doSearch();
                            }}
                            // onFocus={(): void => setShowSearchSubText(prevState => !prevState)}
                            // onBlur={(): void => setShowSearchSubText(prevState => !prevState)}
                            autocomplete="on" autoFocus />
                        {
                            showSearchSubText && <SearchSubText>Type your search and press enter</SearchSubText>
                        }

                    </SearchFieldContainer>


                    <FiltersAndSortRow currentItem={currentItem}>
                        <SelectedFilters>
                            {selectedPlants && (
                                selectedPlants.map((plant) => {
                                    return (<FilterChip variant="active" onDelete={(): void => handlePlantRemove(plant)} key={plant}>{plant}</FilterChip>)
                                })
                            )}

                            {selectedTypes && (
                                selectedTypes.map((type) => {
                                    return (<FilterChip
                                        variant="active"
                                        onDelete={(): void => handleTypeRemove(type)}
                                        key={type}>
                                        {'Type: ' + getFilterType(type)}
                                    </FilterChip>)
                                })
                            )}

                        </SelectedFilters>
                    </FiltersAndSortRow>
                </TopDiv>

                <ResultsContainer id="rescont" currentItem={currentItem} style={{ height: 'calc(100% - ' + ((topDivHeight === 0 ? 160 : topDivHeight) + 48) + 'px)' }}>
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
                            onClose={(): void => setCurrentItem(undefined)}
                            open={displayFlyout}
                            title={getFlyoutTitle((currentItem as ContentDocument).type ?? '')}
                            variant="large">
                            <QuickSearchFlyout highlightOn={highlightOn} searchValue={searchValue} item={currentItem as ContentDocument} />
                        </StyledSideSheet>
                    )
                }
            </SearchContainer>
            {
                showFilter && !currentItem && (
                    <QuickSearchFilters
                        searchAllPlants={searchAllPlants}
                        setSearchAllPlants={setSearchAllPlants}
                        plantFilterExpanded={plantFilterExpanded}
                        clearFilters={clearFilters}
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
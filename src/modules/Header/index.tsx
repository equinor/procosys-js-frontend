/* eslint-disable react/jsx-no-target-blank */
import {
    DropdownItem,
    IconContainer,
    LogoContainer,
    MenuContainer,
    MenuContainerItem,
    Nav,
    PlantSelector,
    ShowOnDesktop,
    ShowOnMobile,
    StyledSearch,
} from './style';
import { Link, useHistory, useParams } from 'react-router-dom';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@equinor/eds-core-react';
import Dropdown from '../../components/Dropdown';
import EdsIcon from '@procosys/components/EdsIcon';
import Flyout from '@procosys/components/Flyout';
import ModuleTabs from './ModuleTabs';
import OptionsDropdown from '../../components/OptionsDropdown';
import ProCoSysSettings from '@procosys/core/ProCoSysSettings';
import ProcosysLogo from '../../assets/icons/ProcosysLogo';
import { useCurrentPlant } from '../../core/PlantContext';
import { useCurrentUser } from '../../core/UserContext';
import { useProcosysContext } from '../../core/ProcosysContext';
import { useQuickSearchContext } from '../QuickSearch/context/QuickSearchContext';
import {
    ContentDocument,
    SearchResult,
} from '../QuickSearch/http/QuickSearchApiClient';
import debounce from 'lodash.debounce';
import {
    QuickSearchPreviewSection,
    QuickSearchResultsContainer,
    QuickSearchResultsContainerFooter,
    QuickSearchResultsContainerHeader,
    QuickSearchResultsFoundIn,
    SearchingDiv,
} from '../QuickSearch/style';
import QuickSearchPreviewHit from '../QuickSearch/QuickSearchPreviewHit';
import Spinner from '@procosys/components/Spinner';
import useClickOutsideNotifier from '@procosys/hooks/useClickOutsideNotifier';
import { useHotkeys } from 'react-hotkeys-hook';
import { Canceler } from '@procosys/http/HttpClient';
import { KeyboardArrowRight } from '@mui/icons-material';

type PlantItem = {
    text: string;
    value: string;
};

const Header: React.FC = (): JSX.Element => {
    const user = useCurrentUser();
    const [searchValue, setSearchValue] = useState<string>('');
    const { auth } = useProcosysContext();
    const { plant, setCurrentPlant } = useCurrentPlant();
    const params = useParams<any>();
    const [filterForPlants, setFilterForPlants] = useState<string>('');
    const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
    const [searchResult, setSearchResult] = useState<SearchResult>();
    const [searching, setSearching] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [quickSearchLeftPos, setQuickSearchLeftPos] = useState<number>(0);
    const [currentHit, setCurrentHit] = useState<number>(-1);
    const KEYCODE_ENTER = 13;

    const [allPlants] = useState<PlantItem[]>(() => {
        return user.plants.map((plant) => ({
            text: plant.title,
            value: plant.id,
        }));
    });

    useHotkeys(
        'esc',
        () => {
            setIsOpen(false);
        },
        { enableOnTags: ['INPUT'] }
    );

    useHotkeys(
        'down',
        () => {
            if (counter < 1) return;

            if (currentHit + 1 > counter) {
                return;
            }

            const hit = document.getElementById(
                'hit_' + (currentHit + 1)
            ) as HTMLDivElement;
            if (hit) {
                (document.activeElement as HTMLElement).blur();
                hit.focus();
            }

            setCurrentHit(
                currentHit + 1 === counter ? currentHit : currentHit + 1
            );
        },
        { enableOnTags: ['INPUT'] }
    );

    useHotkeys(
        'up',
        () => {
            let hits = searchResult?.items.length;
            if (!hits) return;

            if (hits > 5) hits = 5;

            if (currentHit <= 0) {
                (
                    document.getElementById('procosys-qs') as HTMLDivElement
                ).focus();
                setCurrentHit(-1);
                return;
            }

            const hit = document.getElementById(
                'hit_' + (currentHit - 1)
            ) as HTMLDivElement;
            if (hit) {
                (document.activeElement as HTMLElement).blur();
                hit.focus();
            }

            setCurrentHit(currentHit - 1);
        },
        { enableOnTags: ['INPUT'] }
    );

    useClickOutsideNotifier(() => {
        setIsOpen(false);
    }, containerRef);

    const history = useHistory();

    const { apiClient } = useQuickSearchContext();

    const [filteredPlants, setFilteredPlants] =
        useState<PlantItem[]>(allPlants);

    const changePlant = (event: React.MouseEvent, plantIndex: number): void => {
        event.preventDefault();
        setCurrentPlant(filteredPlants[plantIndex].value as string);
        setSearchValue('');
        setSearchResult(undefined);
    };

    const cancelerRef = useRef<Canceler | null>();

    const debounceSearchHandler = useCallback(
        debounce((value: string) => {
            cancelerRef.current && cancelerRef.current();
            apiClient
                .doPreviewSearch(value, plant.id, (c) => {
                    cancelerRef.current = c;
                })
                .then((searchResult: SearchResult) => {
                    setSearchResult(searchResult);
                    let searchCount =
                        searchResult.hits > 6 ? 6 : searchResult.hits;

                    if (searchCount > 0) {
                        searchCount =
                            searchResult.totalCommPkgHits > 0
                                ? searchCount + 1
                                : searchCount;
                        searchCount =
                            searchResult.totalMcPkgHits > 0
                                ? searchCount + 1
                                : searchCount;
                        searchCount =
                            searchResult.totalPunchItemHits > 0
                                ? searchCount + 1
                                : searchCount;
                        searchCount =
                            searchResult.totalTagHits > 0
                                ? searchCount + 1
                                : searchCount;
                    }
                    setCurrentHit(-1);
                    setSearching(false);
                });
        }, 750),
        [plant]
    );

    const handleQuickSearchChange = useCallback(
        (e: { target: { value: string } }) => {
            const searchVal = e.target.value;
            const searchInput = document.getElementById('procosys-qs');
            if (searchInput) {
                const rect = searchInput.getBoundingClientRect();
                setQuickSearchLeftPos(rect.left);
            }

            setIsOpen(true);
            setSearchResult(undefined);
            setSearching(true);
            setSearchValue(searchVal);
            if (searchVal === '') {
                setSearching(false);
                return;
            }

            debounceSearchHandler(searchVal);
        },
        [debounceSearchHandler]
    );

    const handleQuickSearchFocus = (): void => {
        const searchInput = document.getElementById('procosys-qs');
        if (searchInput) {
            const rect = searchInput.getBoundingClientRect();
            setQuickSearchLeftPos(rect.left);
        }
        setIsOpen(true);
    };

    useEffect(() => {
        if (filterForPlants.length <= 0) {
            setFilteredPlants(allPlants);
            return;
        }
        setFilteredPlants(
            allPlants.filter(
                (p) =>
                    p.text
                        .toLowerCase()
                        .indexOf(filterForPlants.toLowerCase()) > -1
            )
        );
    }, [filterForPlants]);

    const goToFilteredQuicksearch = (filterType: string): void => {
        setCurrentHit(0);
        history.push(
            '/' +
                plant.pathId +
                '/quicksearch?query=' +
                filterType +
                ':' +
                searchValue
        );
        setIsOpen(false);
        setSearchValue('');
        setSearchResult(undefined);
    };

    const goToQuicksearch = (): void => {
        history.push('/' + plant.pathId + '/quicksearch?query=' + searchValue);
        setIsOpen(false);
        setSearchValue('');
        setSearchResult(undefined);
    };

    const goToFirstItemInResult = (): void => {
        if (!searching && searchResult && searchResult.items[0]) {
            const item = document.getElementById('hit_0') as HTMLDivElement;
            item.focus();
            setTimeout(() => {
                item.click();
            }, 250);
        }
    };

    let counter = 0;
    return (
        <div>
            <Nav>
                <IconContainer>
                    <Button
                        variant="ghost"
                        onClick={(): void => setShowMobileMenu(!showMobileMenu)}
                    >
                        <EdsIcon name="menu" />
                    </Button>

                    <ProcosysLogo id="logo" fontSize="inherit" />
                </IconContainer>
                <LogoContainer>
                    <a href={`/${params.plant}/`}>ProCoSys</a>
                </LogoContainer>
                <PlantSelector>
                    <Dropdown text={plant.title} onFilter={setFilterForPlants}>
                        {filteredPlants.map((plantItem, index) => {
                            return (
                                <DropdownItem
                                    key={index}
                                    onClick={(event): void =>
                                        changePlant(event, index)
                                    }
                                >
                                    {plantItem.text}
                                </DropdownItem>
                            );
                        })}
                    </Dropdown>
                </PlantSelector>
                <MenuContainer>
                    <MenuContainerItem>
                        <Dropdown text="New">
                            <a
                                href={`/${params.plant}/Completion/NewCertificate`}
                            >
                                <DropdownItem>Certificate</DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/Completion#CommPkg|?bf=1`}
                            >
                                <DropdownItem>
                                    Commissioning package
                                </DropdownItem>
                            </a>
                            <a href={`/${params.plant}/Documents/New`}>
                                <DropdownItem>Document</DropdownItem>
                            </a>
                            {ProCoSysSettings.featureIsEnabled('IPO') && (
                                <Link
                                    to={`/${params.plant}/InvitationForPunchOut/CreateIPO`}
                                >
                                    <DropdownItem>
                                        Invitation for punch-out
                                    </DropdownItem>
                                </Link>
                            )}
                            <a href={`/${params.plant}/Hookup/New`}>
                                <DropdownItem>Certificate</DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/Documents/NewNotification`}
                            >
                                <DropdownItem>Notification</DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/Preservation#PreservationTag|`}
                            >
                                <DropdownItem>
                                    Preservation area tag
                                </DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/PurchaseOrders#PurchaseOrder|`}
                            >
                                <DropdownItem>Purchase order</DropdownItem>
                            </a>
                            <a href={`/${params.plant}/Documents/NewQuery`}>
                                <DropdownItem>Query</DropdownItem>
                            </a>
                            <a href={`/${params.plant}/SWAP/New`}>
                                <DropdownItem>
                                    Software change record
                                </DropdownItem>
                            </a>
                            <a href={`/${params.plant}/Completion#Tag|`}>
                                <DropdownItem>Tag</DropdownItem>
                            </a>
                        </Dropdown>
                    </MenuContainerItem>
                    <MenuContainerItem>
                        <Dropdown text="Search">
                            <a
                                href={`/${params.plant}/Search?searchType=Action%20Log`}
                            >
                                <DropdownItem>Action log</DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Certificates`}
                            >
                                <DropdownItem>Certificate</DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Check%20Lists`}
                            >
                                <DropdownItem>Check lists</DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Commissioning%20Packages`}
                            >
                                <DropdownItem>
                                    Commissioning packages
                                </DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Documents`}
                            >
                                <DropdownItem>Documents</DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Formular%20Types`}
                            >
                                <DropdownItem>Formular types</DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Hookup%20items`}
                            >
                                <DropdownItem>Hookup types</DropdownItem>
                            </a>
                            {ProCoSysSettings.featureIsEnabled('IPO') && (
                                <Link
                                    to={`/${params.plant}/InvitationForPunchOut`}
                                >
                                    <DropdownItem>
                                        Invitation for punch-out
                                    </DropdownItem>
                                </Link>
                            )}
                            <a
                                href={`/${params.plant}/Search?searchType=Libraries`}
                            >
                                <DropdownItem>Libraries</DropdownItem>
                            </a>
                            {ProCoSysSettings.featureIsEnabled(
                                'ManufacturerModelEnabled'
                            ) && (
                                <a
                                    href={`/${params.plant}/Search?searchType=Manufacturer%2FModel`}
                                >
                                    <DropdownItem>
                                        Manufacturer/Model
                                    </DropdownItem>
                                </a>
                            )}
                            <a
                                href={`/${params.plant}/Search?searchType=MC%20Packages`}
                            >
                                <DropdownItem>MC packages</DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Notifications`}
                            >
                                <DropdownItem>Notifications</DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Operation`}
                            >
                                <DropdownItem>Operation</DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Preservation%20Tags`}
                            >
                                <DropdownItem>Preservation tags</DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Projects`}
                            >
                                <DropdownItem>Projects</DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Punch%20List%20Items`}
                            >
                                <DropdownItem>Punch list items</DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Purchase%20Orders`}
                            >
                                <DropdownItem>Purchase orders</DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Query`}
                            >
                                <DropdownItem>Query</DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Software%20Change%20Records`}
                            >
                                <DropdownItem>
                                    Software change records
                                </DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Tag%20Functions`}
                            >
                                <DropdownItem>Tag functions</DropdownItem>
                            </a>
                            <a href={`/${params.plant}/Search?searchType=Tags`}>
                                <DropdownItem>Tags</DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Work%20Orders`}
                            >
                                <DropdownItem>Work orders</DropdownItem>
                            </a>
                            <hr />
                            <a href={`/${params.plant}/PersonalSearchSettings`}>
                                <DropdownItem>My saved settings</DropdownItem>
                            </a>
                        </Dropdown>
                    </MenuContainerItem>
                    <MenuContainerItem>
                        <a href={`/${params.plant}/Reports`}>
                            <Button variant={'ghost'}>Reports</Button>
                        </a>
                    </MenuContainerItem>
                </MenuContainer>
                <MenuContainer>
                    {ProCoSysSettings.featureIsEnabled('quickSearch') && (
                        <MenuContainerItem>
                            <StyledSearch
                                placeholder={'Quick Search'}
                                onChange={handleQuickSearchChange}
                                onFocus={handleQuickSearchFocus}
                                onKeyDown={(
                                    e: React.KeyboardEvent<HTMLInputElement>
                                ): void => {
                                    e.keyCode === KEYCODE_ENTER &&
                                        goToFirstItemInResult();
                                }}
                                value={searchValue}
                                name="procosys-qs"
                                id="procosys-qs"
                                autocomplete="on"
                                autoFocus
                            />

                            {!searching && searchValue && isOpen && (
                                <QuickSearchResultsContainer
                                    style={{
                                        left: quickSearchLeftPos - 30 + 'px',
                                    }}
                                    ref={containerRef}
                                >
                                    <QuickSearchResultsContainerHeader
                                        group="navigation"
                                        variant="label"
                                    >
                                        Results
                                    </QuickSearchResultsContainerHeader>
                                    {searchResult &&
                                    searchResult.items.length > 0 ? (
                                        searchResult.items.map(
                                            (item: ContentDocument) => {
                                                if (counter > 5) return;
                                                return (
                                                    <QuickSearchPreviewHit
                                                        hitNumber={counter++}
                                                        key={item.key}
                                                        searchValue={
                                                            searchValue
                                                        }
                                                        item={item}
                                                    ></QuickSearchPreviewHit>
                                                );
                                            }
                                        )
                                    ) : (
                                        <SearchingDiv>
                                            Nothing here... &#129300;
                                        </SearchingDiv>
                                    )}

                                    {searchResult &&
                                        searchResult.items.length > 0 && (
                                            <>
                                                <QuickSearchResultsFoundIn
                                                    group="navigation"
                                                    variant="label"
                                                >
                                                    Results found in
                                                </QuickSearchResultsFoundIn>

                                                {searchResult.totalCommPkgHits >
                                                    0 && (
                                                    <QuickSearchPreviewSection
                                                        tabIndex={counter++}
                                                        id={
                                                            'hit_' +
                                                            (counter - 1)
                                                        }
                                                        onKeyDown={(
                                                            e: React.KeyboardEvent<HTMLInputElement>
                                                        ): void => {
                                                            e.keyCode ===
                                                                KEYCODE_ENTER &&
                                                                goToFilteredQuicksearch(
                                                                    'c'
                                                                );
                                                        }}
                                                        onClick={(): void =>
                                                            goToFilteredQuicksearch(
                                                                'c'
                                                            )
                                                        }
                                                    >
                                                        <span>
                                                            Commissioning
                                                            packages
                                                        </span>
                                                        <KeyboardArrowRight className="arrowIcon" />
                                                    </QuickSearchPreviewSection>
                                                )}

                                                {searchResult.totalMcPkgHits >
                                                    0 && (
                                                    <QuickSearchPreviewSection
                                                        tabIndex={counter++}
                                                        id={
                                                            'hit_' +
                                                            (counter - 1)
                                                        }
                                                        onKeyDown={(
                                                            e: React.KeyboardEvent<HTMLInputElement>
                                                        ): void => {
                                                            e.keyCode ===
                                                                KEYCODE_ENTER &&
                                                                goToFilteredQuicksearch(
                                                                    'm'
                                                                );
                                                        }}
                                                        onClick={(): void =>
                                                            goToFilteredQuicksearch(
                                                                'm'
                                                            )
                                                        }
                                                    >
                                                        <span>MC packages</span>
                                                        <KeyboardArrowRight className="arrowIcon" />
                                                    </QuickSearchPreviewSection>
                                                )}

                                                {searchResult.totalTagHits >
                                                    0 && (
                                                    <QuickSearchPreviewSection
                                                        tabIndex={counter++}
                                                        id={
                                                            'hit_' +
                                                            (counter - 1)
                                                        }
                                                        onKeyDown={(
                                                            e: React.KeyboardEvent<HTMLInputElement>
                                                        ): void => {
                                                            e.keyCode ===
                                                                KEYCODE_ENTER &&
                                                                goToFilteredQuicksearch(
                                                                    't'
                                                                );
                                                        }}
                                                        onClick={(): void =>
                                                            goToFilteredQuicksearch(
                                                                't'
                                                            )
                                                        }
                                                    >
                                                        <span>Tags</span>
                                                        <KeyboardArrowRight className="arrowIcon" />
                                                    </QuickSearchPreviewSection>
                                                )}

                                                {searchResult.totalPunchItemHits >
                                                    0 && (
                                                    <QuickSearchPreviewSection
                                                        tabIndex={counter++}
                                                        id={
                                                            'hit_' +
                                                            (counter - 1)
                                                        }
                                                        onKeyDown={(
                                                            e: React.KeyboardEvent<HTMLInputElement>
                                                        ): void => {
                                                            e.keyCode ===
                                                                KEYCODE_ENTER &&
                                                                goToFilteredQuicksearch(
                                                                    'p'
                                                                );
                                                        }}
                                                        onClick={(): void =>
                                                            goToFilteredQuicksearch(
                                                                'p'
                                                            )
                                                        }
                                                    >
                                                        <span>
                                                            Punch List items
                                                        </span>
                                                        <KeyboardArrowRight className="arrowIcon" />
                                                    </QuickSearchPreviewSection>
                                                )}

                                                <QuickSearchResultsContainerFooter
                                                    onClick={(): void =>
                                                        goToQuicksearch()
                                                    }
                                                    variant="ghost"
                                                >
                                                    Show all results
                                                </QuickSearchResultsContainerFooter>
                                            </>
                                        )}
                                </QuickSearchResultsContainer>
                            )}

                            {searching && isOpen && (
                                <QuickSearchResultsContainer
                                    style={{
                                        left: quickSearchLeftPos - 30 + 'px',
                                    }}
                                >
                                    <SearchingDiv>
                                        Searching... <Spinner medium></Spinner>
                                    </SearchingDiv>
                                </QuickSearchResultsContainer>
                            )}
                        </MenuContainerItem>
                    )}
                    <MenuContainerItem className="compact">
                        <OptionsDropdown variant={'ghost'} icon="link">
                            <a
                                href="https://statoilsrm.sharepoint.com/sites/PRDConstructionandCommissioning/SitePages/CCH-DIGITAL.aspx"
                                target="_blank"
                            >
                                <DropdownItem>
                                    C&amp;C digital toolbox
                                </DropdownItem>
                            </a>
                            <a href="https://dcp.equinor.com" target="_blank">
                                <DropdownItem>
                                    DCP – Digitalized Commissioning Procedure
                                </DropdownItem>
                            </a>
                            <a
                                href="https://fusion.equinor.com"
                                target="_blank"
                            >
                                <DropdownItem>
                                    FUSION – Project information portal
                                </DropdownItem>
                            </a>
                            <a href="https://echo.equinor.com" target="_blank">
                                <DropdownItem>
                                    Echo inField – Technical data and status
                                </DropdownItem>
                            </a>
                            <a href="https://stid.equinor.com" target="_blank">
                                <DropdownItem>
                                    STID - Technical Information Portal
                                </DropdownItem>
                            </a>
                            <a
                                href="https://accessit.equinor.com"
                                target="_blank"
                            >
                                <DropdownItem>
                                    Access IT – Access Managing Control System
                                    for Equinor
                                </DropdownItem>
                            </a>
                        </OptionsDropdown>
                    </MenuContainerItem>
                    <MenuContainerItem className="compact">
                        <OptionsDropdown
                            variant={'ghost'}
                            icon="info_circle"
                            iconSize={24}
                        >
                            <a
                                href={
                                    'https://procosyspublictoc.azurewebsites.net/'
                                }
                            >
                                <DropdownItem>ProCoSys Help</DropdownItem>
                            </a>
                            <a
                                href={
                                    'https://equinor.service-now.com/selfservice?id=sc_cat_item&sys_id=67053df4dbe82b008a0f9407db9619d1'
                                }
                            >
                                <DropdownItem>Open a Request Item</DropdownItem>
                            </a>
                            <a
                                href={
                                    'https://equinor.service-now.com/selfservice/?id=sc_cat_item&sys_id=3373cf4cdb97f200bc7af7461d96195b'
                                }
                            >
                                <DropdownItem>Report an error</DropdownItem>
                            </a>
                        </OptionsDropdown>
                    </MenuContainerItem>
                    <MenuContainerItem className="compact">
                        <OptionsDropdown variant={'ghost'} icon="lock">
                            <a href={`/${params.plant}/Security/User`}>
                                <DropdownItem>Users</DropdownItem>
                            </a>
                            <a href={`/${params.plant}/Security/UserRole`}>
                                <DropdownItem>User Roles</DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/Security/PrivilegeGroup`}
                            >
                                <DropdownItem>Privilige Groups</DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/Security/RestrictionRole`}
                            >
                                <DropdownItem>Restriction Roles</DropdownItem>
                            </a>
                        </OptionsDropdown>
                    </MenuContainerItem>
                    <MenuContainerItem className={'compact'}>
                        <a href={`/${params.plant}/Security/User/EditSelf`}>
                            <Button variant={'ghost'}>
                                <EdsIcon name="account_circle" />
                                {user.name}
                            </Button>
                        </a>
                    </MenuContainerItem>
                    <MenuContainerItem className="compact lastButton">
                        <Button
                            variant={'ghost'}
                            onClick={(): void => auth.logout()}
                        >
                            Logout
                        </Button>
                    </MenuContainerItem>
                </MenuContainer>
            </Nav>
            {showMobileMenu && (
                <ShowOnMobile>
                    <Flyout
                        position="left"
                        close={(): void => setShowMobileMenu(false)}
                    >
                        <ModuleTabs
                            onClick={(): void => setShowMobileMenu(false)}
                        />
                    </Flyout>
                </ShowOnMobile>
            )}
            <ShowOnDesktop>
                <ModuleTabs />
            </ShowOnDesktop>
        </div>
    );
};

export default Header;

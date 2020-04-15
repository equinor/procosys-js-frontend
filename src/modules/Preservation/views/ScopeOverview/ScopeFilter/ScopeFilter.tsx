import React, { useState } from 'react';
import { Container, Header, Collapse, CollapseInfo, Link, Section } from './ScopeFilter.style';
import CloseIcon from '@material-ui/icons/Close';
import { Button, TextField, Typography } from '@equinor/eds-core-react';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { TagListFilter } from '../types';
import { tokens } from '@equinor/eds-tokens';

interface ScopeFilterProps {
    setDisplayFilter: (display: boolean) => void;
    tagListFilter: TagListFilter;
    setTagListFilter: (filter: TagListFilter) => void;
}

const ScopeFilter = ({
    setDisplayFilter,
    tagListFilter,
    setTagListFilter,
}: ScopeFilterProps): JSX.Element => {

    const [searchIsExpanded, setSearchIsExpanded] = useState<boolean>(false);
    const [statusIsExpanded, setStatusIsExpanded] = useState<boolean>(false);

    const KEYCODE_ENTER = 13;

    const triggerScopeListUpdate = (): void => {
        const filter: TagListFilter = { ...tagListFilter };
        setTagListFilter(filter);
    };

    const resetFilter = (): void => {
        const tagListFilter: TagListFilter = { tagNoStartsWith: null, commPkgNoStartsWith: null, mcPkgNoStartsWith: null, purchaseOrderNoStartsWith: null, storageAreaStartsWith: null };
        setTagListFilter(tagListFilter);
        //todo: We should rerender to empty all fields. How?
    };

    return (
        <Container>
            <Header>
                <h1>Filter</h1>

                <Button variant='ghost' title='Close' onClick={(): void => { setDisplayFilter(false); }}>
                    <CloseIcon />
                </Button>
            </Header>
            <Section>
                <Link onClick={(): void => resetFilter()}>
                    <Typography style={{ color: tokens.colors.interactive.primary__resting.rgba }} variant='caption'>Reset filter</Typography>
                </Link>
            </Section>
            <Collapse isExpanded={searchIsExpanded} onClick={(): void => setSearchIsExpanded(!searchIsExpanded)}>
                <CollapseInfo>
                    Search
                </CollapseInfo>
                {
                    searchIsExpanded
                        ? <KeyboardArrowUpIcon />
                        : <KeyboardArrowDownIcon />
                }
            </Collapse>
            {
                searchIsExpanded && (
                    <div>
                        <Section>
                            <TextField
                                id="tagNoSearch"
                                placeholder="Search tag number"
                                onKeyDown={(e: any): void => {
                                    tagListFilter.tagNoStartsWith = e.currentTarget.value;
                                    e.keyCode === KEYCODE_ENTER && triggerScopeListUpdate();
                                }}
                            />
                        </Section>
                        <Section>
                            <TextField
                                id="poNoSearch"
                                placeholder="Search purchase order number"
                                onKeyDown={(e: any): void => {
                                    tagListFilter.purchaseOrderNoStartsWith = e.currentTarget.value;
                                    e.keyCode === KEYCODE_ENTER && triggerScopeListUpdate();
                                }}
                            />
                        </Section>
                        <Section>
                            <TextField
                                id="commPgkNoSearch"
                                placeholder="Search comm. pkg. number"
                                onKeyDown={(e: any): void => {
                                    tagListFilter.commPkgNoStartsWith = e.currentTarget.value;
                                    e.keyCode === KEYCODE_ENTER && triggerScopeListUpdate();
                                }}
                            />
                        </Section>
                        <Section>
                            <TextField
                                id="mcPgkNoSearch"
                                placeholder="Search mc. pkg. number"
                                onKeyDown={(e: any): void => {
                                    tagListFilter.mcPkgNoStartsWith = e.currentTarget.value;
                                    e.keyCode === KEYCODE_ENTER && triggerScopeListUpdate();
                                }}
                            />
                        </Section>
                        <Section>
                            <TextField
                                id="storageAreaSearch"
                                placeholder="Search storage area"
                                onKeyDown={(e: any): void => {
                                    tagListFilter.storageAreaStartsWith = e.currentTarget.value;
                                    e.keyCode === KEYCODE_ENTER && triggerScopeListUpdate();
                                }}
                            />
                        </Section>
                    </div>
                )
            }

            <Collapse isExpanded={statusIsExpanded} onClick={(): void => setStatusIsExpanded(!statusIsExpanded)}>
                <CollapseInfo>
                    Preservation Status
                </CollapseInfo>
                {
                    statusIsExpanded
                        ? <KeyboardArrowUpIcon />
                        : <KeyboardArrowDownIcon />
                }
            </Collapse>
            {
                statusIsExpanded && (
                    <div>todo</div>
                )
            }

        </Container >
    );
};

export default ScopeFilter;
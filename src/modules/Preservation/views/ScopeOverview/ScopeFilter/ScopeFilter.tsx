import React, { useState, useEffect } from 'react';
import { Container, Header, Collapse, CollapseInfo, Link, Section } from './ScopeFilter.style';
import CloseIcon from '@material-ui/icons/Close';
import { Button, TextField, Typography } from '@equinor/eds-core-react';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { TagListFilter } from '../types';
import { tokens } from '@equinor/eds-tokens';
import { RadioGroup, FormControlLabel, Radio } from '@material-ui/core';

interface ScopeFilterProps {
    setDisplayFilter: (display: boolean) => void;
    tagListFilter: TagListFilter;
    setTagListFilter: (filter: TagListFilter) => void;
}
interface SelectableInput {
    text: string;
    value: string;
}
const PRESERVATION_STATUS: SelectableInput[] = [{
    text: 'Not started',
    value: 'NotStarted'
},
{
    text: 'Active',
    value: 'Active'
},
{
    text: 'Completed',
    value: 'Completed'
}];

const ScopeFilter = ({
    setDisplayFilter,
    tagListFilter,
    setTagListFilter,
}: ScopeFilterProps): JSX.Element => {

    const [searchIsExpanded, setSearchIsExpanded] = useState<boolean>(false);
    const [localTagListFilter, setLocalTagListFilter] = useState<TagListFilter>({ ...tagListFilter });

    const [viewStatusFilter, setViewStatusFilter] = useState<boolean>(false);

    const KEYCODE_ENTER = 13;

    const triggerScopeListUpdate = (): void => {
        setTagListFilter(localTagListFilter);
    };

    const resetFilter = (): void => {
        const newTagListFilter: TagListFilter = { tagNoStartsWith: null, commPkgNoStartsWith: null, mcPkgNoStartsWith: null, purchaseOrderNoStartsWith: null, storageAreaStartsWith: null, preservationStatus: null };
        setLocalTagListFilter(newTagListFilter);
        setTagListFilter(newTagListFilter);
    };

    const onStatusFilterChanged = (e: React.ChangeEvent<HTMLInputElement>, value: string): void => {
        console.log('Value: ', value);
        setLocalTagListFilter((old): TagListFilter => {return {...old, preservationStatus: value};});
    };

    useEffect((): void => {
        triggerScopeListUpdate();
    }, [localTagListFilter.preservationStatus]);

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
                    <>
                        <Section>
                            <TextField
                                id="tagNoSearch"
                                onChange={(e: any): void => {
                                    setLocalTagListFilter({ ...localTagListFilter, tagNoStartsWith: e.target.value });
                                }}
                                value={localTagListFilter.tagNoStartsWith || ''}
                                placeholder="Search tag number"
                                onKeyDown={(e: any): void => {
                                    e.keyCode === KEYCODE_ENTER && triggerScopeListUpdate();
                                }}
                            />
                        </Section>
                        <Section>
                            <TextField
                                id="poNoSearch"
                                placeholder="Search purchase order number"
                                onChange={(e: any): void => {
                                    setLocalTagListFilter({ ...localTagListFilter, purchaseOrderNoStartsWith: e.target.value });
                                }}
                                value={localTagListFilter.purchaseOrderNoStartsWith || ''}
                                onKeyDown={(e: any): void => {
                                    e.keyCode === KEYCODE_ENTER && triggerScopeListUpdate();
                                }}
                            />
                        </Section>
                        <Section>
                            <TextField
                                id="commPgkNoSearch"
                                placeholder="Search comm. pkg. number"
                                onChange={(e: any): void => {
                                    setLocalTagListFilter({ ...localTagListFilter, commPkgNoStartsWith: e.target.value });
                                }}
                                value={localTagListFilter.commPkgNoStartsWith || ''}
                                onKeyDown={(e: any): void => {
                                    e.keyCode === KEYCODE_ENTER && triggerScopeListUpdate();
                                }}
                            />
                        </Section>
                        <Section>
                            <TextField
                                id="mcPgkNoSearch"
                                placeholder="Search mc. pkg. number"
                                onChange={(e: any): void => {
                                    setLocalTagListFilter({ ...localTagListFilter, mcPkgNoStartsWith: e.target.value });
                                }}
                                value={localTagListFilter.mcPkgNoStartsWith || ''}
                                onKeyDown={(e: any): void => {
                                    e.keyCode === KEYCODE_ENTER && triggerScopeListUpdate();
                                }}
                            />
                        </Section>
                        <Section>
                            <TextField
                                id="storageAreaSearch"
                                placeholder="Search storage area"
                                onChange={(e: any): void => {
                                    setLocalTagListFilter({ ...localTagListFilter, storageAreaStartsWith: e.target.value });
                                }}
                                value={localTagListFilter.storageAreaStartsWith || ''}
                                onKeyDown={(e: any): void => {
                                    e.keyCode === KEYCODE_ENTER && triggerScopeListUpdate();
                                }}
                            />
                        </Section>
                    </>
                )
            }

            <Collapse isExpanded={viewStatusFilter} onClick={(): void => setViewStatusFilter(!viewStatusFilter)}>
                <CollapseInfo>
                    Preservation Status
                </CollapseInfo>
                {
                    viewStatusFilter
                        ? <KeyboardArrowUpIcon />
                        : <KeyboardArrowDownIcon />
                }
            </Collapse>
            {
                viewStatusFilter && (
                    <RadioGroup aria-label="Preservation Status" name="preservationStatus" value={localTagListFilter.preservationStatus} onChange={onStatusFilterChanged}>
                        {PRESERVATION_STATUS.map(option => (<FormControlLabel key={option.value} value={option.value} label={option.text} control={<Radio />} />))}

                    </RadioGroup>
                )
            }

        </Container >
    );
};

export default ScopeFilter;

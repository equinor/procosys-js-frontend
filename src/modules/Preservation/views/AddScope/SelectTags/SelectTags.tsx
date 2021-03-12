import { Button, TextField, Typography } from '@equinor/eds-core-react';
import { ButtonsContainer, Container, Header, InnerContainer, LoadingContainer, Search, TagsHeader, TopContainer } from './SelectTags.style';
import { CheckBoxColumnFilter, SelectColumnFilter } from '@procosys/components/Table/filters';
import React, { useEffect, useState } from 'react';
import { TableOptions, UseTableRowProps } from 'react-table';
import { Tag, TagRow } from '../types';

import { AddScopeMethod } from '../AddScope';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Loading from '../../../../../components/Loading';
import ProcosysTable from '@procosys/components/Table/ProcosysTable';
import Table from '../../../../../components/Table';
import { tokens } from '@equinor/eds-tokens';
import { useHistory } from 'react-router-dom';
import { usePreservationContext } from '../../../context/PreservationContext';

const tableColumns = [
    {
        Header: 'Tag no',
        field: 'tagNo',
        accessor: 'tagNo',
        filter: (rows: UseTableRowProps<TagRow>[], id: number, filterType: string): UseTableRowProps<TagRow>[] => {
            return rows.filter((row) => { return row.original.tagNo?.toLowerCase().indexOf(filterType.toLowerCase()) > -1; });
        }
    },
    {
        Header: 'Description',
        field: 'description',
        accessor: 'description',
        filter: (rows: UseTableRowProps<TagRow>[], id: number, filterType: string): UseTableRowProps<TagRow>[] => {
            return rows.filter((row) => { return row.original.description?.toLowerCase().indexOf(filterType.toLowerCase()) > -1; });
        }
    },
    {
        Header: 'MC pkg',
        field: 'mcPkgNo',
        accessor: 'mcPkgNo',
        filter: (rows: UseTableRowProps<TagRow>[], id: number, filterType: string): UseTableRowProps<TagRow>[] => {
            return rows.filter((row) => { return row.original.mcPkgNo?.toLowerCase().indexOf(filterType.toLowerCase()) > -1; });
        }
    },
    {
        Header: 'MCCR resp',
        field: 'mccrResponsibleCodes',
        accessor: 'mccrResponsibleCodes',
        filter: (rows: UseTableRowProps<TagRow>[], id: number, filterType: string): UseTableRowProps<TagRow>[] => {
            return rows.filter((row) => { return row.original.mccrResponsibleCodes?.toLowerCase().indexOf(filterType.toLowerCase()) > -1; });
        }
    },
    {
        Header: 'PO',
        field: 'purchaseOrderTitle',
        accessor: 'purchaseOrderTitle',
        filter: (rows: UseTableRowProps<TagRow>[], id: number, filterType: string): UseTableRowProps<TagRow>[] => {
            return rows.filter((row) => { return row.original.purchaseOrderTitle?.toLowerCase().indexOf(filterType.toLowerCase()) > -1; });
        }
    },
    {
        Header: 'Comm pkg',
        field: 'commPkgNo',
        accessor: 'commPkgNo',
        filter: (rows: UseTableRowProps<TagRow>[], id: number, filterType: string): UseTableRowProps<TagRow>[] => {
            return rows.filter((row) => { return row.original.commPkgNo?.toLowerCase().indexOf(filterType.toLowerCase()) > -1; });
        }
    },
    {
        Header: 'Tag function',
        field: 'tagFunctionCode',
        accessor: 'tagFunctionCode',
        filter: (rows: UseTableRowProps<TagRow>[], id: number, filterType: string): UseTableRowProps<TagRow>[] => {
            return rows.filter((row) => { return row.original.tagFunctionCode?.toLowerCase().indexOf(filterType.toLowerCase()) > -1; });
        }
    },
    {
        Header: 'Preserved',
        accessor: (d: TagRow): string | undefined => {return d.isPreserved ? 'Preserved' : 'Not preserved'; },
        field: 'isPreserved',
        Cell: (rowData: TableOptions<TagRow>): JSX.Element => {return rowData.row.values.Preserved === 'Preserved' ? <CheckBoxIcon /> : <></>;},
        Filter: SelectColumnFilter,
        filter: 'equals'
    },
];


type SelectTagsProps = {
    selectedTags: Tag[];
    scopeTableData: TagRow[];
    setSelectedTags: (tags: Tag[]) => void;
    searchTags: (tagNo: string | null) => void;
    nextStep: () => void;
    isLoading: boolean;
    addScopeMethod: AddScopeMethod;
    removeTag: (tagNo: string) => void;
    selectedTableRows: Record<string, boolean>;
    setSelectedTableRows: (ids: Record<string, boolean>) => void;
}

const KEYCODE_ENTER = 13;


const SelectTags = (props: SelectTagsProps): JSX.Element => {
    const { project, purchaseOrderNumber } = usePreservationContext();
    const history = useHistory();


    const removeAllSelectedTagsInScope = (): void => {
        const tagNos: string[] = [];
        props.scopeTableData.forEach(l => {
            tagNos.push(l.tagNo);
            l.noCheckbox = l.isPreserved;
        });
        const newSelectedTags = props.selectedTags.filter(item => !tagNos.includes(item.tagNo));
        props.setSelectedTags(newSelectedTags);
    };

    const addTagsInScope = (rowData: TagRow[]): void => {
        const allRows = rowData
            .filter(row => !row.isPreserved)
            .map(row => {
                return {
                    tagNo: row.tagNo,
                    description: row.description,
                    mcPkgNo: row.mcPkgNo
                };
            });
        props.setSelectedTags([...allRows]);
    };

    const rowSelectionChanged = (rowData: TagRow[], ids: Record<string, boolean>): void => {
        if (rowData.length == 0 && props.scopeTableData && props.scopeTableData.length > 0) {
            removeAllSelectedTagsInScope();
        } else {
            addTagsInScope(rowData);
        }

        props.setSelectedTableRows(ids);
    };

    const cancel = (): void => {
        history.push('/');
    };

    return (
        <Container>
            <Header>
                <Typography variant="h1">Add preservation scope</Typography>
                <div>{project.name}</div>

                {purchaseOrderNumber &&
                    <div style={{ marginLeft: 'calc(var(--grid-unit) * 4)' }}>PO number: {purchaseOrderNumber}</div>
                }
            </Header>
            <TopContainer>
                <InnerContainer>
                    {
                        props.addScopeMethod === AddScopeMethod.AddTagsManually && (
                            <Search>
                                <TextField
                                    id="tagSearch"
                                    placeholder="Search by tag number"
                                    helperText="Type the start of a tag number and press enter to load tags. Note: Minimum two characters are required."
                                    onKeyDown={(e: any): void => {
                                        e.keyCode === KEYCODE_ENTER && e.currentTarget.value.length > 1 && props.searchTags(e.currentTarget.value);
                                    }}
                                    onInput={(e: any): void => {
                                        e.currentTarget.value.length === 0 && props.searchTags(null);
                                    }}
                                />
                            </Search>
                        )
                    }
                    {props.scopeTableData && props.scopeTableData.length > 0 && <TagsHeader>Select the tags that should be added to the preservation scope and click &apos;next&apos;</TagsHeader>}
                </InnerContainer>
                <ButtonsContainer>
                    <Button onClick={cancel} variant='outlined' >Cancel</Button>
                    <Button onClick={props.nextStep} disabled={props.selectedTags.length === 0}>Next</Button>
                </ButtonsContainer>
            </TopContainer>
            {
                props.isLoading &&
                <LoadingContainer>
                    <Loading title="Loading tags" />
                </LoadingContainer>
            }
            {
                !props.isLoading &&

                <ProcosysTable
                    setPageSize={() => { }}
                    onSort={() => { }}
                    onSelectedChange={(rowData: TagRow[], ids: any): void => { rowSelectionChanged(rowData, ids) }}
                    pageIndex={0}
                    pageSize={10}
                    columns={tableColumns}
                    maxRowCount={props.scopeTableData.length}
                    data={props.scopeTableData}
                    clientPagination={true}
                    clientSorting={true}
                    loading={false}
                    selectedRows={props.selectedTableRows}
                    pageCount={Math.ceil(props.scopeTableData.length / 10)} />




                // <Table
                //     columns={tableColumns}
                //     data={props.scopeTableData}
                //     options={{
                //         toolbar: false,
                //         showHeader: false,
                //         filtering: true,
                //         search: false,
                //         draggable: false,
                //         pageSize: 10,
                //         emptyRowsWhenPaging: false,
                //         pageSizeOptions: [10, 50, 100],
                //         padding: 'dense',
                //         headerStyle: {
                //             backgroundColor: tokens.colors.interactive.table__header__fill_resting.rgba,
                //         },
                //         selection: true,
                //         selectionProps: (data: TagRow): any => ({
                //             // Disable and hide selection checkbox for preserved tags.
                //             // The checkboxes will however still be checked when using 'Select All' due to a bug in material-table: https://github.com/mbrn/material-table/issues/686
                //             // We are handling this by explicitly filtering out any preserved tags when rows are selected ('onSelectionChange').
                //             disabled: data.isPreserved,
                //             style: { display: data.isPreserved && 'none' },
                //             disableRipple: true
                //         }),
                //         rowStyle: (data): any => ({
                //             backgroundColor: (data.tableData.checked && !data.isPreserved) && '#e6faec'
                //         })
                //     }}
                //     style={{
                //         boxShadow: 'none'
                //     }}
                //     onSelectionChange={(rowData, row): void => {
                //         rowSelectionChanged(rowData, row);
                //     }}
                // />
            }
        </Container >
    );
};

export default SelectTags;

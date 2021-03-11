import { Button, TextField, Typography } from '@equinor/eds-core-react';
import { ButtonsContainer, Container, Header, InnerContainer, LoadingContainer, Search, TagsHeader, TopContainer } from './SelectTags.style';
import { Tag, TagRow } from '../types';

import { AddScopeMethod } from '../AddScope';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Loading from '../../../../../components/Loading';
import React, { useEffect, useState } from 'react';
import Table from '../../../../../components/Table';
import { tokens } from '@equinor/eds-tokens';
import { useHistory } from 'react-router-dom';
import { usePreservationContext } from '../../../context/PreservationContext';
import ProcosysTable from '@procosys/components/Table/ProcosysTable';

const tableColumns = [
    { Header: 'Tag no', field: 'tagNo', accessor: 'tagNo' },
    { Header: 'Description', field: 'description', accessor: 'description' },
    { Header: 'MC pkg', field: 'mcPkgNo', accessor: 'mcPkgNo' },
    { Header: 'MCCR resp', field: 'mccrResponsibleCodes', accessor: 'mccrResponsibleCodes' },
    { Header: 'PO', field: 'purchaseOrderHeader', accessor: 'purchaseOrderHeader' },
    { Header: 'Comm pkg', field: 'commPkgNo', accessor: 'commPkgNo' },
    { Header: 'Tag function', field: 'tagFunctionCode', accessor: 'tagFunctionCode' },
    {
        Header: 'Preserved',
        field: 'isPreserved',
        accessor: 'isPreserved',
        render: (rowData: TagRow): any => rowData.isPreserved && <CheckBoxIcon />,
        filtering: false
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
    console.log('props', props)
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
        console.log('rowselection changed')
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

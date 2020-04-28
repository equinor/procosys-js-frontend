import React from 'react';

import { Button, TextField } from '@equinor/eds-core-react';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { Tag, TagRow } from '../types';
import { Container, Header, Actions, Search, Next, Tags, TagsHeader, LoadingContainer, Toolbar } from './SelectTags.style';
import { usePreservationContext } from '../../../context/PreservationContext';
import Table from '../../../../../components/Table';
import Loading from '../../../../../components/Loading';
import { AddScopeMethod } from '../AddScope';

type SelectTagsProps = {
    selectedTags: Tag[];
    scopeTableData: TagRow[];
    setSelectedTags: (tags: Tag[]) => void;
    searchTags: (tagNo: string | null) => void;
    nextStep: () => void;
    isLoading: boolean;
    addScopeMethod: AddScopeMethod;
}

const KEYCODE_ENTER = 13;

const tableColumns = [
    { title: 'Tag no', field: 'tagNo' },
    { title: 'Description', field: 'description' },
    { title: 'MC Pkg no', field: 'mcPkgNo' },
    { title: 'MCCR Resp', field: 'mccrResponsibleCodes' },
    { title: 'PO no', field: 'purchaseOrderNumber' },
    { title: 'Comm pkg', field: 'commPkgNo' },
    { title: 'Tag Function', field: 'tagFunctionCode' },
    {
        title: 'Preserved',
        field: 'isPreserved',
        render: (rowData: TagRow): any => rowData.isPreserved && <CheckBoxIcon />,
        filtering: false
    },
];

const SelectTags = (props: SelectTagsProps): JSX.Element => {
    const { project } = usePreservationContext();

    const rowSelectionChanged = (selectedRows: TagRow[]): void => {
        // exclude any preserved tags (material-table bug)
        const tagsToSelect = selectedRows
            .filter(row => !row.isPreserved)
            .map(row => {
                return {
                    tagNo: row.tagNo,
                    description: row.description,
                    mcPkgNo: row.mcPkgNo
                };
            });

        props.setSelectedTags(tagsToSelect);
    };

    const getTableToolbar = (selectedRows: TagRow[]): JSX.Element => {
        // exclude any preserved tags from the count
        const selectedCount = selectedRows.filter(row => !row.isPreserved).length;
        return <Toolbar>{selectedCount} tags selected</Toolbar>;
    };

    return (
        <Container>
            <Header>
                <h1>Add preservation scope</h1>
                <div>{project.description}</div>
            </Header>
            <Actions>
                {
                    props.addScopeMethod === AddScopeMethod.AddTagsManually && (
                        < Search >
                            <TextField
                                id="tagSearch"
                                placeholder="Search by tag number"
                                helperText="Type the start of a tag number and press enter to load tags"
                                onKeyDown={(e: any): void => {
                                    e.keyCode === KEYCODE_ENTER && props.searchTags(e.currentTarget.value);
                                }}
                                onInput={(e: any): void => {
                                    e.currentTarget.value.length === 0 && props.searchTags(null);
                                }}
                            />
                        </Search>
                    )
                }
                < Next >
                    <Button onClick={props.nextStep} disabled={props.selectedTags.length === 0}>Next</Button>
                </Next>
            </Actions>
            <Tags>
                <TagsHeader>Select the tags that should be added to the preservation scope and click &apos;next&apos;</TagsHeader>
                <Table
                    columns={tableColumns}
                    data={props.scopeTableData}
                    options={{
                        showTitle: false,
                        filtering: true,
                        search: false,
                        draggable: false,
                        pageSize: 10,
                        pageSizeOptions: [10, 50, 100],
                        headerStyle: {
                            backgroundColor: '#f7f7f7'
                        },
                        selection: true,
                        selectionProps: (data: TagRow): any => ({
                            // Disable and hide selection checkbox for preserved tags.
                            // The checkboxes will however still be checked when using 'Select All' due to a bug in material-table: https://github.com/mbrn/material-table/issues/686
                            // We are handling this by explicitly filtering out any preserved tags when rows are selected ('onSelectionChange').
                            disabled: data.isPreserved,
                            style: { display: data.isPreserved && 'none' }
                        }),
                        rowStyle: (data): any => ({
                            backgroundColor: (data.tableData.checked && !data.isPreserved) && '#e6faec'
                        })
                    }}
                    style={{
                        boxShadow: 'none'
                    }}
                    onSelectionChange={rowSelectionChanged}
                    isLoading={props.isLoading}
                    components={{
                        OverlayLoading: (): JSX.Element => (
                            <LoadingContainer>
                                <Loading title="Loading tags" />
                            </LoadingContainer>
                        ),
                        Toolbar: (data): JSX.Element => getTableToolbar(data.selectedRows)
                    }}
                />
            </Tags>
        </Container >
    );
};

export default SelectTags;

import { Button, TextField, Typography } from '@equinor/eds-core-react';
import { ButtonsContainer, Container, Header, InnerContainer, LoadingContainer, Search, TagsHeader, TopContainer } from './SelectTags.style';
import { Tag, TagRow } from '../types';

import { AddScopeMethod } from '../AddScope';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Loading from '../../../../../components/Loading';
import React from 'react';
import Table from '../../../../../components/Table';
import { tokens } from '@equinor/eds-tokens';
import { useHistory } from 'react-router-dom';
import { usePreservationContext } from '../../../context/PreservationContext';

type SelectTagsProps = {
    selectedTags: Tag[];
    scopeTableData: TagRow[];
    setSelectedTags: (tags: Tag[]) => void;
    searchTags: (tagNo: string | null) => void;
    nextStep: () => void;
    isLoading: boolean;
    addScopeMethod: AddScopeMethod;
    removeTag: (tagNo: string) => void;
}

const KEYCODE_ENTER = 13;


const SelectTags = (props: SelectTagsProps): JSX.Element => {
    const { project, purchaseOrderNumber } = usePreservationContext();
    const history = useHistory();

    const tableColumns = [
        { title: 'Tag no', field: 'tagNo' },
        { title: 'Description', field: 'description' },
        { title: 'MC pkg', field: 'mcPkgNo' },
        { title: 'MCCR resp', field: 'mccrResponsibleCodes' },
        { title: 'PO', field: 'purchaseOrderTitle', filtering: purchaseOrderNumber ? false : true },
        { title: 'Comm pkg', field: 'commPkgNo' },
        { title: 'Tag function', field: 'tagFunctionCode' },
        {
            title: 'Preserved',
            field: 'isPreserved',
            render: (rowData: TagRow): any => rowData.isPreserved && <CheckBoxIcon />,
            filtering: false
        },
    ];

    const removeAllSelectedTagsInScope = (): void => {
        const tagNos: string[] = [];
        props.scopeTableData.forEach(l => {
            tagNos.push(l.tagNo);
        });
        const newSelectedTags = props.selectedTags.filter(item => !tagNos.includes(item.tagNo));
        props.setSelectedTags(newSelectedTags);
    };

    const addAllTagsInScope = (rowData: TagRow[]): void => {
        const allRows = rowData
            .filter(row => !row.isPreserved)
            .map(row => {
                return {
                    tagNo: row.tagNo,
                    description: row.description,
                    mcPkgNo: row.mcPkgNo
                };
            });
        const rowsToAdd = allRows.filter(row => !props.selectedTags.some(tag => tag.tagNo === row.tagNo));
        props.setSelectedTags([...props.selectedTags, ...rowsToAdd]);
    };

    const handleSingleTag = (row: TagRow): void => {
        const tagToHandle = {
            tagNo: row.tagNo,
            description: row.description,
            mcPkgNo: row.mcPkgNo
        };
        if (row.tableData && !row.tableData.checked) {
            props.removeTag(row.tagNo);
        } else {
            props.setSelectedTags([...props.selectedTags, tagToHandle]);
        }
    };

    const rowSelectionChanged = (rowData: TagRow[], row: TagRow): void => {
        // exclude any preserved tags (material-table bug)

        if (rowData.length == 0 && props.scopeTableData && props.scopeTableData.length > 0) {
            removeAllSelectedTagsInScope();
        } else if (rowData.length > 0 && rowData[0].tableData && !row) {
            addAllTagsInScope(rowData);
        } else if (rowData.length > 0 && !row.isPreserved) {
            handleSingleTag(row);
        }
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
                <Table
                    columns={tableColumns}
                    data={props.scopeTableData}
                    options={{
                        toolbar: false,
                        showTitle: false,
                        filtering: true,
                        search: false,
                        draggable: false,
                        pageSize: 10,
                        emptyRowsWhenPaging: false,
                        pageSizeOptions: [10, 50, 100],
                        padding: 'dense',
                        headerStyle: {
                            backgroundColor: tokens.colors.interactive.table__header__fill_resting.rgba,
                        },
                        selection: true,
                        selectionProps: (data: TagRow): any => ({
                            // Disable and hide selection checkbox for preserved tags.
                            // The checkboxes will however still be checked when using 'Select All' due to a bug in material-table: https://github.com/mbrn/material-table/issues/686
                            // We are handling this by explicitly filtering out any preserved tags when rows are selected ('onSelectionChange').
                            disabled: data.isPreserved,
                            style: { display: data.isPreserved && 'none' },
                            disableRipple: true
                        }),
                        rowStyle: (data): any => ({
                            backgroundColor: (data.tableData.checked && !data.isPreserved) && '#e6faec'
                        })
                    }}
                    style={{
                        boxShadow: 'none'
                    }}
                    onSelectionChange={(rowData, row): void => {
                        rowSelectionChanged(rowData, row);
                    }}
                />
            }
        </Container >
    );
};

export default SelectTags;

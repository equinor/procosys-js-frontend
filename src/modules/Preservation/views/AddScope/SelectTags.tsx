import React from 'react';

import { Button, TextField } from '@equinor/eds-core-react';
import CheckBoxIcon from '@material-ui/icons/Checkbox';
import { Tag, TagRow } from './types';
import { Container, Header, Actions, Search, Next, Tags, TagsHeader, LoadingContainer, Toolbar } from './SelectTags.style';
import { usePreservationContext } from '../../context/PreservationContext';
import Table from './../../../../components/Table';
import Loading from './../../../../components/Loading';

type SelectTagsProps = {
    selectedTags: Tag[];
    scopeTableData: TagRow[];
    setSelectedTags: (tags: Tag[]) => void;
    searchTags: (tagNo: string | null) => void;
    nextStep: () => void;
    isLoading: boolean;
}

const KEYCODE_ENTER = 13;

const tableColumns = [
    { title: 'Tag no', field: 'tagNo' },
    { title: 'Description', field: 'description' },
    { title: 'PO no', field: 'purchaseOrderNumber' },
    { title: 'Comm pkg', field: 'commPkgNo' },
    { 
        title: 'Preserved', 
        field: 'isPreserved',
        render: (rowData: TagRow): any => rowData.isPreserved && <CheckBoxIcon />
    },
    { title: 'MC pkg', field: 'mcPkgNo' }
];

const SelectTags = (props: SelectTagsProps): JSX.Element => {
    const { project } = usePreservationContext();

    const rowSelectionChanged = (selectedRows: TagRow[]): void => {
        props.setSelectedTags(selectedRows.map(row => {
            return { tagNo: row.tagNo }; 
        }));        
    };

    return (
        <Container>
            <Header>
                <h1>Add preservation scope</h1>
                <div>{project.description}</div>
            </Header>
            <Actions>
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
                <Next>
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
                        search: false,
                        draggable: false,
                        pageSize: 10,
                        pageSizeOptions: [10, 50, 100],
                        headerStyle: {
                            backgroundColor: '#f7f7f7'
                        },
                        selection: true,
                        selectionProps: (data: TagRow): any => ({
                            disabled: data.isPreserved,
                            // Bug: 'Select all' will also select disabled checkboxes: https://github.com/mbrn/material-table/issues/686
                            // Disabled checkbox should be hidden, but that would also hide the 'select all' problem
                            // style: { display: rowData.isPreserved && 'none' }
                        })
                    }} 
                    style={{
                        boxShadow: 'none' 
                    }}                
                    onSelectionChange={rowSelectionChanged}
                    isLoading={props.isLoading}
                    components={{
                        OverlayLoading: (): any => (
                            <LoadingContainer>
                                <Loading title="Loading tags" />
                            </LoadingContainer>                            
                        ),
                        Toolbar: (data): any => (
                            <Toolbar>{data.selectedRows.length} tags selected</Toolbar>
                        )
                    }}
                />
            </Tags>
        </Container>
    );
};

export default SelectTags;

import React from 'react';

import { Button, TextField } from '@equinor/eds-core-react';
import { Tag, TagRow } from './types';
import { Container, Header, Actions, Search, Next, Tags, TagsHeader, LoadingContainer } from './SelectTags.style';
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
    { title: 'Tag nr', field: 'tagNo' },
    { title: 'Description', field: 'description' },
    { title: 'PO no', field: 'purchaseOrderNumber' },
    { title: 'Comm pkg', field: 'commPkgNo' },
    { title: 'Preserved', field: 'isPreserved' },
    { title: 'MC package nr', field: 'mcPkgNo' }
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
                        selection: true,
                        search: false
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
                        )
                    }}
                />
            </Tags>
        </Container>
    );
};

export default SelectTags;

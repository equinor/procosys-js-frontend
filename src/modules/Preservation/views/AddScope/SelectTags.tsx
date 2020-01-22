import React from 'react';

import { Button, TextField } from '@equinor/eds-core-react';
import { Tag, TagRow } from './types';
import { Container, Header, ActionContainer, SearchContainer, ButtonContainer, TagsContainer, TagsHeader } from './SelectTags.style';
import { usePreservationContext } from '../../context/PreservationContext';
import Table from './../../../../components/Table';

type SelectTagsProps = {
    selectedTags: Tag[];
    scopeTableData: TagRow[];
    setSelectedTags: (tags: Array<Tag>) => void;
    searchTags: (tagNo: string | null) => void;
    nextStep: () => void;
}

const KEYCODE_ENTER = 13;

const tableColumns = [
    { title: 'TagId', field: 'tagId', hidden: true },
    { title: 'Tag nr', field: 'tagNo' },
    { title: 'Description', field: 'description' },
    { title: 'PO no', field: 'poNo' },
    { title: 'Comm pkg', field: 'commPkg' },
    { title: 'Preserved', field: 'preserved' },
    { title: 'MC package nr', field: 'mcPkg' },
    { title: 'MC package description', field: 'mcPkgDescription' }
];

const SelectTags = (props: SelectTagsProps): JSX.Element => {
    const { project } = usePreservationContext();

    // TODO: not sure we need this, verify when API data is returned
    // useMemo(() => {
    //     // set selected rows from tags in state
    //     props.scopeTableData.forEach(tagRow => {
    //         props.selectedTags.forEach(selectedTag => {
    //             if (selectedTag.id === tagRow.tagId) {
    //                 tagRow.tableData.checked = true;
    //             }
    //         });
    //     });  
    // }, [props.selectedTags, props.scopeTableData]);

    const rowSelectionChanged = (selectedRows: TagRow[]): void => {
        // set selected tags into state
        props.setSelectedTags(selectedRows.map(row => {
            return { id: row.tagId }; 
        }));        
    };

    return (
        <Container>
            <Header>
                <h1>Add preservation scope</h1>
                <div>{project.description}</div>
            </Header>
            <ActionContainer>
                <SearchContainer>
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
                </SearchContainer> 
                <ButtonContainer>
                    <Button onClick={props.nextStep} disabled={props.selectedTags.length === 0}>Next</Button>
                </ButtonContainer>                            
            </ActionContainer>
            <TagsContainer hasData={props.scopeTableData.length > 0}>
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
                />
            </TagsContainer>
        </Container>
    );
};

export default SelectTags;

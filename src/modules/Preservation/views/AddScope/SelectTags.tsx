import React, { useMemo } from 'react';

import { Button, TextField } from '@equinor/eds-core-react';
import { Tag } from './types';
import { Container, Header, ActionBar, Search, Next, Tags, TagsHeader } from './SelectTags.style';
import { usePreservationContext } from '../../context/PreservationContext';
import Table from './../../../../components/Table';

type SelectTagsProps = {
    tags: Tag[];
    setSelectedTags: (tags: Array<Tag>) => void;
    nextStep: () => void;
}

type TagRow = {
    tagId: number;
    tagNo: string;
    description: string;
    tableData: {
        checked: boolean;
    };
};

const KEYCODE_ENTER = 13;

const SelectTags = (props: SelectTagsProps): JSX.Element => {
    const { project } = usePreservationContext();

    // TODO: remove when API is implemented
    const testData: TagRow[] = [
        { tagId: 10, tagNo: 'Tag 1', description: 'desc 1', tableData: { checked: false } },
        { tagId: 20, tagNo: 'Tag 2', description: 'desc 2', tableData: { checked: false } },
        { tagId: 30, tagNo: 'Tag 3', description: 'desc 3', tableData: { checked: false } },
        { tagId: 40, tagNo: 'Tag 4', description: 'desc 4', tableData: { checked: false } },
        { tagId: 50, tagNo: 'Tag 5', description: 'desc 5', tableData: { checked: false } },
        { tagId: 60, tagNo: 'Tag 6', description: 'desc 6', tableData: { checked: false } },
        { tagId: 70, tagNo: 'Tag 7', description: 'desc 7', tableData: { checked: false } }
    ];

    let tagRows: TagRow[] = [];
    let selectedTagIds: number[] = [];

    const getTableData = (): TagRow[] => {

        // TODO: replace with API call to fetch data
        const tableData = testData;

        // set selected rows from tags in state
        tableData.forEach(tagRow => {
            props.tags.forEach(tagInState => {
                if (tagInState.id === tagRow.tagId) {
                    tagRow.tableData.checked = true;
                    selectedTagIds.push(tagInState.id);
                }
            });
        });        
        
        return tableData;
    };

    // TODO: how to get the initial table data? (one time only?)
    useMemo(() => {
        tagRows = getTableData();
    }, [tagRows]);

    const rowSelectionChanged = (selectedRows: TagRow[]): void => {
        selectedTagIds = selectedRows.map(row => {
            return row.tagId;
        });
    };

    const goToNext = (): void => {
        // set selected tags into state
        props.setSelectedTags(selectedTagIds.map(tagId => {
            return { id: tagId }; 
        }));
        
        props.nextStep();
    };

    const searchTags = (tagNo: string): void => {
        // TODO: implement search..
        console.log('Search tag number: ' + tagNo);
    };

    return (
        <Container>
            <Header>
                <h1>Add preservation scope</h1>
                <div>{project.description}</div>
            </Header>
            <ActionBar>
                <Search>
                    <TextField 
                        id="tagSearch"
                        placeholder="Search by tag number" 
                        helperText="Type the start of a tag number and press enter to load tags"
                        onKeyDown={(e: any): void => {
                            e.keyCode === KEYCODE_ENTER && searchTags(e.currentTarget.value);
                        }}
                    />  
                </Search> 
                <Next>
                    <Button onClick={goToNext}>Next</Button>
                </Next>                            
            </ActionBar>
            <Tags>
                <TagsHeader>Select the tags that should be added to the preservation scope and click &apos;next&apos;</TagsHeader>
                <Table 
                    columns={[
                        { title: 'TagId', field: 'tagId', hidden: true },
                        { title: 'Tag nr', field: 'tagNo' },
                        { title: 'Description', field: 'description' },
                    ]}
                    data={tagRows} 
                    options={{
                        showTitle: false,
                        selection: true                        
                    }} 
                    style={{
                        boxShadow: 'none' 
                    }}                
                    onSelectionChange={rowSelectionChanged}
                />
            </Tags>
        </Container>
    );
};

export default SelectTags;

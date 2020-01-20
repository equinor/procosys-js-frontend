import React, { useMemo, useState, useEffect } from 'react';

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

const tableColumns = [
    { title: 'TagId', field: 'tagId', hidden: true },
    { title: 'Tag nr', field: 'tagNo' },
    { title: 'Description', field: 'description' },
];

const SelectTags = (props: SelectTagsProps): JSX.Element => {
    const { project } = usePreservationContext();

    const [tableData, setTableData] = useState<TagRow[]>([]);

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

    const getTableData = (): TagRow[] => {
        // TODO: replace with API call to fetch data
        return testData;
    };    

    useMemo(() => {
        // set selected rows from tags in state
        tableData.forEach(tagRow => {
            props.tags.forEach(tagInState => {
                if (tagInState.id === tagRow.tagId) {
                    tagRow.tableData.checked = true;
                }
            });
        });  
    }, [props.tags, tableData]);

    useEffect(() => {
        setTableData(getTableData());
    }, []);

    const rowSelectionChanged = (selectedRows: TagRow[]): void => {
        // set selected tags into state
        props.setSelectedTags(selectedRows.map(row => {
            return { id: row.tagId }; 
        }));        
    };

    // TODO: implement search..
    const searchTags = (tagNo: string): void => {
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
                    <Button onClick={props.nextStep}>Next</Button>
                </Next>                            
            </ActionBar>
            <Tags>
                <TagsHeader>Select the tags that should be added to the preservation scope and click &apos;next&apos;</TagsHeader>
                <Table 
                    columns={tableColumns}
                    data={tableData} 
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

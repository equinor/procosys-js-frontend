import React from 'react';

import Table from './../../../../components/Table';
import { PreservedTag, Requirement } from './types';
import { tokens } from '@equinor/eds-tokens';
import { Typography } from '@equinor/eds-core-react';
import { Toolbar, TagLink, TagStatusLabel } from './ScopeTable.style';

interface ScopeTableProps {
    tags: PreservedTag[];
    isLoading: boolean;
    setSelectedTags: (tags: PreservedTag[]) => void;
    showTagDetails: (tag: PreservedTag) => void;
}

const ScopeTable = ({
    tags,
    isLoading,
    setSelectedTags,
    showTagDetails
}: ScopeTableProps): JSX.Element => {

    const getFirstUpcomingRequirement = (tag: PreservedTag): Requirement | null => {
        if (!tag.requirements || tag.requirements.length === 0) {
            return null;
        }

        return tag.requirements[0];        
    };

    const isOverdue = (tag: PreservedTag): boolean => {
        const requirement = getFirstUpcomingRequirement(tag);
        return requirement ? requirement.nextDueWeeks < 0 : false;
    };

    const getTagNoColumn = (tag: PreservedTag): JSX.Element => {
        return (
            <TagLink
                isOverdue={isOverdue(tag)}
                onClick={(): void => showTagDetails(tag)}
            >
                {tag.tagNo}
            </TagLink>
        );
    };

    const getDescriptionColumn = (tag: PreservedTag): JSX.Element => {
        return (
            <div style={{display: 'flex', alignItems: 'center', color: 'inherit'}}>
                {tag.description}
                {tag.isNew && <TagStatusLabel>new</TagStatusLabel>}
            </div>
        );
    };

    const getNextColumn = (tag: PreservedTag): string | null => {
        const requirement = getFirstUpcomingRequirement(tag);
        return requirement ? requirement.nextDueAsYearAndWeek : null;
    };

    const getDueColumn = (tag: PreservedTag): number | null => {
        const requirement = getFirstUpcomingRequirement(tag);
        return requirement ? requirement.nextDueWeeks : null;
    };

    return (
        <Table
            columns={[
                { title: 'Tag nr', render: getTagNoColumn },
                { title: 'Description', render: getDescriptionColumn },
                { title: 'Next', render: getNextColumn },
                { title: 'Due', render: getDueColumn },
                { title: 'PO nr', field: 'purchaseOrderNo' },
                { title: 'Area', field: 'areaCode' },
                { title: 'Resp', field: 'responsibleCode' },
                { title: 'Disc', field: 'disciplineCode' },
                { title: 'Status', field: 'status' },
            ]}
            data={tags}
            options={{
                showTitle: false,
                draggable: false,
                selection: true,
                pageSize: 10,
                pageSizeOptions: [10, 50, 100],
                headerStyle: {
                    backgroundColor: '#f7f7f7'
                },
                rowStyle: (rowData): any => ({
                    color: isOverdue(rowData) && tokens.colors.interactive.danger__text.rgba,
                    backgroundColor: rowData.tableData.checked && '#e6faec'
                }),
            }}
            components={{
                Toolbar: (data): any => (
                    <Toolbar>
                        <Typography variant='body_long'>{data.selectedRows.length} tags selected</Typography>
                    </Toolbar>
                )
            }}
            isLoading={isLoading}
            onSelectionChange={setSelectedTags}
            style={{ boxShadow: 'none' }}
        />
    );
};

export default ScopeTable;
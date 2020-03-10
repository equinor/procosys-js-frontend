import React from 'react';

import Table from './../../../../components/Table';
import { PreservedTag, Requirement } from './types';
import { tokens } from '@equinor/eds-tokens';
import { Typography } from '@equinor/eds-core-react';
import { Toolbar, TagLink, TagStatusLabel, RequirementsContainer, RequirementIcon } from './ScopeTable.style';
import PreservationIcon from './../PreservationIcon';

interface ScopeTableProps {
    tags: PreservedTag[];
    isLoading: boolean;
    setSelectedTags: (tags: PreservedTag[]) => void;
    showTagDetails: (tag: PreservedTag) => void;
}

const isRequirementOverdue = (requirement: Requirement): boolean => requirement.nextDueWeeks < 0;

const isRequirementDue = (requirement: Requirement): boolean => requirement.nextDueWeeks === 0;

const getFirstUpcomingRequirement = (tag: PreservedTag): Requirement | null => {
    if (!tag.requirements || tag.requirements.length === 0) {
        return null;
    }

    return tag.requirements[0];
};

export const isTagOverdue = (tag: PreservedTag): boolean => {
    const requirement = getFirstUpcomingRequirement(tag);
    return requirement ? isRequirementOverdue(requirement) : false;
};

export const getRequirementColumn = (tag: PreservedTag): JSX.Element => {
    return (
        <RequirementsContainer>
            {
                tag.requirements.map(req => {
                    return (
                        <RequirementIcon
                            key={req.id}
                            isDue={isRequirementDue(req) || isRequirementOverdue(req)}
                            isReadyToBePreserved={req.readyToBePreserved}
                        >
                            <PreservationIcon variant={req.requirementTypeCode} />
                        </RequirementIcon>
                    );
                })
            }
        </RequirementsContainer>
    );
};

const ScopeTable = ({
    tags,
    isLoading,
    setSelectedTags,
    showTagDetails
}: ScopeTableProps): JSX.Element => {

    const getTagNoColumn = (tag: PreservedTag): JSX.Element => {
        return (
            <TagLink
                isOverdue={isTagOverdue(tag)}
                onClick={(): void => showTagDetails(tag)}
            >
                {tag.tagNo}
            </TagLink>
        );
    };

    const getDescriptionColumn = (tag: PreservedTag): JSX.Element => {
        return (
            <div style={{ display: 'flex', alignItems: 'center', color: 'inherit' }}>
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
                { title: 'Req type', render: getRequirementColumn }
            ]}
            data={tags}
            options={{
                showTitle: false,
                draggable: false,
                selection: true,
                pageSize: 10,
                pageSizeOptions: [10, 50, 100],
                headerStyle: {
                    backgroundColor: tokens.colors.interactive.table__header__fill_resting.rgba
                },
                rowStyle: (rowData): any => ({
                    color: isTagOverdue(rowData) && tokens.colors.interactive.danger__text.rgba,
                    backgroundColor: rowData.tableData.checked && tokens.colors.interactive.primary__selected_highlight.rgba
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
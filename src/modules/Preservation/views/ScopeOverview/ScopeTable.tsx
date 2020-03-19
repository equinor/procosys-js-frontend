import React from 'react';
import Table from './../../../../components/Table';
import { PreservedTag, PreservedTags } from './types';
import { tokens } from '@equinor/eds-tokens';
import { Typography } from '@equinor/eds-core-react';
import { Toolbar, TagLink, TagStatusLabel } from './ScopeTable.style';
import RequirementIcons from './RequirementIcons';
import { isTagOverdue, getFirstUpcomingRequirement } from './ScopeOverview';

interface ScopeTableProps {
    getTags: (page: number, pageSize: number) => Promise<PreservedTags | null>;
    isLoading: boolean;
    setSelectedTags: (tags: PreservedTag[]) => void;
    showTagDetails: (tag: PreservedTag) => void;
    setRefreshScopeListCallback: (callback: () => void) => void;
}

const ScopeTable = ({
    getTags,
    isLoading,
    setSelectedTags,
    showTagDetails,
    setRefreshScopeListCallback,

}: ScopeTableProps): JSX.Element => {

    const ref = React.createRef();

    const refreshScopeList = (): void => {
        const referanse: any = ref.current;
        referanse?.onQueryChange();
    };

    setRefreshScopeListCallback(refreshScopeList);

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

    const getRequirementColumn = (tag: PreservedTag): JSX.Element => {
        return (
            <RequirementIcons tag={tag} />
        );
    };

    return (
        <Table
            tableRef={ref} //reference will be used by parent, to trigger rendering
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
            data={(query: any): any =>
                new Promise((resolve) => {
                    getTags(query.page, query.pageSize).then((result) => {
                        resolve({
                            data: result?.tags,
                            page: query.page,
                            totalCount: result?.maxAvailable
                        });
                    });
                })
            }
            options={{
                showTitle: false,
                draggable: false,
                selection: true,
                pageSize: 10,
                emptyRowsWhenPaging: false,
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
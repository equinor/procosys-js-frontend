/* eslint-disable @typescript-eslint/ban-ts-ignore */
import React, { RefObject } from 'react';
import Table from './../../../../components/Table';
import { PreservedTag, PreservedTags } from './types';
import { tokens } from '@equinor/eds-tokens';
import { Typography } from '@equinor/eds-core-react';
import { Toolbar, TagLink, TagStatusLabel, Container } from './ScopeTable.style';
import RequirementIcons from './RequirementIcons';
import { isTagOverdue, getFirstUpcomingRequirement } from './ScopeOverview';
import { Tooltip } from '@material-ui/core';

interface ScopeTableProps {
    getTags: (page: number, pageSize: number, orderBy: string | null, orderDirection: string | null) => Promise<PreservedTags | null>;
    //isLoading: boolean;
    setSelectedTags: (tags: PreservedTag[]) => void;
    showTagDetails: (tag: PreservedTag) => void;
    setRefreshScopeListCallback: (callback: () => void) => void;
    pageSize: number;
    setPageSize: (pageSize: number) => void;
}

const ScopeTable = ({
    getTags,
    //isLoading,
    setSelectedTags,
    showTagDetails,
    setRefreshScopeListCallback,
    pageSize,
    setPageSize,
}: ScopeTableProps): JSX.Element => {

    const ref: RefObject<any> = React.createRef();

    setRefreshScopeListCallback(() => {
        if (ref.current) {
            ref.current.onQueryChange();
        }
    });

    const getTagNoColumn = (tag: PreservedTag): JSX.Element => {
        return (
            <TagLink
                isOverdue={isTagOverdue(tag)}
                onClick={(): void => showTagDetails(tag)}
            >
                <Tooltip title={tag.tagNo} arrow={true} enterDelay={200} enterNextDelay={100} >
                    <span>{tag.tagNo}</span>
                </Tooltip>

            </TagLink>
        );
    };

    const getDescriptionColumn = (tag: PreservedTag): JSX.Element => {
        return (
            <div style={{ display: 'flex', alignItems: 'center', color: 'inherit', }}>
                <Tooltip title={tag.description} arrow={true} enterDelay={200} enterNextDelay={100}>
                    <div style={{ display: 'block', overflow: 'hidden',  whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>{tag.description}</div>
                </Tooltip>
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

    const sortFieldMap: { [key: string]: string } = {
        'Tag nr': 'TagNo',
        'Description': 'Description',
        'Due': 'Due',
        'Next': 'Due',
        'PO nr': 'PO',
        'Resp': 'Responsible',
        'Status': 'Status',
        'Area': 'Area',
        'Disc': 'Discipline',
        'Mode': 'Mode'
    };

    return (
        <Container>
            <Table id='table'
                tableRef={ref} //reference will be used by parent, to trigger rendering
                columns={[
                    { title: 'Tag nr', render: getTagNoColumn, cellStyle: {minWidth: '150px', maxWidth: '150px', paddingTop: '6px'}},
                    { title: 'Description', render: getDescriptionColumn, cellStyle: {maxWidth: '150px'}},
                    // @ts-ignore Width is not a property of material-table
                    { title: 'Next', render: getNextColumn, width: '7%'  },
                    // @ts-ignore
                    { title: 'Due', render: getDueColumn, defaultSort: 'asc', width: '5%', cellStyle: {paddingTop: '6px'} },
                    // @ts-ignore
                    { title: 'Mode', field: 'mode', width: '10%', cellStyle: {paddingTop: '6px'} },
                    // @ts-ignore
                    { title: 'PO nr', field: 'purchaseOrderNo', width: '8%', cellStyle: {paddingTop: '6px'} },
                    // @ts-ignore
                    { title: 'Area', field: 'areaCode', width: '7%', cellStyle: {paddingTop: '6px'}  },
                    // @ts-ignore
                    { title: 'Resp', field: 'responsibleCode', width: '7%', cellStyle: {paddingTop: '6px'}  },
                    // @ts-ignore
                    { title: 'Disc', field: 'disciplineCode', width: '5%', cellStyle: {paddingTop: '6px'}  },
                    // @ts-ignore
                    { title: 'Status', field: 'status', width: '8%', cellStyle: {paddingTop: '6px'} },
                    // @ts-ignore
                    { title: 'Req type', render: getRequirementColumn, sorting: false, width: '10%', cellStyle: {paddingTop: '6px'} }
                ]}
                data={(query: any): any =>
                    new Promise((resolve) => {
                        const orderByField: string | null = query.orderBy ? sortFieldMap[query.orderBy.title] : null;
                        const orderDirection: string | null = orderByField ? query.orderDirection ? query.orderDirection : 'Asc' : null;

                        getTags(query.page, query.pageSize, orderByField, orderDirection).then((result) => {
                            result ?
                                resolve({
                                    data: result.tags,
                                    page: query.page,
                                    totalCount: result.maxAvailable
                                }) : null;
                        });
                    })
                }
                options={{
                    showTitle: false,
                    draggable: false,
                    selection: true,
                    padding: 'dense',
                    pageSize: pageSize,
                    emptyRowsWhenPaging: false,
                    pageSizeOptions: [10, 50, 100, 500, 1000],
                    headerStyle: {
                        backgroundColor: tokens.colors.interactive.table__header__fill_resting.rgba,
                        whiteSpace: 'nowrap',
                        fontFamily: 'Equinor',
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
                //isLoading={isLoading}
                onSelectionChange={setSelectedTags}
                style={{ boxShadow: 'none' }}
                onChangeRowsPerPage={setPageSize}
            />
        </Container>
    );
};

export default ScopeTable;

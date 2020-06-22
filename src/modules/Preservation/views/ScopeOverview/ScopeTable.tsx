/* eslint-disable @typescript-eslint/ban-ts-ignore */
import React, { RefObject, ReactNode } from 'react';
import Table from './../../../../components/Table';
import { PreservedTag, PreservedTags } from './types';
import { tokens } from '@equinor/eds-tokens';
import { Typography } from '@equinor/eds-core-react';
import { Toolbar, TagLink, TagStatusLabel, Container } from './ScopeTable.style';
import RequirementIcons from './RequirementIcons';
import { isTagOverdue, getFirstUpcomingRequirement, isTagVoided } from './ScopeOverview';
import { QueryResult, Query } from 'material-table';
import { Tooltip } from '@material-ui/core';

interface ScopeTableProps {
    getTags: (page: number, pageSize: number, orderBy: string | null, orderDirection: string | null) => Promise<PreservedTags>;
    setSelectedTags: (tags: PreservedTag[]) => void;
    showTagDetails: (tag: PreservedTag) => void;
    setRefreshScopeListCallback: (callback: () => void) => void;
    pageSize: number;
    setPageSize: (pageSize: number) => void;
}

class ScopeTable extends React.Component<ScopeTableProps, {}> {
    refObject: React.RefObject<any>;

    constructor(props: ScopeTableProps) {
        super(props);
        this.refObject = React.createRef();
        this.getTagsByQuery = this.getTagsByQuery.bind(this);
        this.getTagNoColumn = this.getTagNoColumn.bind(this);
    }

    shouldComponentUpdate(): boolean {
        return false;
    }

    componentDidMount(): void {
        this.props.setRefreshScopeListCallback(() => {
            if (this.refObject.current) {
                this.refObject.current.onQueryChange();
            }
        });
    }

    getTagNoColumn(tag: PreservedTag): JSX.Element {
        return (
            <TagLink
                isOverdue={isTagOverdue(tag)}
                isVoided={tag.isVoided}
                onClick={(): void => this.props.showTagDetails(tag)}
            >
                <span style={{ color: 'inherit' }}>{tag.tagNo}</span>
            </TagLink>
        );
    }

    getDescriptionColumn(tag: PreservedTag): JSX.Element {
        return (
            <div style={{ display: 'flex', alignItems: 'center', color: 'inherit' }}>
                <Tooltip title={tag.description} arrow={true} enterDelay={200} enterNextDelay={100}>
                    <div style={{ display: 'block', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', color: 'inherit' }}>{tag.description}</div>
                </Tooltip>
                {tag.isNew && <TagStatusLabel>new</TagStatusLabel>}
            </div>

        );
    }

    getResponsibleColumn(tag: PreservedTag): JSX.Element {
        return (
            <Tooltip title={tag.responsibleCode} arrow={true} enterDelay={200} enterNextDelay={100}>
                <div style={{ display: 'block', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', color: 'inherit' }}>{tag.responsibleCode}</div>
            </Tooltip>
        );
    }

    getNextColumn(tag: PreservedTag): string | null {
        const requirement = getFirstUpcomingRequirement(tag);
        return (!requirement || tag.isVoided) ? null : requirement.nextDueAsYearAndWeek;
    }

    getDueColumn(tag: PreservedTag): number | null {
        const requirement = getFirstUpcomingRequirement(tag);
        return (!requirement || tag.isVoided) ? null : requirement.nextDueWeeks;
    }

    getRequirementColumn(tag: PreservedTag): JSX.Element {
        return (
            <RequirementIcons tag={tag} />
        );
    }

    getTagsByQuery(query: Query<any>): Promise<QueryResult<any>> {
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

        const orderByField: string | null = query.orderBy ? sortFieldMap[query.orderBy.title as string] : null;
        const orderDirection: string | null = orderByField ? query.orderDirection ? query.orderDirection : 'Asc' : null;
        return new Promise((resolve) => {
            this.props.getTags(query.page, query.pageSize, orderByField, orderDirection).then(result => {
                resolve({
                    data: result.tags,
                    page: query.page,
                    totalCount: result.maxAvailable
                });
            });

        });

    }

    render(): ReactNode {
        return (
            <Container>
                <Table id='table'
                    tableRef={this.refObject} //reference will be used by parent, to trigger rendering
                    columns={[
                        { title: 'Tag nr', render: this.getTagNoColumn, cellStyle: { minWidth: '200px', maxWidth: '250px' } },
                        { title: 'Description', render: this.getDescriptionColumn, cellStyle: { maxWidth: '150px' } },
                        // @ts-ignore Width is not a property of material-table
                        { title: 'Next', render: this.getNextColumn, width: '7%' },
                        // @ts-ignore
                        { title: 'Due', render: this.getDueColumn, defaultSort: 'asc', width: '5%' },
                        // @ts-ignore
                        { title: 'Mode', field: 'mode', width: '8%' },
                        // @ts-ignore
                        { title: 'PO nr', field: 'purchaseOrderNo', width: '7%' },
                        // @ts-ignore
                        { title: 'Area', field: 'areaCode', width: '7%' },
                        // @ts-ignore
                        { title: 'Resp', render: this.getResponsibleColumn, width: '7%', cellStyle: { maxWidth: '150px' } },
                        // @ts-ignore
                        { title: 'Disc', field: 'disciplineCode', width: '5%' },
                        // @ts-ignore
                        { title: 'Status', field: 'status', width: '7%', customSort: (): any => null },
                        // @ts-ignore
                        { title: 'Req type', render: this.getRequirementColumn, sorting: false, width: '10%' }
                    ]}
                    data={this.getTagsByQuery}
                    options={{
                        showTitle: false,
                        draggable: false,
                        selection: true,
                        padding: 'dense',
                        pageSize: this.props.pageSize,
                        emptyRowsWhenPaging: false,
                        pageSizeOptions: [10, 50, 100, 500, 1000],
                        headerStyle: {
                            backgroundColor: tokens.colors.interactive.table__header__fill_resting.rgba,
                            whiteSpace: 'nowrap',
                            fontFamily: 'Equinor',
                        },
                        rowStyle: (rowData): any => ({
                            opacity: isTagVoided(rowData) && 0.5,
                            color: isTagOverdue(rowData) && tokens.colors.interactive.danger__text.rgba,
                            backgroundColor: rowData.tableData.checked && tokens.colors.interactive.primary__selected_highlight.rgba,
                        }),
                        thirdSortClick: false
                    }}
                    components={{
                        Toolbar: (data): any => (
                            <Toolbar>
                                <Typography variant='body_long'>{data.selectedRows.length} tags selected</Typography>
                            </Toolbar>
                        )
                    }}
                    onSelectionChange={this.props.setSelectedTags}
                    style={{ boxShadow: 'none' }}
                    onChangeRowsPerPage={this.props.setPageSize}
                />
            </Container>);
    }
}

export default ScopeTable;

/* eslint-disable @typescript-eslint/ban-ts-ignore */
import React, { RefObject, ReactNode } from 'react';
import Table from './../../../../components/Table';
import { PreservedTag, PreservedTags } from './types';
import { tokens } from '@equinor/eds-tokens';
import { Typography } from '@equinor/eds-core-react';
import { Toolbar, TagLink, TagStatusLabel, Container, SingleIconContainer } from './ScopeTable.style';
import RequirementIcons from './RequirementIcons';
import { isTagOverdue, getFirstUpcomingRequirement, isTagVoided } from './ScopeOverview';
import { QueryResult, Query } from 'material-table';
import { Tooltip } from '@material-ui/core';
import EdsIcon from '../../../../components/EdsIcon';

interface ScopeTableProps {
    getTags: (page: number, pageSize: number, orderBy: string | null, orderDirection: string | null) => Promise<PreservedTags>;
    setSelectedTags: (tags: PreservedTag[]) => void;
    showTagDetails: (tag: PreservedTag) => void;
    setRefreshScopeListCallback: (callback: () => void) => void;
    pageSize: number;
    setPageSize: (pageSize: number) => void;
    shouldSelectFirstPage: boolean;
    setFirstPageSelected: () => void;
}

enum ActionStatus {
    Closed = 'HasClosed',
    Open = 'HasOpen',
    OverDue = 'HasOverDue'
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
                    <div>{tag.description}</div>
                </Tooltip>
                {tag.isNew && <TagStatusLabel>new</TagStatusLabel>}
            </div>
        );
    }

    getResponsibleColumn(tag: PreservedTag): JSX.Element {
        return (
            <Tooltip title={tag.responsibleDescription} arrow={true} enterDelay={200} enterNextDelay={100}>
                <div>{tag.responsibleCode}</div>
            </Tooltip>
        );
    }

    getNextColumn(tag: PreservedTag): JSX.Element {
        const requirement = getFirstUpcomingRequirement(tag);
        return (
            <div>
                {(!requirement || tag.isVoided) ? null : requirement.nextDueAsYearAndWeek}
            </div>);
    }

    getDueColumn(tag: PreservedTag): JSX.Element {
        const requirement = getFirstUpcomingRequirement(tag);
        return (
            <div>
                {(!requirement || tag.isVoided) ? null : requirement.nextDueWeeks}
            </div>);
    }

    getRequirementColumn(tag: PreservedTag): JSX.Element {
        return (
            <RequirementIcons tag={tag} />
        );
    }

    getPOColumn(tag: PreservedTag): JSX.Element {
        return (<Tooltip title={tag.calloffNo ? `${tag.purchaseOrderNo}/${tag.calloffNo}` : tag.purchaseOrderNo ? tag.purchaseOrderNo : ''} arrow={true} enterDelay={200} enterNextDelay={100}>
            <div>
                {tag.calloffNo ? `${tag.purchaseOrderNo}/${tag.calloffNo}` : tag.purchaseOrderNo}
            </div>
        </Tooltip>);
    }

    getMode(tag: PreservedTag): JSX.Element {
        return (
            <div>
                {tag.mode}
            </div>);
    }

    getAreaCode(tag: PreservedTag): JSX.Element {
        return (
            <div>
                {tag.areaCode}
            </div>);
    }

    getDisciplineCode(tag: PreservedTag): JSX.Element {
        return (
            <div>
                {tag.disciplineCode}
            </div>);
    }

    getStatus(tag: PreservedTag): JSX.Element {
        return (
            <div>
                {tag.status}
            </div>);
    }

    getActionsColumn(tag: PreservedTag): JSX.Element {
        if (!tag.actionStatus || tag.actionStatus === ActionStatus.Closed) {
            return <div></div>;
        }        

        return (
            <Tooltip 
                title={tag.actionStatus === ActionStatus.OverDue ? 'Overdue action(s)' : 'Open action(s)'} 
                arrow={true} 
                enterDelay={200} 
                enterNextDelay={100}
            >
                <SingleIconContainer>
                    <EdsIcon 
                        name='notifications' 
                        size={24} 
                        color={
                            tag.actionStatus === ActionStatus.OverDue
                                ? tokens.colors.interactive.danger__text.rgba 
                                : tokens.colors.text.static_icons__tertiary.rgba
                        } 
                    />
                </SingleIconContainer>
            </Tooltip>
        );
    }

    getActionsHeader(): JSX.Element {
        return (
            <SingleIconContainer>
                <EdsIcon name='notifications' size={24} color={tokens.colors.text.static_icons__tertiary.rgba} />
            </SingleIconContainer>
        );
    }    

    getTagsByQuery(query: Query<any>): Promise<QueryResult<any>> {
        const sortFieldMap: { [key: string]: string } = {
            'Tag nr': 'TagNo',
            'Description': 'Description',
            'Due': 'Due',
            'Next': 'Due',
            'PO': 'PO',
            'Resp': 'Responsible',
            'Status': 'Status',
            'Area': 'Area',
            'Disc': 'Discipline',
            'Mode': 'Mode'
        };

        if (this.props.shouldSelectFirstPage) {
            // set query to first page = 0
            query.page = 0;
            this.props.setFirstPageSelected();
        }

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
                        { title: 'Tag nr', render: this.getTagNoColumn, cellStyle: { minWidth: '150px', maxWidth: '200px' } },
                        { title: 'Description', render: this.getDescriptionColumn, cellStyle: { minWidth: '500px', maxWidth: '600px' } },
                        // @ts-ignore Width is not a property of material-table
                        { title: 'Next', render: this.getNextColumn, width: '7%' },
                        // @ts-ignore
                        { title: 'Due', render: this.getDueColumn, defaultSort: 'asc', width: '5%' },
                        // @ts-ignore
                        { title: 'Mode', render: this.getMode, width: '8%' },
                        // @ts-ignore
                        { title: 'PO', render: this.getPOColumn, width: '8%' },
                        // @ts-ignore
                        { title: 'Area', render: this.getAreaCode, width: '7%' },
                        // @ts-ignore
                        { title: 'Resp', render: this.getResponsibleColumn, width: '7%', cellStyle: { maxWidth: '150px' } },
                        // @ts-ignore
                        { title: 'Disc', render: this.getDisciplineCode, width: '5%' },
                        // @ts-ignore
                        { title: 'Status', render: this.getStatus, width: '7%', customSort: (): any => null, cellStyle: { whiteSpace: 'nowrap' } },
                        // @ts-ignore
                        { title: 'Req type', render: this.getRequirementColumn, sorting: false, width: '10%' },
                        // @ts-ignore
                        { title: this.getActionsHeader(), render: this.getActionsColumn, sorting: false, width: '2%', cellStyle: { borderLeft: 'solid 1px #dcdcdc' }, headerStyle: { borderLeft: 'solid 1px #dcdcdc' } }
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

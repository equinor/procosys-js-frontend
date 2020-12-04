import { Container, SingleIconContainer, TagLink, TagStatusLabel, Toolbar } from './ScopeTable.style';
import { PreservedTag, PreservedTags } from './types';
import { Query, QueryResult } from 'material-table';
import React, { ReactNode, RefObject } from 'react';
import { getFirstUpcomingRequirement, isTagOverdue, isTagVoided } from './ScopeOverview';
import EdsIcon from '../../../../components/EdsIcon';
import RequirementIcons from './RequirementIcons';
import Table from './../../../../components/Table';
import { Tooltip } from '@material-ui/core';
import { Typography } from '@equinor/eds-core-react';
import { tokens } from '@equinor/eds-tokens';

interface ScopeTableProps {
    getTags: (page: number, pageSize: number, orderBy: string | null, orderDirection: string | null) => Promise<PreservedTags>;
    setSelectedTags: (tags: PreservedTag[]) => void;
    showTagDetails: (tag: PreservedTag) => void;
    setRefreshScopeListCallback: (callback: (maxHeight: number, refreshOnResize?: boolean) => void) => void;
    pageSize: number;
    setPageSize: (pageSize: number) => void;
    shouldSelectFirstPage: boolean;
    setFirstPageSelected: () => void;
    setOrderByField: (orderByField: string | null) => void;
    setOrderDirection: (orderDirection: string | null) => void;
}

enum ActionStatus {
    Closed = 'HasClosed',
    Open = 'HasOpen',
    OverDue = 'HasOverdue'
}

class ScopeTable extends React.Component<ScopeTableProps> {
    refObject: RefObject<any>;
    refreshOnResize: boolean;
    result: PreservedTags | null;

    constructor(props: ScopeTableProps) {
        super(props);
        this.refObject = React.createRef();
        this.getTagsByQuery = this.getTagsByQuery.bind(this);
        this.getTagNoColumn = this.getTagNoColumn.bind(this);
        this.getRequirementColumn = this.getRequirementColumn.bind(this);
        this.refreshOnResize = false;
        this.result = null;
    }

    shouldComponentUpdate(nextProps: ScopeTableProps): boolean {
        return false;
    }

    componentDidMount(): void {
        this.props.setRefreshScopeListCallback((maxHeight: number, refreshOnResize = false) => {
            if (this.refObject.current) {
                this.refObject.current.props.options.maxBodyHeight = maxHeight;
                this.refreshOnResize = refreshOnResize;
                this.refObject.current.onSearchChangeDebounce();
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
                    <div className='controlOverflow'>{tag.description}</div>
                </Tooltip>
                {tag.isNew && <TagStatusLabel>new</TagStatusLabel>}
            </div>
        );
    }

    getResponsibleColumn(tag: PreservedTag): JSX.Element {
        return (
            <Tooltip title={tag.responsibleDescription} arrow={true} enterDelay={200} enterNextDelay={100}>
                <div className='controlOverflow'>{tag.responsibleCode}</div>
            </Tooltip>
        );
    }

    getNextColumn(tag: PreservedTag): JSX.Element {
        const requirement = getFirstUpcomingRequirement(tag);
        return (
            <div className='controlOverflow'>
                {(!requirement || tag.isVoided) ? null : requirement.nextDueAsYearAndWeek}
            </div>);
    }

    getDueColumn(tag: PreservedTag): JSX.Element {
        const requirement = getFirstUpcomingRequirement(tag);
        return (
            <div className='controlOverflow'>
                {(!requirement || tag.isVoided) ? null : requirement.nextDueWeeks}
            </div>);
    }

    getRequirementColumn(tag: PreservedTag): JSX.Element {
        return (
            <div
                style={{ cursor: 'pointer' }}
                onClick={(): void => this.props.showTagDetails(tag)} >
                <RequirementIcons tag={tag} />
            </ div>
        );
    }

    getPOColumn(tag: PreservedTag): JSX.Element {
        return (<Tooltip title={tag.calloffNo ? `${tag.purchaseOrderNo}/${tag.calloffNo}` : tag.purchaseOrderNo ? tag.purchaseOrderNo : ''} arrow={true} enterDelay={200} enterNextDelay={100}>
            <div className='controlOverflow'>
                {tag.calloffNo ? `${tag.purchaseOrderNo}/${tag.calloffNo}` : tag.purchaseOrderNo}
            </div>
        </Tooltip>);
    }

    getMode(tag: PreservedTag): JSX.Element {
        return (
            <div className='controlOverflow'>
                {tag.mode}
            </div>);
    }

    getAreaCode(tag: PreservedTag): JSX.Element {
        return (
            <div className='controlOverflow'>
                {tag.areaCode}
            </div>);
    }

    getDisciplineCode(tag: PreservedTag): JSX.Element {
        return (
            <div className='controlOverflow'>
                {tag.disciplineCode}
            </div>);
    }

    getStatus(tag: PreservedTag): JSX.Element {
        return (
            <div className='controlOverflow'>
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
        this.props.setOrderByField(orderByField);
        this.props.setOrderDirection(orderDirection);

        return new Promise((resolve) => {
            if (this.refreshOnResize && this.result) {
                this.refreshOnResize = false;
                resolve({
                    data: this.result.tags,
                    page: query.page,
                    totalCount: this.result.maxAvailable
                });

            } else {
                return this.props.getTags(query.page, query.pageSize, orderByField, orderDirection).then(result => {
                    this.result = result;
                    resolve({
                        data: result.tags,
                        page: query.page,
                        totalCount: result.maxAvailable
                    });

                });
            }
        });
    }

    render(): ReactNode {
        return (
            <Container>
                <Table
                    tableRef={this.refObject} //reference will be used by parent, to trigger rendering
                    columns={[
                        { title: 'Tag nr', render: this.getTagNoColumn, cellStyle: { minWidth: '100px' } },
                        { title: 'Description', render: this.getDescriptionColumn, cellStyle: { minWidth: '500px', maxWidth: '600px' } },
                        { title: 'Req type', render: this.getRequirementColumn, sorting: false, width: '10%' },
                        { title: 'Due', render: this.getDueColumn, defaultSort: 'asc', width: '5%' },
                        { title: 'Next', render: this.getNextColumn, width: '7%' },
                        { title: 'Mode', render: this.getMode, width: '8%' },
                        { title: 'PO', render: this.getPOColumn, width: '8%' },
                        { title: 'Area', render: this.getAreaCode, width: '7%' },
                        { title: 'Resp', render: this.getResponsibleColumn, width: '7%', cellStyle: { maxWidth: '150px' } },
                        { title: 'Disc', render: this.getDisciplineCode, width: '5%' },
                        { title: 'Status', render: this.getStatus, width: '7%', customSort: (): any => null, cellStyle: { whiteSpace: 'nowrap' } },
                        { title: 'Req type', render: this.getRequirementColumn, sorting: false, width: '10%' },
                        { title: this.getActionsHeader(), render: this.getActionsColumn, sorting: false, width: '2%', cellStyle: { borderLeft: 'solid 1px #dcdcdc' }, headerStyle: { borderLeft: 'solid 1px #dcdcdc' } }
                    ]}
                    data={this.getTagsByQuery}
                    options={{
                        showTitle: false,
                        draggable: false,
                        selection: true,
                        debounceInterval: 200,
                        selectionProps: { disableRipple: true },
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

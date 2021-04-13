import { Button, TextField, Typography } from '@equinor/eds-core-react';
import { ButtonsContainer, Container, Header, InnerContainer, LoadingContainer, OverflowColumn, Search, TableContainer, TagsHeader, TopContainer } from './SelectTags.style';
import { SelectColumnFilter } from '@procosys/components/Table/filters';
import { TableOptions, UseTableRowProps } from 'react-table';
import { Tag, TagRow } from '../types';
import { AddScopeMethod } from '../AddScope';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Loading from '../../../../../components/Loading';
import React, { useEffect } from 'react';
import ProcosysTable from '@procosys/components/Table';
import { useHistory } from 'react-router-dom';
import { usePreservationContext } from '../../../context/PreservationContext';
import { useDirtyContext } from '@procosys/core/DirtyContext';
import { Tooltip } from '@material-ui/core';


const getDescriptionColumn = (row: TableOptions<TagRow>): JSX.Element => {
    const tagRow = row.value as TagRow;
    return (
        <Tooltip title={tagRow.description} arrow={true} enterDelay={200} enterNextDelay={100}>
            <OverflowColumn>{tagRow.description}</OverflowColumn>
        </Tooltip>
    );
};

const getMccrResponsiblesColumn = (row: TableOptions<TagRow>): JSX.Element => {
    const tagRow = row.value as TagRow;
    return (
        <Tooltip title={tagRow.mccrResponsibleCodes} arrow={true} enterDelay={200} enterNextDelay={100}>
            <OverflowColumn>{tagRow.mccrResponsibleCodes}</OverflowColumn>
        </Tooltip>
    );
};

const getPurchaseOrderTitleColumn = (row: TableOptions<TagRow>): JSX.Element => {
    const tagRow = row.value as TagRow;
    return (
        <Tooltip title={tagRow.purchaseOrderTitle} arrow={true} enterDelay={200} enterNextDelay={100}>
            <OverflowColumn>{tagRow.purchaseOrderTitle}</OverflowColumn>
        </Tooltip>
    );
};


const getCommPkgColumn = (row: TableOptions<TagRow>): JSX.Element => {
    const tagRow = row.value as TagRow;
    return (
        <Tooltip title={tagRow.commPkgNo} arrow={true} enterDelay={200} enterNextDelay={100}>
            <OverflowColumn>{tagRow.commPkgNo}</OverflowColumn>
        </Tooltip>
    );
};

const tableColumns = [
    {
        Header: 'Tag no',
        field: 'tagNo',
        accessor: 'tagNo',
        filter: (rows: UseTableRowProps<TagRow>[], id: number, filterType: string): UseTableRowProps<TagRow>[] => {
            return rows.filter((row) => { return row.original.tagNo?.toLowerCase().indexOf(filterType.toLowerCase()) > -1; });
        }
    },
    {
        Header: 'Description',
        field: 'description',
        accessor: (d: UseTableRowProps<TagRow>): UseTableRowProps<TagRow> => d,
        filter: (rows: UseTableRowProps<TagRow>[], id: number, filterType: string): UseTableRowProps<TagRow>[] => {
            return rows.filter((row) => { return row.original.description?.toLowerCase().indexOf(filterType.toLowerCase()) > -1; });
        },
        Cell: getDescriptionColumn
    },
    {
        Header: 'MC pkg',
        field: 'mcPkgNo',
        accessor: 'mcPkgNo',
        filter: (rows: UseTableRowProps<TagRow>[], id: number, filterType: string): UseTableRowProps<TagRow>[] => {
            return rows.filter((row) => { return row.original.mcPkgNo?.toLowerCase().indexOf(filterType.toLowerCase()) > -1; });
        }
    },
    {
        Header: 'MCCR resp',
        field: 'mccrResponsibleCodes',
        accessor: (d: UseTableRowProps<TagRow>): UseTableRowProps<TagRow> => d,
        filter: (rows: UseTableRowProps<TagRow>[], id: number, filterType: string): UseTableRowProps<TagRow>[] => {
            return rows.filter((row) => { return row.original.mccrResponsibleCodes?.toLowerCase().indexOf(filterType.toLowerCase()) > -1; });
        },
        Cell: getMccrResponsiblesColumn
    },
    {
        Header: 'PO',
        field: 'purchaseOrderTitle',
        accessor: (d: UseTableRowProps<TagRow>): UseTableRowProps<TagRow> => d,
        filter: (rows: UseTableRowProps<TagRow>[], id: number, filterType: string): UseTableRowProps<TagRow>[] => {
            return rows.filter((row) => { return row.original.purchaseOrderTitle?.toLowerCase().indexOf(filterType.toLowerCase()) > -1; });
        },
        Cell: getPurchaseOrderTitleColumn
    },
    {
        Header: 'Comm pkg',
        field: 'commPkgNo',
        accessor: (d: UseTableRowProps<TagRow>): UseTableRowProps<TagRow> => d,
        filter: (rows: UseTableRowProps<TagRow>[], id: number, filterType: string): UseTableRowProps<TagRow>[] => {
            return rows.filter((row) => { return row.original.commPkgNo?.toLowerCase().indexOf(filterType.toLowerCase()) > -1; });
        },
        Cell: getCommPkgColumn
    },
    {
        Header: 'Tag function',
        field: 'tagFunctionCode',
        accessor: 'tagFunctionCode',
        filter: (rows: UseTableRowProps<TagRow>[], id: number, filterType: string): UseTableRowProps<TagRow>[] => {
            return rows.filter((row) => { return row.original.tagFunctionCode?.toLowerCase().indexOf(filterType.toLowerCase()) > -1; });
        }
    },
    {
        Header: 'Preserved',
        accessor: (d: TagRow): string | undefined => { return d.isPreserved ? 'Preserved' : 'Not preserved'; },
        field: 'isPreserved',
        Cell: (rowData: TableOptions<TagRow>): JSX.Element => { return rowData.row.values.Preserved === 'Preserved' ? <CheckBoxIcon color='disabled' /> : <></>; },
        Filter: SelectColumnFilter,
        filter: 'equals'
    },
];


type SelectTagsProps = {
    selectedTags: Tag[];
    scopeTableData: TagRow[];
    setSelectedTags: (tags: Tag[]) => void;
    searchTags: (tagNo: string | null) => void;
    nextStep: () => void;
    isLoading: boolean;
    addScopeMethod: AddScopeMethod;
    removeTag: (tagNo: string) => void;
    selectedTableRows: Record<string, boolean>;
    setSelectedTableRows: (ids: Record<string, boolean>) => void;
}

const KEYCODE_ENTER = 13;
const moduleName = 'PreservationAddScopeSelectTags';

const SelectTags = (props: SelectTagsProps): JSX.Element => {
    const { project, purchaseOrderNumber } = usePreservationContext();
    const history = useHistory();
    const { setDirtyStateFor, unsetDirtyStateFor } = useDirtyContext();


    useEffect(() => {
        const selectedRows: Record<string, boolean> = {};

        props.selectedTags.forEach((tag) => {
            const index = props.scopeTableData.indexOf(props.scopeTableData.find(t => t.tagNo === tag.tagNo) as TagRow);
            selectedRows[index] = true;
        });

        props.setSelectedTableRows(selectedRows);

    }, [props.selectedTags]);

    const removeAllSelectedTagsInScope = (): void => {
        const tagNos: string[] = [];
        props.scopeTableData.forEach(l => {
            tagNos.push(l.tagNo);
        });
        const newSelectedTags = props.selectedTags.filter(item => !tagNos.includes(item.tagNo));
        props.setSelectedTags(newSelectedTags);
    };

    const addTagsInScope = (rowData: TagRow[]): void => {
        const allRows = rowData
            .filter(row => !row.isPreserved)
            .map(row => {
                return {
                    tagNo: row.tagNo,
                    description: row.description,
                    mcPkgNo: row.mcPkgNo
                };
            });
        props.setSelectedTags([...allRows]);
    };

    const rowSelectionChanged = (rowData: TagRow[], ids: Record<string, boolean>): void => {
        if (rowData.length == 0 && props.scopeTableData && props.scopeTableData.length > 0) {
            removeAllSelectedTagsInScope();
        } else {
            addTagsInScope(rowData);
        }

        props.setSelectedTableRows(ids);
    };

    /** Update global dirty state */
    useEffect(() => {
        if (props.selectedTags.length > 0) {
            setDirtyStateFor(moduleName);
        } else {
            unsetDirtyStateFor(moduleName);
        }
        return (): void => {
            unsetDirtyStateFor(moduleName);
        };
    }, [props.selectedTags]);

    const cancel = (): void => {
        history.push('/');
    };

    return (
        <Container>
            <Header>
                <Typography variant="h1">Add preservation scope</Typography>
                <div>{project.name}</div>

                {purchaseOrderNumber &&
                    <div style={{ marginLeft: 'calc(var(--grid-unit) * 4)' }}>PO number: {purchaseOrderNumber}</div>
                }
            </Header>
            <TopContainer>
                <InnerContainer>
                    {
                        props.addScopeMethod === AddScopeMethod.AddTagsManually && (
                            <Search>
                                <TextField
                                    id="tagSearch"
                                    placeholder="Search by tag number"
                                    helperText="Type the start of a tag number and press enter to load tags. Note: Minimum two characters are required."
                                    onKeyDown={(e: any): void => {
                                        e.keyCode === KEYCODE_ENTER && e.currentTarget.value.length > 1 && props.searchTags(e.currentTarget.value);
                                    }}
                                    onInput={(e: any): void => {
                                        e.currentTarget.value.length === 0 && props.searchTags(null);
                                    }}
                                />
                            </Search>
                        )
                    }
                    {props.scopeTableData && props.scopeTableData.length > 0 && <TagsHeader>Select the tags that should be added to the preservation scope and click &apos;next&apos;</TagsHeader>}
                </InnerContainer>
                <ButtonsContainer>
                    <Button onClick={cancel} variant='outlined' >Cancel</Button>
                    <Button onClick={props.nextStep} disabled={props.selectedTags.length === 0}>Next</Button>
                </ButtonsContainer>
            </TopContainer>
            {
                props.isLoading &&
                <LoadingContainer>
                    <Loading title="Loading tags" />
                </LoadingContainer>
            }
            {
                !props.isLoading &&
                <TableContainer>
                    <ProcosysTable
                        onSelectedChange={(rowData: TagRow[], ids: any): void => { rowSelectionChanged(rowData, ids); }}
                        pageIndex={0}
                        pageSize={10}
                        columns={tableColumns}
                        maxRowCount={props.scopeTableData.length}
                        data={props.scopeTableData}
                        clientPagination={true}
                        clientSorting={true}
                        loading={false}
                        rowSelect={true}
                        selectedRows={props.selectedTableRows}
                        pageCount={Math.ceil(props.scopeTableData.length / 10)} />
                </TableContainer>
            }
        </Container >
    );
};

export default SelectTags;

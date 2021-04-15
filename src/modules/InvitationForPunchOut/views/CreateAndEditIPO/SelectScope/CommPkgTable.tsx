import { Button, TextField } from '@equinor/eds-core-react';
import { CommPkgRow, McPkgRow } from '@procosys/modules/InvitationForPunchOut/types';
import { CommPkgTableContainer, Container, MCHeader, Search, TopContainer } from './Table.style';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Canceler } from '@procosys/http/HttpClient';
import EdsIcon from '@procosys/components/EdsIcon';
import { Tooltip } from '@material-ui/core';
import { useInvitationForPunchOutContext } from '@procosys/modules/InvitationForPunchOut/context/InvitationForPunchOutContext';
import { TableOptions, UseTableRowProps } from 'react-table';
import ProcosysTable, { DataQuery } from '@procosys/components/Table';

interface CommPkgTableProps {
    selectedCommPkgScope: CommPkgRow[];
    setSelectedCommPkgScope: (selectedCommPkgScope: CommPkgRow[]) => void;
    selectedMcPkgScope: McPkgRow[];
    setCurrentCommPkg: (commPkgNo: string) => void;
    type: string;
    projectName: string;
    filter: string;
    setFilter: (filter: string) => void;
}

const WAIT_INTERVAL = 300;

const CommPkgTable = forwardRef(({
    selectedCommPkgScope,
    selectedMcPkgScope,
    setSelectedCommPkgScope,
    setCurrentCommPkg,
    type,
    projectName,
    filter,
    setFilter
}: CommPkgTableProps, ref): JSX.Element => {
    const { apiClient } = useInvitationForPunchOutContext();
    const [filteredCommPkgs, setFilteredCommPkgs] = useState<CommPkgRow[]>([]);
    const [pageSize, setPageSize] = useState<number>(10);
    const [pageIndex, setPageIndex] = useState<number>(0);
    const cancelerRef = useRef<Canceler | null>();
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [data, setData] = useState<CommPkgRow[]>([]);
    const [maxRows, setMaxRows] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const tableRef = useRef<any>();

    const hasValidSystem = (system: string): boolean => {
        if (selectedCommPkgScope.length == 0 && selectedMcPkgScope.length == 0) return true;

        if (selectedCommPkgScope.length > 0) {
            return selectedCommPkgScope[0].system === system;
        } else {
            return selectedMcPkgScope[0].system === system;
        }
    };

    const getCommPkgs = async (pageSize: number, page: number): Promise<{ maxAvailable: number, commPkgs: CommPkgRow[] }> => {
        try {
            setLoading(true);
            if (!filter) return { maxAvailable: 0, commPkgs: [] };
            const response = await apiClient.getCommPkgsAsync(projectName, filter, pageSize, page, (cancel: Canceler) => cancelerRef.current = cancel);
            const commPkgData = response.commPkgs.map((commPkg): CommPkgRow => {
                return {
                    commPkgNo: commPkg.commPkgNo,
                    description: commPkg.description,
                    system: commPkg.system,
                    status: commPkg.status,
                    tableData: {
                        isSelected: selectedCommPkgScope.some(c => c.commPkgNo == commPkg.commPkgNo)
                    }
                };
            });
            return {
                maxAvailable: response.maxAvailable,
                commPkgs: commPkgData
            };

        } catch (error) {
            console.error(error);
            return {
                maxAvailable: 0,
                commPkgs: []
            };
        } finally {
            setLoading(false);
        }
    };

    const getCommPkgsByQuery = (query: DataQuery): void => {
        if (!filter.trim()) {
            setData([]);
            setMaxRows(0);
        } else {
            getCommPkgs(query.pageSize, query.pageIndex).then(result => {
                setFilteredCommPkgs(result.commPkgs);
                setSelectAll(result.commPkgs.every(commpkg => commpkg.system === result.commPkgs[0].system));
                setData(result.commPkgs);
                setMaxRows(result.maxAvailable);
            });
        }
    };

    useEffect(() => {
        const handleFilterChange = async (): Promise<void> => {
            getCommPkgsByQuery({ pageIndex: pageIndex, pageSize: pageSize, orderField: '', orderDirection: '' });
        };

        const timer = setTimeout(() => {
            handleFilterChange();
        }, WAIT_INTERVAL);

        return (): void => {
            clearTimeout(timer);
            cancelerRef.current && cancelerRef.current();

        };
    }, [filter, pageSize, pageIndex]);

    const removeAllSelectedCommPkgsInScope = (): void => {
        const commPkgNos: string[] = [];
        filteredCommPkgs.forEach(c => {
            commPkgNos.push(c.commPkgNo);
        });
        const newSelectedCommPkgs = selectedCommPkgScope.filter(item => !commPkgNos.includes(item.commPkgNo));
        setSelectedCommPkgScope(newSelectedCommPkgs);
    };

    const addAllCommPkgsInScope = (rowData: CommPkgRow[]): void => {
        if (type != 'DP') {
            const rowsToAdd = rowData.filter(row => hasValidSystem(row.system));
            setSelectedCommPkgScope(rowsToAdd);
        }
    };

    useEffect(() => {
        const _data = [...data];
        _data.forEach((d) => {
            d.disableCheckbox = !hasValidSystem(d.system);
        });
        setFilteredCommPkgs(_data);
    }, [selectedCommPkgScope]);

    const unselectCommPkg = (commPkgNo: string): void => {
        const selectedIndex = selectedCommPkgScope.findIndex(commPkg => commPkg.commPkgNo === commPkgNo);
        const tableDataIndex = filteredCommPkgs.findIndex(commPkg => commPkg.commPkgNo === commPkgNo);
        if (selectedIndex > -1) {
            // remove from selected commPkgs
            const newSelectedCommPkgScope = [...selectedCommPkgScope.slice(0, selectedIndex), ...selectedCommPkgScope.slice(selectedIndex + 1)];
            setSelectedCommPkgScope(newSelectedCommPkgScope);
            tableRef && tableRef.current && tableRef.current.UnselectRow(tableDataIndex);
        }
    };

    useImperativeHandle(ref, () => ({
        removeSelectedCommPkg(commPkgNo: string): void {
            unselectCommPkg(commPkgNo);
        }
    }));


    const rowSelectionChanged = (rowData: CommPkgRow[], row: CommPkgRow): void => {
        if (rowData.length == 0 && filteredCommPkgs.length > 0) {
            removeAllSelectedCommPkgsInScope();
        } else {
            if (rowData.length > 0)
                addAllCommPkgsInScope(rowData);
        }
    };

    const getDescriptionColumn = (row: TableOptions<CommPkgRow>): JSX.Element => {
        const commPkg = row.value as CommPkgRow;
        return (

            <Tooltip title={commPkg.description || ''} arrow={true} enterDelay={200} enterNextDelay={100}>
                <div>{commPkg.description}</div>
            </Tooltip>

        );
    };

    const getMcPkgs = (commPkgNo: string): void => {
        setCurrentCommPkg(commPkgNo);
    };

    const getToMcPkgsColumn = (row: TableOptions<CommPkgRow>): JSX.Element => {
        const commPkg = row.value as CommPkgRow;
        return (
            <div className='tableCell goToMcCol'>
                <Button variant="ghost_icon" disabled={!hasValidSystem(commPkg.system)} onClick={(): void => getMcPkgs(commPkg.commPkgNo)}>
                    <EdsIcon name='chevron_right' />
                </Button>
            </div>
        );
    };

    const getPaddedMCHeader = (): JSX.Element => {
        return <MCHeader>MC</MCHeader>;
    };

    const columns = [
        {
            Header: 'Comm pkg',
            accessor: 'commPkgNo'
        },
        {
            Header: 'Description',
            accessor: (d: UseTableRowProps<CommPkgRow>): UseTableRowProps<CommPkgRow> => d,
            Cell: getDescriptionColumn,
            width: 200,
            maxWidth: 500
        },
        {
            Header: 'Comm status',
            accessor: 'status'
        },
        ...type == 'DP' ? [{ Header: getPaddedMCHeader(), id: 'MC', accessor: (d: UseTableRowProps<CommPkgRow>): UseTableRowProps<CommPkgRow> => d, Cell: getToMcPkgsColumn, defaultCanSort: false, width: 50 }] : []
    ];

    return (
        <Container mcColumn={type == 'DP'}>
            <TopContainer>
                <Search>
                    <TextField
                        id="search"
                        placeholder="Search"
                        helperText="Search for comm pkg no"
                        defaultValue={filter}
                        onKeyUp={(e: any): void => {
                            setFilter(e.currentTarget.value);
                        }}
                    />
                </Search>
            </TopContainer>

            <CommPkgTableContainer>
                <ProcosysTable
                    disableSelectAll={!selectAll}
                    ref={tableRef}
                    setPageSize={setPageSize}
                    pageIndex={pageIndex}
                    pageSize={pageSize}
                    setPageIndex={setPageIndex}
                    rowSelect={type === 'DP' ? false : true}
                    onSelectedChange={(rowData: CommPkgRow[], ids: any): void => { rowSelectionChanged(rowData, ids); }}
                    selectedRows={
                        filteredCommPkgs.filter((x: CommPkgRow) => x.tableData?.isSelected)
                            .map((a: CommPkgRow) => filteredCommPkgs.indexOf(a))
                            .reduce((obj: any, item) => {
                                return { ...obj, [item]: true };
                            }, true)
                    }
                    columns={columns}
                    data={data}
                    clientPagination={false}
                    clientSorting={true}
                    maxRowCount={maxRows}
                    loading={loading}
                />
            </CommPkgTableContainer>

        </Container>
    );
});

export default CommPkgTable;

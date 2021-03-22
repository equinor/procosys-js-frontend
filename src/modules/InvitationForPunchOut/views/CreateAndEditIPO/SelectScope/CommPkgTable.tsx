import { Button, TextField } from '@equinor/eds-core-react';
import { CommPkgRow, McPkgRow } from '@procosys/modules/InvitationForPunchOut/types';
import { Container, Search, TopContainer } from './Table.style';
import { Query, QueryResult } from 'material-table';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

import { Canceler } from '@procosys/http/HttpClient';
import EdsIcon from '@procosys/components/EdsIcon';
import Table from '@procosys/components/Table';
import { Tooltip } from '@material-ui/core';
import { tokens } from '@equinor/eds-tokens';
import { useInvitationForPunchOutContext } from '@procosys/modules/InvitationForPunchOut/context/InvitationForPunchOutContext';

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
    const cancelerRef = useRef<Canceler | null>();
    const refObject = useRef<any>();
    const [selectAll, setSelectAll] = useState<boolean>(false);

    const hasValidSystem = (system: string): boolean => {
        if (selectedCommPkgScope.length == 0 && selectedMcPkgScope.length == 0) return true;

        if (selectedCommPkgScope.length > 0) {
            return selectedCommPkgScope[0].system === system;
        } else {
            return selectedMcPkgScope[0].system === system;
        }
    };

    const getCommPkgs = async (pageSize: number, page: number): Promise<{maxAvailable: number, commPkgs: CommPkgRow[]}> => {
        try {
            const response = await apiClient.getCommPkgsAsync(projectName, filter, pageSize, page, (cancel: Canceler) => cancelerRef.current = cancel);
            const commPkgData = response.commPkgs.map((commPkg): CommPkgRow => {
                return {
                    commPkgNo: commPkg.commPkgNo,
                    description: commPkg.description,
                    system: commPkg.system,
                    status: commPkg.status,
                    tableData: {
                        checked: selectedCommPkgScope.some(c => c.commPkgNo == commPkg.commPkgNo)
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
        }
    };

    const getCommPkgsByQuery = async (query: Query<any>): Promise<QueryResult<any>> => {
        return new Promise((resolve) => {
            if (!filter.trim()) {
                return resolve({
                    data: [],
                    page: 0,
                    totalCount: 0
                });
            }
            return getCommPkgs(query.pageSize, query.page).then(result => {
                setFilteredCommPkgs(result.commPkgs);
                setSelectAll(result.commPkgs.every(commpkg => commpkg.system === result.commPkgs[0].system));
                resolve({
                    data: result.commPkgs,
                    page: query.page,
                    totalCount: result.maxAvailable
                });

            });
        });
    };

    useEffect(() => {
        const handleFilterChange = async (): Promise<void> => {
            if (refObject.current) {
                refObject.current.onSearchChangeDebounce();
            }
        };
        const timer = setTimeout(() => {
            handleFilterChange();
        }, WAIT_INTERVAL);

        return (): void => {
            clearTimeout(timer);
            cancelerRef.current && cancelerRef.current();

        };
    }, [filter]);

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
            setSelectedCommPkgScope([...selectedCommPkgScope, ...rowsToAdd]);
        }
    };

    const unselectCommPkg = (commPkgNo: string): void => {
        const selectedIndex = selectedCommPkgScope.findIndex(commPkg => commPkg.commPkgNo === commPkgNo);
        const tableDataIndex = filteredCommPkgs.findIndex(commPkg => commPkg.commPkgNo === commPkgNo);
        if (selectedIndex > -1) {
            // remove from selected commPkgs
            const newSelectedCommPkgScope = [...selectedCommPkgScope.slice(0, selectedIndex), ...selectedCommPkgScope.slice(selectedIndex + 1)];
            setSelectedCommPkgScope(newSelectedCommPkgScope);

            // remove checked state from table data (needed to reflect change when navigating to "previous" step)
            const copyAvailableCommPkgs = [...filteredCommPkgs];
            if (tableDataIndex > -1) {
                const commPkgToUncheck = copyAvailableCommPkgs[tableDataIndex];
                if (commPkgToUncheck.tableData) {
                    commPkgToUncheck.tableData.checked = false;
                    setFilteredCommPkgs(copyAvailableCommPkgs);
                }
            }
        }
    };

    useImperativeHandle(ref, () => ({
        removeSelectedCommPkg(commPkgNo: string): void {
            unselectCommPkg(commPkgNo);
        }
    }));

    const handleSingleCommPkg = (row: CommPkgRow): void => {
        if (row.tableData && !row.tableData.checked) {
            unselectCommPkg(row.commPkgNo);
        } else {
            setSelectedCommPkgScope([...selectedCommPkgScope, row]);
        }
    };

    const rowSelectionChanged = (rowData: CommPkgRow[], row: CommPkgRow): void => {
        if (rowData.length == 0 && filteredCommPkgs.length > 0) {
            removeAllSelectedCommPkgsInScope();
        } else if (rowData.length > 0 && rowData[0].tableData && !row) {
            addAllCommPkgsInScope(rowData);
        } else if (rowData.length > 0) {
            handleSingleCommPkg(row);
        }
    };

    const getDescriptionColumn = (commPkg: CommPkgRow): JSX.Element => {
        return (
            <div className='tableCell'>
                <Tooltip title={commPkg.description} arrow={true} enterDelay={200} enterNextDelay={100}>
                    <div className='controlOverflow'>{commPkg.description}</div>
                </Tooltip>
            </div>
        );
    };

    const getMcPkgs = (commPkgNo: string): void => {
        setCurrentCommPkg(commPkgNo);
    };

    const getToMcPkgsColumn = (commPkg: CommPkgRow): JSX.Element => {
        return (
            <div className='tableCell goToMcCol'>
                <Button variant="ghost_icon" disabled={!hasValidSystem(commPkg.system)}onClick={(): void => getMcPkgs(commPkg.commPkgNo)}>
                    <EdsIcon name='chevron_right' />
                </Button>
            </div>
        );
    };

    const tableColumns = [
        { title: 'Comm pkg', field: 'commPkgNo' },
        { title: 'Description', render: getDescriptionColumn, cellStyle: { minWidth: '200px', maxWidth: '500px' } },
        { title: 'Comm status', field: 'status' },
        ...type == 'DP' ? [{ title: 'MC', render: getToMcPkgsColumn, sorting: false, width: '50px' }] : []
    ];

    return (
        <Container disableSelectAll={!selectAll} mcColumn={type == 'DP'}>
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
            
            <Table
                tableRef={refObject}
                columns={tableColumns}
                data={getCommPkgsByQuery}
                options={{
                    toolbar: false,
                    showTitle: false,
                    search: false,
                    draggable: false,
                    debounceInterval: 200,
                    pageSize: pageSize,
                    emptyRowsWhenPaging: false,
                    padding: 'dense',
                    headerStyle: {
                        backgroundColor: tokens.colors.interactive.table__header__fill_resting.rgba,
                    },
                    selection: type != 'DP',
                    selectionProps: (data: CommPkgRow): any => ({
                        disabled: !hasValidSystem(data.system),
                        disableRipple: true,
                    }),
                    rowStyle: (data): React.CSSProperties => ({
                        backgroundColor: data.tableData.checked && '#e6faec'
                    })
                }}
                style={{
                    boxShadow: 'none'
                }}
                onSelectionChange={(rowData, row): void => {
                    rowSelectionChanged(rowData, row);
                }}
                onChangeRowsPerPage={setPageSize}
            />
            
        </Container>
    );
});

export default CommPkgTable;

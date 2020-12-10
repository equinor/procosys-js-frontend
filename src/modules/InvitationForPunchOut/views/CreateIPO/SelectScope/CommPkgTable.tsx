import { Button, TextField } from '@equinor/eds-core-react';
import { Container, Search, TopContainer } from './Table.style';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

import { Canceler } from '@procosys/http/HttpClient';
import { CommPkgRow } from '@procosys/modules/InvitationForPunchOut/types';
import EdsIcon from '@procosys/components/EdsIcon';
import Loading from '@procosys/components/Loading';
import Table from '@procosys/components/Table';
import { Tooltip } from '@material-ui/core';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { tokens } from '@equinor/eds-tokens';
import { useInvitationForPunchOutContext } from '@procosys/modules/InvitationForPunchOut/context/InvitationForPunchOutContext';

interface CommPkgTableProps {
    selectedCommPkgScope: CommPkgRow[];
    setSelectedCommPkgScope: (selectedCommPkgScope: CommPkgRow[]) => void;
    setCurrentCommPkg: (commPkgNo: string | null) => void;
    type: string;
    projectName: string;
    filter: string;
    setFilter: (filter: string) => void;
}

const WAIT_INTERVAL = 300;

const CommPkgTable = forwardRef(({
    selectedCommPkgScope,
    setSelectedCommPkgScope,
    setCurrentCommPkg,
    type,
    projectName,
    filter,
    setFilter
}: CommPkgTableProps, ref): JSX.Element => {
    const { apiClient } = useInvitationForPunchOutContext();
    const [filteredCommPkgs, setFilteredCommPkgs] = useState<CommPkgRow[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const searchCommPkgs = (): Canceler | null  => {
        let requestCanceler: Canceler | null = null;
        try {
            (async (): Promise<void> => {
                const filteredCommPkgs = await apiClient.getCommPkgsAsync(projectName, filter, (cancel: Canceler) => requestCanceler = cancel)
                    .then(commPkgs => commPkgs.map((commPkg): CommPkgRow => {
                        return {
                            commPkgNo: commPkg.commPkgNo,
                            description: commPkg.description,
                            status: commPkg.status,
                            tableData: {
                                checked: selectedCommPkgScope.some(c => c.commPkgNo == commPkg.commPkgNo)
                            }
                        };
                    }));
                setFilteredCommPkgs(filteredCommPkgs);
                setIsLoading(false);
            })();
        } catch (error) {
            showSnackbarNotification(error.message);
            setIsLoading(false);
        }
        return (): void => {
            requestCanceler && requestCanceler();
        };
    };

    useEffect(() => {
        if(filter != '') {
            setIsLoading(true);
        } else {
            setIsLoading(false);
            setFilteredCommPkgs([]);
        }
        const handleFilterChange = async (): Promise<void> => {
            if (filter != '') {
                searchCommPkgs();
            }
        };
        const timer = setTimeout(() => {
            handleFilterChange();
        }, WAIT_INTERVAL);

        return (): void => {
            clearTimeout(timer);
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
            const rowsToAdd = rowData.filter(row => !selectedCommPkgScope.some(commPkg => commPkg.commPkgNo === row.commPkgNo));
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
                <Button variant="ghost_icon" onClick={(): void => getMcPkgs(commPkg.commPkgNo)}> 
                    <EdsIcon name='chevron_right'/>
                </Button>
            </div>
        );
    };

    const tableColumns = [
        { title: 'Comm pkg', field: 'commPkgNo' },
        { title: 'Description', render: getDescriptionColumn, cellStyle: { minWidth: '200px', maxWidth: '500px' } },
        { title: 'Comm status', field: 'status' },
        ... type == 'DP' ? [{ title: 'MC', render: getToMcPkgsColumn, sorting: false, width: '50px' }] : []
    ];

    return (     
        <Container disableSelectAll={type == 'DP'} mcColumn={type == 'DP'}>
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
            {
                isLoading && <Loading title="Loading commissioning packages" />
            }
            { !isLoading && filter != '' &&
                <Table
                    columns={tableColumns}
                    data={filteredCommPkgs}
                    options={{
                        toolbar: false,
                        showTitle: false,
                        search: false,
                        draggable: false,
                        pageSize: 10,
                        emptyRowsWhenPaging: false,
                        pageSizeOptions: [10, 50, 100],
                        padding: 'dense',
                        headerStyle: {
                            backgroundColor: tokens.colors.interactive.table__header__fill_resting.rgba,
                        },
                        selection: type != 'DP',
                        selectionProps: (data: CommPkgRow): any => ({
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
                />
            }
        </Container>
    );
});

export default CommPkgTable;

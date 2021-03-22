import { Container, Search, TopContainer } from './Table.style';
import { McPkgRow, McScope } from '@procosys/modules/InvitationForPunchOut/types';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

import { Canceler } from '@procosys/http/HttpClient';
import Loading from '@procosys/components/Loading';
import Table from '@procosys/components/Table';
import { TextField } from '@equinor/eds-core-react';
import { Tooltip } from '@material-ui/core';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { tokens } from '@equinor/eds-tokens';
import { useInvitationForPunchOutContext } from '@procosys/modules/InvitationForPunchOut/context/InvitationForPunchOutContext';

interface McPkgTableProps {
    selectedMcPkgScope: McScope;
    setSelectedMcPkgScope: (selectedCommPkgScope: McScope) => void;
    projectName: string;
    commPkgNo: string;
}

const KEYCODE_ENTER = 13;

export const multipleDisciplines = (selected: McPkgRow[]): boolean => {
    if(selected.length > 0) {
        const initialDiscipline = selected[0].discipline;
        if(selected.some(mc => mc.discipline !== initialDiscipline)) {
            return true;
        }
    }
    return false;
};

const McPkgTable = forwardRef(({
    selectedMcPkgScope,
    setSelectedMcPkgScope,
    projectName,
    commPkgNo
}: McPkgTableProps, ref): JSX.Element => {
    const { apiClient } = useInvitationForPunchOutContext();
    const [availableMcPkgs, setAvailableMcPkgs] = useState<McPkgRow[]>([]);
    const [filteredMcPkgs, setFilteredMcPkgs] = useState<McPkgRow[]>([]);
    const [filter, setFilter] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        try {
            let requestCanceler: Canceler;
            (async (): Promise<void> => {
                const availableMcPkgs = await apiClient.getMcPkgsAsync(projectName, commPkgNo)
                    .then(mcPkgs => mcPkgs.map((mcPkg): McPkgRow => {
                        return {
                            mcPkgNo: mcPkg.mcPkgNo,
                            description: mcPkg.description,
                            discipline: mcPkg.disciplineCode,
                            system: mcPkg.system,
                            tableData: {
                                checked: selectedMcPkgScope.selected.some(mc => mc.mcPkgNo == mcPkg.mcPkgNo)
                            }
                        };
                    }));
                setAvailableMcPkgs(availableMcPkgs);
                setFilteredMcPkgs(availableMcPkgs);
                setIsLoading(false);
            })();
            return (): void => requestCanceler && requestCanceler();
        } catch (error) {
            showSnackbarNotification(error.message);
        }
    }, []);

    useEffect(() => {
        if (filter.length <= 0) {
            setFilteredMcPkgs(availableMcPkgs);
            return;
        }
        setFilteredMcPkgs(availableMcPkgs.filter((mc: McPkgRow) => {
            return mc.mcPkgNo.toLowerCase().indexOf(filter.toLowerCase()) > -1;
        }));
    }, [filter]);


    const unselectMcPkg = (mcPkgNo: string): void => {
        const selectedIndex = selectedMcPkgScope.selected.findIndex(mcPkg => mcPkg.mcPkgNo === mcPkgNo);
        const tableDataIndex = availableMcPkgs.findIndex(mcPkg => mcPkg.mcPkgNo === mcPkgNo);
        if (selectedIndex > -1) {
            // remove from selected mcPkgs
            const newSelected = [...selectedMcPkgScope.selected.slice(0, selectedIndex), ...selectedMcPkgScope.selected.slice(selectedIndex + 1)];
            const newSelectedMcPkgScope = {commPkgNoParent: newSelected.length > 0 ? selectedMcPkgScope.commPkgNoParent : null, multipleDisciplines: multipleDisciplines(newSelected), selected: newSelected};
            setSelectedMcPkgScope(newSelectedMcPkgScope);

            // remove checked state from table data (needed to reflect change when navigating to "previous" step)
            const copyAvailableMcPkgs = [...availableMcPkgs];
            if (tableDataIndex > -1) {
                const mckgToUncheck = copyAvailableMcPkgs[tableDataIndex];
                if (mckgToUncheck.tableData) {
                    mckgToUncheck.tableData.checked = false;
                    setAvailableMcPkgs(copyAvailableMcPkgs);
                }
            }
        }
    };

    useImperativeHandle(ref, () => ({
        removeSelectedMcPkg(mcPkgNo: string): void {
            unselectMcPkg(mcPkgNo);
        }
    }));

    const handleSingleMcPkg = (row: McPkgRow): void => {
        if (row.tableData && !row.tableData.checked) {
            unselectMcPkg(row.mcPkgNo);
        } else {
            const newSelected = [...selectedMcPkgScope.selected, row];
            setSelectedMcPkgScope({commPkgNoParent: commPkgNo, multipleDisciplines: multipleDisciplines(newSelected), selected: newSelected});
        }
    };

    const addAllMcPkgsInScope = (rowData: McPkgRow[]): void => {
        const rowsToAdd = rowData.filter(row => !selectedMcPkgScope.selected.some(mcPkg => mcPkg.mcPkgNo === row.mcPkgNo));
        const newSelected = [...selectedMcPkgScope.selected, ...rowsToAdd];
        setSelectedMcPkgScope({commPkgNoParent: commPkgNo, multipleDisciplines: multipleDisciplines(newSelected), selected: newSelected});
    };

    const removeAllSelectedMcPkgsInScope = (): void => {
        const mcPkgNos: string[] = [];
        availableMcPkgs.forEach(m => {
            mcPkgNos.push(m.mcPkgNo);
        });
        const newSelectedMcPkgs = selectedMcPkgScope.selected.filter(item => !mcPkgNos.includes(item.mcPkgNo));
        setSelectedMcPkgScope({commPkgNoParent: null, multipleDisciplines: false, selected: newSelectedMcPkgs});
    };

    const rowSelectionChangedMc = (rowData: McPkgRow[], row: McPkgRow): void => {
        if (rowData.length == 0 && availableMcPkgs.length > 0) {
            removeAllSelectedMcPkgsInScope();
        } else if (rowData.length > 0 && rowData[0].tableData && !row) {
            addAllMcPkgsInScope(rowData);
        } else if (rowData.length > 0) {
            handleSingleMcPkg(row);
        }
    };

    const getDescriptionColumn = (mcPkg: McPkgRow): JSX.Element => {
        return (
            <div className='tableCell'>
                <Tooltip title={mcPkg.description} arrow={true} enterDelay={200} enterNextDelay={100}>
                    <div className='controlOverflow'>{mcPkg.description}</div>
                </Tooltip>
            </div>
        );
    };

    const mcTableColumns = [
        { title: 'Mc pkg', field: 'mcPkgNo' },
        { title: 'Description', render: getDescriptionColumn, cellStyle: { minWidth: '200px', maxWidth: '500px' } }
    ];

    return ( 
        <Container>
            <TopContainer>
                <Search>
                    <TextField
                        id="search"
                        placeholder="Search"
                        helperText="Search for mc pkg no."
                        defaultValue=''
                        onKeyDown={(e: any): void => {
                            e.keyCode === KEYCODE_ENTER && setFilter(e.currentTarget.value);
                        }}
                        onInput={(e: any): void => {
                            setFilter(e.currentTarget.value);
                        }}
                    />
                </Search>
            </TopContainer>
            {
                isLoading && <Loading title="Loading MC packages" />
            }
            { !isLoading &&
                <Table
                    columns={mcTableColumns}
                    data={filteredMcPkgs}
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
                        selection: true,
                        rowStyle: (data): React.CSSProperties => ({
                            backgroundColor: data.tableData.checked && '#e6faec'
                        })
                    }}
                    style={{
                        boxShadow: 'none'
                    }}
                    onSelectionChange={(rowData, row): void => {
                        rowSelectionChangedMc(rowData, row);
                    }}
                />
            }
        </Container>
    );
});

export default McPkgTable;

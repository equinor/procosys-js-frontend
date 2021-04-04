import { Container, Search, TopContainer } from './Table.style';
import { McPkgRow, McScope } from '@procosys/modules/InvitationForPunchOut/types';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

import { Canceler } from '@procosys/http/HttpClient';
import Loading from '@procosys/components/Loading';
import { TextField } from '@equinor/eds-core-react';
import { Tooltip } from '@material-ui/core';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { useInvitationForPunchOutContext } from '@procosys/modules/InvitationForPunchOut/context/InvitationForPunchOutContext';
import { TableOptions, UseTableRowProps } from 'react-table';
import ProcosysTable from '@procosys/components/Table/ProcosysTable';

interface McPkgTableProps {
    selectedMcPkgScope: McScope;
    setSelectedMcPkgScope: (selectedCommPkgScope: McScope) => void;
    projectName: string;
    commPkgNo: string;
}

const KEYCODE_ENTER = 13;

export const multipleDisciplines = (selected: McPkgRow[]): boolean => {
    if (selected.length > 0) {
        const initialDiscipline = selected[0].discipline;
        if (selected.some(mc => mc.discipline !== initialDiscipline)) {
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
    const tableRef = useRef<any>();

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
                                isSelected: selectedMcPkgScope.selected.some(mc => mc.mcPkgNo == mcPkg.mcPkgNo)
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
            const newSelectedMcPkgScope = { commPkgNoParent: newSelected.length > 0 ? selectedMcPkgScope.commPkgNoParent : null, multipleDisciplines: multipleDisciplines(newSelected), selected: newSelected };
            setSelectedMcPkgScope(newSelectedMcPkgScope);

            tableRef && tableRef.current && tableRef.current.UnselectRow(tableDataIndex);
        }
    };

    useImperativeHandle(ref, () => ({
        removeSelectedMcPkg(mcPkgNo: string): void {
            unselectMcPkg(mcPkgNo);
        }
    }));


    const addAllMcPkgsInScope = (rowData: McPkgRow[]): void => {
        setSelectedMcPkgScope({ commPkgNoParent: commPkgNo, multipleDisciplines: multipleDisciplines(rowData), selected: rowData });
    };

    const removeAllSelectedMcPkgsInScope = (): void => {
        const mcPkgNos: string[] = [];
        availableMcPkgs.forEach(m => {
            mcPkgNos.push(m.mcPkgNo);
        });
        const newSelectedMcPkgs = selectedMcPkgScope.selected.filter(item => !mcPkgNos.includes(item.mcPkgNo));
        setSelectedMcPkgScope({ commPkgNoParent: null, multipleDisciplines: false, selected: newSelectedMcPkgs });
    };


    const rowSelectionChangedMc = (rowData: McPkgRow[], ids: Record<string, boolean>): void => {
        if (rowData.length == 0 && availableMcPkgs.length > 0) {
            removeAllSelectedMcPkgsInScope();
        } else {
            addAllMcPkgsInScope(rowData);
        }
    };

    const getDescriptionColumn = (row: TableOptions<McPkgRow>): JSX.Element => {
        const mcPkg = row.value as McPkgRow;
        return (
            <div className='tableCell'>
                <Tooltip title={mcPkg.description} arrow={true} enterDelay={200} enterNextDelay={100}>
                    <div className='controlOverflow'>{mcPkg.description}</div>
                </Tooltip>
            </div>
        );
    };

    const columns = [
        {
            Header: 'Mc pkg',
            accessor: 'mcPkgNo'
        },
        {
            Header: 'Description',
            accessor: (d: UseTableRowProps<McPkgRow>): UseTableRowProps<McPkgRow> => d,
            Cell: getDescriptionColumn,
            width: 200,
            maxWidth: 500
        },
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

                <ProcosysTable
                    ref={tableRef}
                    columns={columns}
                    data={filteredMcPkgs}
                    clientPagination={true}
                    clientSorting={true}
                    maxRowCount={filteredMcPkgs.length}
                    pageIndex={0}
                    rowSelect={true}
                    onSelectedChange={(rowData: McPkgRow[], ids: any): void => { rowSelectionChangedMc(rowData, ids); }}
                    selectedRows={
                        filteredMcPkgs.filter((x: McPkgRow) => x.tableData?.isSelected)
                            .map((a: McPkgRow) => filteredMcPkgs.indexOf(a))
                            .reduce((obj: any, item) => {
                                return { ...obj, [item]: true };
                            }, true)
                    }
                    pageSize={10}
                />
            }
        </Container>
    );
});

export default McPkgTable;

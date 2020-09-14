import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import {Container} from './Table.style';
import Table from '@procosys/components/Table';
import { tokens } from '@equinor/eds-tokens';
import { Canceler } from '@procosys/http/HttpClient';
import {  McPkgRow, McScope } from '@procosys/modules/CallForPunchOut/types';
import { Tooltip } from '@material-ui/core';


interface McPkgTableProps {
    selectedMcPkgScope: McScope;
    setSelectedMcPkgScope: (selectedCommPkgScope: McScope) => void;
    enabled: boolean;
    filter: string;
}

const today = new Date();
const date = today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate();


const dummyDataMc: McPkgRow[] = [
    {
        mcPkgNo: 'Mc pkg 1',
        description: 'Description 1',
        m01: date,
        m02: date,
        discipline: 'E'
    },
    {
        mcPkgNo: 'Mc pkg 2',
        description: 'Very long description of a commpkg that is to be selected. Description should be displayed in accordion in selected scope component.Very long description of a commpkg that is to be selected. Description should be displayed in accordion in selected scope component.',
        m01: date,
        m02: date,
        discipline: 'J'
    },
    {
        mcPkgNo: 'Mc pkg 3',
        description: 'Description 3',
        m01: date,
        m02: date,
        discipline: 'T'
    }
];

const McPkgTable = forwardRef(({
    selectedMcPkgScope,
    setSelectedMcPkgScope,
    enabled,
    filter
}: McPkgTableProps, ref): JSX.Element => {
    const [availableMcPkgs, setAvailableMcPkgs] = useState<McPkgRow[]>([]);
    const [filteredMcPkgs, setFilteredMcPkgs] = useState<McPkgRow[]>([]);

    useEffect(() => {
        let requestCanceler: Canceler;
        (async (): Promise<void> => {
            const allMcPkgs = dummyDataMc; //TODO: API call for mcpkgs
            setAvailableMcPkgs(allMcPkgs);
            setFilteredMcPkgs(allMcPkgs);
        })();
        return (): void => requestCanceler && requestCanceler();
    },[]);

    useEffect(() => {
        if (filter.length <= 0) {
            setFilteredMcPkgs(dummyDataMc);
            return;
        }
        setFilteredMcPkgs(availableMcPkgs.filter((mc: McPkgRow) => {
            return mc.mcPkgNo.toLowerCase().indexOf(filter.toLowerCase()) > -1;
        }));
    }, [filter]);

    const multipleDisciplines = (selected: McPkgRow[]): boolean => {
        if(selected.length > 0) {
            const initialDiscipline = selected[0].discipline;
            if(selected.some(mc => mc.discipline !== initialDiscipline)) {
                return true;
            }
        }
        return false;
    };

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
            setSelectedMcPkgScope({commPkgNoParent: selectedMcPkgScope.commPkgNoParent, multipleDisciplines: multipleDisciplines(newSelected), selected: newSelected});
        }
    };

    const addAllMcPkgsInScope = (rowData: McPkgRow[]): void => {
        const rowsToAdd = rowData.filter(row => !selectedMcPkgScope.selected.some(mcPkg => mcPkg.mcPkgNo === row.mcPkgNo));
        const newSelected = [...selectedMcPkgScope.selected, ...rowsToAdd];
        setSelectedMcPkgScope({commPkgNoParent: selectedMcPkgScope.commPkgNoParent, multipleDisciplines: multipleDisciplines(newSelected), selected: newSelected});
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
            <div style={{ display: 'flex', alignItems: 'center', color: 'inherit' }}>
                <Tooltip title={mcPkg.description} arrow={true} enterDelay={200} enterNextDelay={100}>
                    <div className='controlOverflow'>{mcPkg.description}</div>
                </Tooltip>
            </div>
        );
    };

    const mcTableColumns = [
        { title: 'Mc pkg', field: 'mcPkgNo' },
        { title: 'Description', render: getDescriptionColumn, cellStyle: { minWidth: '200px', maxWidth: '500px' } },
        { title: 'M-01 date', field: 'm01' },
        { title: 'M-02 date', field: 'm01' }
    ];

    return ( 
        <Container disableSelectAll={!enabled}>
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
                    selectionProps: (): any => ({
                        disabled: !enabled,
                        disableRipple: true,
                    }),
                    rowStyle: (data): any => ({
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
        </Container>
    );
});

export default McPkgTable;

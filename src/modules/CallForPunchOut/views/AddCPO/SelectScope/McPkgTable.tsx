import React, { useEffect, useState } from 'react';
import { Button, TextField, Typography } from '@equinor/eds-core-react';
import {Container} from './Table.style';

import Table from '@procosys/components/Table';
import { tokens } from '@equinor/eds-tokens';
import { Canceler } from '@procosys/http/HttpClient';
import { CommPkgRow, McPkgRow } from '@procosys/modules/CallForPunchOut/types';
import SelectedScope from './SelectedScope';
import { Tooltip } from '@material-ui/core';
import EdsIcon from '@procosys/components/EdsIcon';


interface McPkgTableProps {
    selectedMcPkgScope: McPkgRow[];
    setSelectedMcPkgScope: (selectedCommPkgScope: McPkgRow[]) => void;
    selectedMcScopeParent: string | null;
    setSelectedMcScopeParent: (commPkg: string | null) => void;
    currentCommPkg: string | null;
    enabled: boolean;
}

const KEYCODE_ENTER = 13;

const today = new Date();
const date = today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate();


const dummyDataMc: McPkgRow[] = [
    {
        mcPkgNo: 'Mc pkg 1',
        description: 'Description 1',
        m01: date,
        m02: date
    },
    {
        mcPkgNo: 'Mc pkg 3',
        description: 'Very long description of a commpkg that is to be selected. Description should be displayed in accordion in selected scope component.Very long description of a commpkg that is to be selected. Description should be displayed in accordion in selected scope component.',
        m01: date,
        m02: date
    },
    {
        mcPkgNo: 'Mc pkg 3',
        description: 'Description 3',
        m01: date,
        m02: date
    }
];

const McPkgTable = ({
    selectedMcPkgScope,
    setSelectedMcPkgScope,
    selectedMcScopeParent,
    setSelectedMcScopeParent,
    currentCommPkg,
    enabled
}: McPkgTableProps): JSX.Element => {
    const [availableCommPkgs, setAvailableCommPkgs] = useState<CommPkgRow[]>([]);
    const [filteredCommPkgs, setFilteredCommPkgs] = useState<CommPkgRow[]>([]);
    const [availableMcPkgs, setAvailableMcPkgs] = useState<McPkgRow[]>([]);
    const [filteredMckgs, setFilteredMcPkgs] = useState<McPkgRow[]>(dummyDataMc);
    const [filter, setFilter] = useState<string>('');

    // let requestCanceler: Canceler;
    // useEffect(() => {
    //     (async (): Promise<void> => {
    //         const allCommPkgs = dummyData; //TODO: API call for commpkgs
    //         setAvailableCommPkgs(allCommPkgs);
    //         setFilteredCommPkgs(allCommPkgs);
    //     })();
    //     return (): void => requestCanceler && requestCanceler();
    // },[]);

    // useEffect(() => {
    //     if (filter.length <= 0) {
    //         setFilteredCommPkgs(dummyData);
    //         return;
    //     }
    //     setFilteredCommPkgs(availableCommPkgs.filter((c: CommPkgRow) => {
    //         return c.commPkgNo.toLowerCase().indexOf(filter.toLowerCase()) > -1;
    //     }));
    // }, [filter]);


    const removeSelectedMcPkg = (mcPkgNo: string): void => {
        const selectedIndex = selectedMcPkgScope.findIndex(mcPkg => mcPkg.mcPkgNo === mcPkgNo);
        const tableDataIndex = availableMcPkgs.findIndex(mcPkg => mcPkg.mcPkgNo === mcPkgNo);
        if (selectedIndex > -1) {
            // remove from selected mcPkgs
            const copy = [...selectedMcPkgScope.slice(0, selectedIndex), ...selectedMcPkgScope.slice(selectedIndex + 1)];
            setSelectedMcPkgScope(copy);

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


    const handleSingleMcPkg = (row: McPkgRow): void => {
        if (row.tableData && !row.tableData.checked) {
            removeSelectedMcPkg(row.mcPkgNo);
        } else {
            setSelectedMcPkgScope([...selectedMcPkgScope, row]);
        }
    };

    const addAllMcPkgsInScope = (rowData: McPkgRow[]): void => {
        const rowsToAdd = rowData.filter(row => !selectedMcPkgScope.some(mcPkg => mcPkg.mcPkgNo === row.mcPkgNo));
        setSelectedMcPkgScope([...selectedMcPkgScope, ...rowsToAdd]);
    };

    const removeAllSelectedMcPkgsInScope = (): void => {
        const mcPkgNos: string[] = [];
        availableMcPkgs.forEach(m => {
            mcPkgNos.push(m.mcPkgNo);
        });
        const newSelectedMcPkgs = selectedMcPkgScope.filter(item => !mcPkgNos.includes(item.mcPkgNo));
        setSelectedMcPkgScope(newSelectedMcPkgs);
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
        { title: 'Description', render: getDescriptionColumn, cellStyle: { minWidth: '500px', maxWidth: '800px' } },
        { title: 'M-01 date', field: 'm01' },
        { title: 'M-02 date', field: 'm01' }
    ];

    return ( 
        <Container disableSelectAll={!enabled}>
            <Table
                columns={mcTableColumns}
                data={filteredMckgs}
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
};

export default McPkgTable;

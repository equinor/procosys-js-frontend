import React, { useEffect, useState } from 'react';
import { Button, TextField, Typography } from '@equinor/eds-core-react';
import { Container, Header, Search, ButtonsContainer, TopContainer, SelectComponent, Divider } from './SelectScope.style';
import Table from '@procosys/components/Table';
import { tokens } from '@equinor/eds-tokens';
import { Canceler } from '@procosys/http/HttpClient';
import { CommPkgRow } from '@procosys/modules/CallForPunchOut/types';
import SelectedScope from './SelectedScope';
import { Tooltip } from '@material-ui/core';


interface SelectScopeProps {
    selectedScope: CommPkgRow[];
    setSelectedScope: (selectedScope: CommPkgRow[]) => void;
    next: () => void;
    previous: () => void;
    isValid: boolean;
}

const KEYCODE_ENTER = 13;

const today = new Date();
const date = today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate();

const dummyData: CommPkgRow[] = [
    {
        commPkgNo: 'Comm pkg 1',
        description: 'Description 1',
        commPkgStatus: 'PB',
        mdpAccepted: date
    },
    {
        commPkgNo: 'Comm pkg 2',
        description: 'Very long description of a commpkg that is to be selected. Description should be displayed in accordion in selected scope component.Very long description of a commpkg that is to be selected. Description should be displayed in accordion in selected scope component.',
        commPkgStatus: 'OK',
        mdpAccepted: date
    },
    {
        commPkgNo: 'test',
        description: 'Description 3',
        commPkgStatus: 'PA',
        mdpAccepted: date
    }
];

const SelectScope = ({
    selectedScope,
    setSelectedScope,
    next,
    previous,
    isValid
}: SelectScopeProps): JSX.Element => {
    const [availableCommPkgs, setAvailableCommPkgs] = useState<CommPkgRow[]>([]);
    const [filteredCommPkgs, setFilteredCommPkgs] = useState<CommPkgRow[]>([]);
    const [filter, setFilter] = useState<string>('');

    let requestCanceler: Canceler;
    useEffect(() => {
        (async (): Promise<void> => {
            const allCommPkgs = dummyData; //TODO: API call for commpkgs
            setAvailableCommPkgs(allCommPkgs);
            setFilteredCommPkgs(allCommPkgs);
        })();
        return (): void => requestCanceler && requestCanceler();
    },[]);

    useEffect(() => {
        if (filter.length <= 0) {
            setFilteredCommPkgs(dummyData);
            return;
        }
        setFilteredCommPkgs(availableCommPkgs.filter((c: CommPkgRow) => {
            return c.commPkgNo.toLowerCase().indexOf(filter.toLowerCase()) > -1;
        }));
    }, [filter]);

    const removeAllSelectedCommPkgsInScope = (): void => {
        const commPkgNos: string[] = [];
        availableCommPkgs.forEach(c => {
            commPkgNos.push(c.commPkgNo);
        });
        const newSelectedCommPkgs = selectedScope.filter(item => !commPkgNos.includes(item.commPkgNo));
        setSelectedScope(newSelectedCommPkgs);
    };

    const addAllCommPkgsInScope = (rowData: CommPkgRow[]): void => {
        const rowsToAdd = rowData.filter(row => !selectedScope.some(commPkg => commPkg.commPkgNo === row.commPkgNo));
        setSelectedScope([...selectedScope, ...rowsToAdd]);
    };

    const removeSelectedCommPkg = (commPkgNo: string): void => {
        const selectedIndex = selectedScope.findIndex(commPkg => commPkg.commPkgNo === commPkgNo);
        const tableDataIndex = availableCommPkgs.findIndex(commPkg => commPkg.commPkgNo === commPkgNo);
        if (selectedIndex > -1) {
            // remove from selected commPkgs
            const copy = [...selectedScope.slice(0, selectedIndex), ...selectedScope.slice(selectedIndex + 1)];
            setSelectedScope(copy);

            // remove checked state from table data (needed to reflect change when navigating to "previous" step)
            const copyAvailableCommPkgs = [...availableCommPkgs];
            if (tableDataIndex > -1) {
                const commPkgToUncheck = copyAvailableCommPkgs[tableDataIndex];
                if (commPkgToUncheck.tableData) {
                    commPkgToUncheck.tableData.checked = false;
                    setAvailableCommPkgs(copyAvailableCommPkgs);
                }
            }
        }
    };

    const handleSingleCommPkg = (row: CommPkgRow): void => {
        if (row.tableData && !row.tableData.checked) {
            removeSelectedCommPkg(row.commPkgNo);
        } else {
            setSelectedScope([...selectedScope, row]);
        }
    };

    const rowSelectionChanged = (rowData: CommPkgRow[], row: CommPkgRow): void => {
        if (rowData.length == 0 && availableCommPkgs.length > 0) {
            removeAllSelectedCommPkgsInScope();
        } else if (rowData.length > 0 && rowData[0].tableData && !row) {
            addAllCommPkgsInScope(rowData);
        } else if (rowData.length > 0) {
            handleSingleCommPkg(row);
        }
    };


    const getDescriptionColumn = (commPkg: CommPkgRow): JSX.Element => {
        return (
            <div style={{ display: 'flex', alignItems: 'center', color: 'inherit' }}>
                <Tooltip title={commPkg.description} arrow={true} enterDelay={200} enterNextDelay={100}>
                    <div className='controlOverflow'>{commPkg.description}</div>
                </Tooltip>
            </div>
        );
    };

    const tableColumns = [
        { title: 'Comm pkg', field: 'commPkgNo' },
        { title: 'Description', render: getDescriptionColumn, cellStyle: { minWidth: '500px', maxWidth: '800px' } },
        { title: 'Comm status', field: 'commPkgStatus' },
        { title: 'MDP accepted', field: 'mdpAccepted' }
    ];

    return (     
        <Container>
            <SelectComponent>
                <Header>
                    <Typography variant='h2'>Select commissioning packages</Typography>
                    <ButtonsContainer>
                        <Button 
                            variant='outlined'
                            onClick={previous}
                        >
                            Previous
                        </Button>
                        <Button
                            disabled={!isValid}
                            onClick={next}
                        >
                            Next
                        </Button>
                    </ButtonsContainer>
                </Header>
                <TopContainer>
                    <Search>
                        <TextField
                            id="search"
                            placeholder="Search comm pkg no"
                            onKeyDown={(e: any): void => {
                                e.keyCode === KEYCODE_ENTER && setFilter(e.currentTarget.value); //TODO: do we need to make a new API call every time we change filter?
                            }}
                            onInput={(e: any): void => {
                                setFilter(e.currentTarget.value);
                            }}
                        />
                    </Search>
                </TopContainer>
                {
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
                            selection: true,
                            selectionProps: (): any => ({
                                disableRipple: true
                            }),
                            rowStyle: (data): any => ({
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
            </SelectComponent>
            <Divider />
            <SelectedScope selectedCommPkgs={selectedScope} removeCommPkg={removeSelectedCommPkg} />
        </Container>
    );
};

export default SelectScope;

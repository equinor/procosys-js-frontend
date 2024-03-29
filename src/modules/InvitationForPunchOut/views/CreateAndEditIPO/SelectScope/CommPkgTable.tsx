import { Button, TextField } from '@equinor/eds-core-react';
import {
    CommPkgRow,
    McPkgRow,
} from '@procosys/modules/InvitationForPunchOut/types';
import {
    CommPkgTableContainer,
    Container,
    MCHeader,
    Search,
    TopContainer,
} from './Table.style';
import ProcosysTable, { DataQuery } from '@procosys/components/Table';
import React, {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';
import { TableOptions, UseTableRowProps } from 'react-table';

import { Canceler } from '@procosys/http/HttpClient';
import EdsIcon from '@procosys/components/EdsIcon';
import { useInvitationForPunchOutContext } from '@procosys/modules/InvitationForPunchOut/context/InvitationForPunchOutContext';
import { Tooltip } from '@mui/material';
import { getFormattedDate } from '@procosys/core/services/DateService';

interface CommPkgTableProps {
    selectedCommPkgScope: CommPkgRow[];
    setSelectedCommPkgScope: React.Dispatch<React.SetStateAction<CommPkgRow[]>>;
    selectedMcPkgScope: McPkgRow[];
    setCurrentCommPkg: (commPkgNo: string) => void;
    type: string;
    projectName: string;
    filter: string;
    setFilter: (filter: string) => void;
    commPkgNo: string | null;
}

const WAIT_INTERVAL = 300;

const getSection = (sysString: string): string => {
    return sysString.indexOf('|') !== -1
        ? sysString.substr(0, sysString.indexOf('|'))
        : sysString;
};

// Does it have a section? If not, return true. If yes, test if section is the same
const hasSameSection = (sysString1: string, sysString2: string): boolean => {
    // Count number of "pipes". If two, check if section is the same. If one, return true
    if (
        sysString1.split('|').length - 1 == 2 ||
        sysString2.split('|').length - 1 == 2
    ) {
        return getSection(sysString1) === getSection(sysString2);
    } else return true;
};

const CommPkgTable = forwardRef(
    (
        {
            selectedCommPkgScope,
            selectedMcPkgScope,
            setSelectedCommPkgScope,
            setCurrentCommPkg,
            type,
            projectName,
            filter,
            setFilter,
            commPkgNo,
        }: CommPkgTableProps,
        ref
    ): JSX.Element => {
        const { apiClient } = useInvitationForPunchOutContext();
        const [filteredCommPkgs, setFilteredCommPkgs] = useState<CommPkgRow[]>(
            []
        );
        const [pageSize, setPageSize] = useState<number>(10);
        const [pageIndex, setPageIndex] = useState<number>(0);
        const cancelerRef = useRef<Canceler | null>();
        const [selectAll, setSelectAll] = useState<boolean>(false);
        const [data, setData] = useState<CommPkgRow[]>([]);
        const [maxRows, setMaxRows] = useState<number>(0);
        const [loading, setLoading] = useState<boolean>(false);
        const tableRef = useRef<any>();

        const hasValidSection = useCallback(
            (systemString: string): boolean => {
                if (
                    selectedCommPkgScope.length === 0 &&
                    selectedMcPkgScope.length === 0
                )
                    return true;

                const currentSystemString =
                    selectedCommPkgScope.length > 0
                        ? selectedCommPkgScope[0].system
                        : selectedMcPkgScope[0].system;

                return hasSameSection(systemString, currentSystemString);
            },
            [selectedCommPkgScope]
        );

        const getCommPkgsByFilter = async (
            pageSize: number,
            page: number
        ): Promise<{ maxAvailable: number; commPkgs: CommPkgRow[] }> => {
            try {
                setLoading(true);
                if (!filter) return { maxAvailable: 0, commPkgs: [] };
                const response = await apiClient.getCommPkgsAsync(
                    projectName,
                    filter,
                    pageSize,
                    page,
                    (cancel: Canceler) => (cancelerRef.current = cancel)
                );
                const commPkgData = response.commPkgs.map(
                    (commPkg): CommPkgRow => {
                        return {
                            commPkgNo: commPkg.commPkgNo,
                            description: commPkg.description,
                            system: commPkg.system,
                            status: commPkg.status,
                            tableData: {
                                isSelected: selectedCommPkgScope.some(
                                    (c) => c.commPkgNo == commPkg.commPkgNo
                                ),
                            },
                            operationHandoverStatus:
                                commPkg.operationHandoverStatus,
                            rfocAcceptedAt: commPkg.rfocAcceptedAt,
                        };
                    }
                );
                return {
                    maxAvailable: response.maxAvailable,
                    commPkgs: commPkgData,
                };
            } catch (error) {
                console.error(error);
                return {
                    maxAvailable: 0,
                    commPkgs: [],
                };
            } finally {
                setLoading(false);
            }
        };

        const getCommPkgsByCommPkgNo = async (
            pageSize: number,
            page: number
        ): Promise<{ maxAvailable: number; commPkgs: CommPkgRow[] }> => {
            if (commPkgNo != null) {
                try {
                    const response = await apiClient.getCommPkgsAsync(
                        projectName,
                        commPkgNo,
                        pageSize,
                        page,
                        (cancel: Canceler) => (cancelerRef.current = cancel)
                    );

                    const commPkgData = response.commPkgs.map(
                        (commPkg): CommPkgRow => {
                            return {
                                commPkgNo: commPkg.commPkgNo,
                                description: commPkg.description,
                                system: commPkg.system,
                                status: commPkg.status,
                                tableData: {
                                    isSelected: true,
                                },
                                operationHandoverStatus:
                                    commPkg.operationHandoverStatus,
                                rfocAcceptedAt: commPkg.rfocAcceptedAt,
                            };
                        }
                    );
                    return {
                        maxAvailable: 1,
                        commPkgs: commPkgData,
                    };
                } catch (error) {
                    console.error(error);
                    return {
                        maxAvailable: 0,
                        commPkgs: [],
                    };
                }
            } else {
                return {
                    maxAvailable: 0,
                    commPkgs: [],
                };
            }
        };

        const getCommPkgsByQuery = (query: DataQuery): void => {
            if (commPkgNo == null) {
                getCommPkgsByFilter(query.pageSize, query.pageIndex).then(
                    (result) => {
                        setFilteredCommPkgs(result.commPkgs);
                        setSelectAll(
                            result.commPkgs.every((commpkg) => {
                                const searchResultsHaveSameSection =
                                    hasSameSection(
                                        commpkg.system,
                                        result.commPkgs[0].system
                                    );
                                let selectedScopeAndSearchResultsHaveSameSection =
                                    true;
                                if (selectedCommPkgScope[0]) {
                                    selectedScopeAndSearchResultsHaveSameSection =
                                        hasSameSection(
                                            commpkg.system,
                                            selectedCommPkgScope[0].system
                                        );
                                }
                                return (
                                    searchResultsHaveSameSection &&
                                    selectedScopeAndSearchResultsHaveSameSection
                                );
                            })
                        );
                        setData(result.commPkgs);
                        setMaxRows(result.maxAvailable);
                    }
                );
            } else {
                getCommPkgsByCommPkgNo(query.pageSize, query.pageIndex).then(
                    (result) => {
                        // Only the commPkg that exactly matches the one in the URL is shown
                        const thisCommPkg = result.commPkgs.filter(
                            (el) => el.commPkgNo == commPkgNo
                        );
                        setFilteredCommPkgs(thisCommPkg);
                        setSelectAll(true);
                        setData(thisCommPkg);
                        setMaxRows(result.maxAvailable);
                        setSelectedCommPkgScope(thisCommPkg);
                    }
                );
            }
        };

        useEffect(() => {
            const handleFilterChange = async (): Promise<void> => {
                getCommPkgsByQuery({
                    pageIndex: pageIndex,
                    pageSize: pageSize,
                    orderField: '',
                    orderDirection: '',
                });
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
            filteredCommPkgs.forEach((c) => {
                commPkgNos.push(c.commPkgNo);
            });
            const newSelectedCommPkgs = selectedCommPkgScope
                ? selectedCommPkgScope.filter(
                      (item) => !commPkgNos.includes(item.commPkgNo)
                  )
                : [];
            setSelectedCommPkgScope(newSelectedCommPkgs);
        };

        const addAllCommPkgsInScope = (rowData: CommPkgRow[]): void => {
            if (type != 'DP') {
                const rowsToAdd = rowData.filter((row) =>
                    hasValidSection(row.system)
                );
                setSelectedCommPkgScope((scope: CommPkgRow[]) => [
                    ...scope,
                    ...rowsToAdd,
                ]);
            }
        };

        useEffect(() => {
            const _data = [...data];
            _data.forEach((d) => {
                d.disableCheckbox = !hasValidSection(d.system);
                if (d.operationHandoverStatus === 'ACCEPTED') {
                    d.disableCheckbox = true;
                }
            });
            setFilteredCommPkgs(_data);
        }, [selectedCommPkgScope, data]);

        const unselectCommPkg = (commPkgNo: string): void => {
            const selectedIndex = selectedCommPkgScope.findIndex(
                (commPkg) => commPkg.commPkgNo === commPkgNo
            );
            const tableDataIndex = filteredCommPkgs.findIndex(
                (commPkg) => commPkg.commPkgNo === commPkgNo
            );
            if (selectedIndex > -1) {
                // remove from selected commPkgs
                const newSelectedCommPkgScope = [
                    ...selectedCommPkgScope.slice(0, selectedIndex),
                    ...selectedCommPkgScope.slice(selectedIndex + 1),
                ];
                setSelectedCommPkgScope(newSelectedCommPkgScope);
                tableRef &&
                    tableRef.current &&
                    tableRef.current.UnselectRow(tableDataIndex);
            }
        };

        useImperativeHandle(ref, () => ({
            removeSelectedCommPkg(commPkgNo: string): void {
                unselectCommPkg(commPkgNo);
            },
        }));

        const rowSelectionChanged = (
            rowData: CommPkgRow[],
            _row: CommPkgRow
        ): void => {
            removeAllSelectedCommPkgsInScope();
            addAllCommPkgsInScope(rowData);
        };

        const getDescriptionColumn = (
            row: TableOptions<CommPkgRow>
        ): JSX.Element => {
            const commPkg = row.value as CommPkgRow;
            return (
                <Tooltip
                    title={commPkg.description || ''}
                    arrow={true}
                    enterDelay={200}
                    enterNextDelay={100}
                >
                    <div>{commPkg.description}</div>
                </Tooltip>
            );
        };

        const getRFOCColumns = (row: TableOptions<McPkgRow>): JSX.Element => {
            const commPkg = row.value as CommPkgRow;
            return <div>{getFormattedDate(commPkg.rfocAcceptedAt)}</div>;
        };

        const getMcPkgs = (commPkgNo: string): void => {
            setCurrentCommPkg(commPkgNo);
        };

        const getToMcPkgsColumn = (
            row: TableOptions<CommPkgRow>
        ): JSX.Element => {
            const commPkg = row.value as CommPkgRow;
            return (
                <div className="tableCell goToMcCol">
                    <Button
                        variant="ghost_icon"
                        disabled={!hasValidSection(commPkg.system)}
                        onClick={(): void => getMcPkgs(commPkg.commPkgNo)}
                    >
                        <EdsIcon name="chevron_right" />
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
                accessor: 'commPkgNo',
            },
            {
                Header: 'Description',
                accessor: (
                    d: UseTableRowProps<CommPkgRow>
                ): UseTableRowProps<CommPkgRow> => d,
                Cell: getDescriptionColumn,
                width: 200,
                maxWidth: 500,
            },
            {
                Header: 'Comm status',
                accessor: 'status',
            },
            {
                Header: 'RFOC Signed at',
                accessor: (
                    d: UseTableRowProps<McPkgRow>
                ): UseTableRowProps<McPkgRow> => d,
                Cell: getRFOCColumns,
                width: 200,
                maxWidth: 500,
            },
            ...(type == 'DP'
                ? [
                      {
                          Header: getPaddedMCHeader(),
                          id: 'MC',
                          accessor: (
                              d: UseTableRowProps<CommPkgRow>
                          ): UseTableRowProps<CommPkgRow> => d,
                          Cell: getToMcPkgsColumn,
                          defaultCanSort: false,
                          width: 50,
                      },
                  ]
                : []),
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
                            disabled={type == 'MDP' && commPkgNo != null}
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
                        onSelectedChange={(
                            rowData: CommPkgRow[],
                            ids: any
                        ): void => {
                            rowSelectionChanged(rowData, ids);
                        }}
                        selectedRows={filteredCommPkgs
                            .filter((x: CommPkgRow) => x.tableData?.isSelected)
                            .map((a: CommPkgRow) => filteredCommPkgs.indexOf(a))
                            .reduce((obj: any, item) => {
                                return { ...obj, [item]: true };
                            }, true)}
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
    }
);

export default CommPkgTable;

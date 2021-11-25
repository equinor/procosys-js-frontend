import { Container, McPkgTableContainer, TopContainer } from './Table.style';
import {
    McPkgRow,
    McScope,
} from '@procosys/modules/InvitationForPunchOut/types';
import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';
import { TableOptions, UseTableRowProps } from 'react-table';

import { Canceler } from '@procosys/http/HttpClient';
import Loading from '@procosys/components/Loading';
import ProcosysTable from '@procosys/components/Table';
import { Tooltip } from '@material-ui/core';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { useInvitationForPunchOutContext } from '@procosys/modules/InvitationForPunchOut/context/InvitationForPunchOutContext';

interface McPkgTableProps {
    selectedMcPkgScope: McScope;
    setSelectedMcPkgScope: React.Dispatch<React.SetStateAction<McScope>>;
    projectName: string;
    commPkgNo: string;
}

export const multipleDisciplines = (selected: McPkgRow[]): boolean => {
    if (selected.length > 0) {
        const initialDiscipline = selected[0].discipline;
        if (selected.some((mc) => mc.discipline !== initialDiscipline)) {
            return true;
        }
    }
    return false;
};

const McPkgTable = forwardRef(
    (
        {
            selectedMcPkgScope,
            setSelectedMcPkgScope,
            projectName,
            commPkgNo,
        }: McPkgTableProps,
        ref
    ): JSX.Element => {
        const { apiClient } = useInvitationForPunchOutContext();
        const [availableMcPkgs, setAvailableMcPkgs] = useState<McPkgRow[]>([]);
        const [isLoading, setIsLoading] = useState<boolean>(true);
        const tableRef = useRef<any>();

        useEffect(() => {
            let requestCanceler: Canceler;
            (async (): Promise<void> => {
                try {
                    const availableMcPkgs = await apiClient
                        .getMcPkgsAsync(projectName, commPkgNo)
                        .then((mcPkgs) =>
                            mcPkgs.map((mcPkg): McPkgRow => {
                                return {
                                    mcPkgNo: mcPkg.mcPkgNo,
                                    description: mcPkg.description,
                                    discipline: mcPkg.disciplineCode,
                                    system: mcPkg.system,
                                    commPkgNo: commPkgNo,
                                    tableData: {
                                        isSelected:
                                            selectedMcPkgScope.selected.some(
                                                (mc) =>
                                                    mc.mcPkgNo == mcPkg.mcPkgNo
                                            ),
                                    },
                                };
                            })
                        );
                    setAvailableMcPkgs(availableMcPkgs);
                    setIsLoading(false);
                } catch (error) {
                    showSnackbarNotification(error.message);
                }
            })();
            return (): void => requestCanceler && requestCanceler();
        }, []);

        const unselectMcPkg = (mcPkgNo: string): void => {
            const selectedIndex = selectedMcPkgScope.selected.findIndex(
                (mcPkg) => mcPkg.mcPkgNo === mcPkgNo
            );
            const tableDataIndex = availableMcPkgs.findIndex(
                (mcPkg) => mcPkg.mcPkgNo === mcPkgNo
            );
            if (selectedIndex > -1) {
                // remove from selected mcPkgs
                const newSelected = [
                    ...selectedMcPkgScope.selected.slice(0, selectedIndex),
                    ...selectedMcPkgScope.selected.slice(selectedIndex + 1),
                ];
                const newSelectedMcPkgScope = {
                    system:
                        newSelected.length > 0
                            ? selectedMcPkgScope.system
                            : null,
                    multipleDisciplines: multipleDisciplines(newSelected),
                    selected: newSelected,
                };
                setSelectedMcPkgScope(newSelectedMcPkgScope);

                tableRef &&
                    tableRef.current &&
                    tableRef.current.UnselectRow(tableDataIndex);
            }
        };

        useImperativeHandle(ref, () => ({
            removeSelectedMcPkg(mcPkgNo: string): void {
                unselectMcPkg(mcPkgNo);
            },
        }));

        const addAllMcPkgsInScope = (rowData: McPkgRow[]): void => {
            if (rowData.length === 0) return;

            if (!selectedMcPkgScope.system) {
                setSelectedMcPkgScope((selectedScope: McScope) => {
                    return {
                        ...selectedScope,
                        system: rowData[0].system,
                        multipleDisciplines: multipleDisciplines([
                            ...selectedScope.selected,
                            ...rowData,
                        ]),
                        selected: [...selectedScope.selected, ...rowData],
                    };
                });
            } else {
                setSelectedMcPkgScope((selectedScope: McScope) => {
                    return {
                        ...selectedScope,
                        multipleDisciplines: multipleDisciplines([
                            ...selectedScope.selected,
                            ...rowData,
                        ]),
                        selected: [...selectedScope.selected, ...rowData],
                    };
                });
            }
        };

        const removeAllSelectedMcPkgsInScope = (): void => {
            const mcPkgNos: string[] = [];
            availableMcPkgs.forEach((m) => {
                mcPkgNos.push(m.mcPkgNo);
            });
            const newSelectedMcPkgs = selectedMcPkgScope.selected.filter(
                (item) => !mcPkgNos.includes(item.mcPkgNo)
            );
            setSelectedMcPkgScope({
                system:
                    newSelectedMcPkgs.length > 0
                        ? newSelectedMcPkgs[0].system
                        : null,
                multipleDisciplines: multipleDisciplines(newSelectedMcPkgs),
                selected: newSelectedMcPkgs,
            });
        };

        const rowSelectionChangedMc = (
            rowData: McPkgRow[],
            ids: Record<string, boolean>
        ): void => {
            removeAllSelectedMcPkgsInScope();
            addAllMcPkgsInScope(rowData);
        };

        const getDescriptionColumn = (
            row: TableOptions<McPkgRow>
        ): JSX.Element => {
            const mcPkg = row.value as McPkgRow;
            return (
                <Tooltip
                    title={mcPkg.description || ''}
                    arrow={true}
                    enterDelay={200}
                    enterNextDelay={100}
                >
                    <div>{mcPkg.description}</div>
                </Tooltip>
            );
        };

        const columns = [
            {
                Header: 'Mc pkg',
                accessor: 'mcPkgNo',
                filter: (
                    rows: UseTableRowProps<McPkgRow>[],
                    id: number,
                    filterType: string
                ): UseTableRowProps<McPkgRow>[] => {
                    return rows.filter((row) => {
                        return (
                            row.original.mcPkgNo
                                ?.toLowerCase()
                                .indexOf(filterType.toLowerCase()) > -1
                        );
                    });
                },
                filterPlaceholder: 'Search for mc pkg no',
            },
            {
                Header: 'Description',
                accessor: (
                    d: UseTableRowProps<McPkgRow>
                ): UseTableRowProps<McPkgRow> => d,
                Cell: getDescriptionColumn,
                width: 200,
                maxWidth: 500,
            },
        ];

        return (
            <Container>
                <TopContainer></TopContainer>
                {isLoading && <Loading title="Loading MC packages" />}
                {!isLoading && (
                    <McPkgTableContainer>
                        <ProcosysTable
                            ref={tableRef}
                            columns={columns}
                            data={availableMcPkgs}
                            clientPagination={true}
                            clientSorting={true}
                            maxRowCount={availableMcPkgs.length}
                            pageIndex={0}
                            rowSelect={true}
                            onSelectedChange={(
                                rowData: McPkgRow[],
                                ids: any
                            ): void => {
                                rowSelectionChangedMc(rowData, ids);
                            }}
                            selectedRows={availableMcPkgs
                                .filter(
                                    (x: McPkgRow) => x.tableData?.isSelected
                                )
                                .map((a: McPkgRow) =>
                                    availableMcPkgs.indexOf(a)
                                )
                                .reduce((obj: any, item) => {
                                    return { ...obj, [item]: true };
                                }, true)}
                            pageSize={10}
                        />
                    </McPkgTableContainer>
                )}
            </Container>
        );
    }
);

export default McPkgTable;

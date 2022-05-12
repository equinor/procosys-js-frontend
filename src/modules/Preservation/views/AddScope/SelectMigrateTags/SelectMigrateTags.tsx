import { Button, Typography } from '@equinor/eds-core-react';
import {
    ButtonSeparator,
    ButtonsContainer,
    Container,
    Header,
    InnerContainer,
    TagsHeader,
    TopContainer,
    TableContainer,
    OverflowColumn,
} from './SelectMigrateTags.style';
import { TableOptions, UseTableRowProps } from 'react-table';
import { Tag, TagMigrationRow } from '../types';

import { AddScopeMethod } from '../AddScope';
import ProcosysTable from '@procosys/components/Table';
import React, { useEffect } from 'react';
import { SelectColumnFilter } from '@procosys/components/Table/filters';
import { getFormattedDate } from '@procosys/core/services/DateService';
import { useHistory } from 'react-router-dom';
import { usePreservationContext } from '../../../context/PreservationContext';
import { CheckBox } from '@mui/icons-material';
import { Tooltip } from '@mui/material';

type SelectMigrateTagsProps = {
    selectedTags: Tag[];
    migrationTableData: TagMigrationRow[];
    setSelectedTags: (tags: Tag[]) => void;
    searchTags: (tagNo: string | null) => void;
    nextStep: () => void;
    isLoading: boolean;
    addScopeMethod: AddScopeMethod;
    removeTag: (tagNo: string) => void;
    removeFromMigrationScope: () => void;
    setSelectedTableRows: (ids: Record<string, boolean>) => void;
    selectedTableRows: Record<string, boolean>;
};

const getDescriptionColumn = (
    row: TableOptions<TagMigrationRow>
): JSX.Element => {
    const migrationRow = row.value as TagMigrationRow;
    return (
        <Tooltip
            title={migrationRow.description || ''}
            arrow={true}
            enterDelay={200}
            enterNextDelay={100}
        >
            <OverflowColumn>{migrationRow.description}</OverflowColumn>
        </Tooltip>
    );
};

const getRemarkColumn = (row: TableOptions<TagMigrationRow>): JSX.Element => {
    const migrationRow = row.value as TagMigrationRow;
    return (
        <Tooltip
            title={migrationRow.preservationRemark || ''}
            arrow={true}
            enterDelay={200}
            enterNextDelay={100}
        >
            <OverflowColumn>{migrationRow.preservationRemark}</OverflowColumn>
        </Tooltip>
    );
};

const getStorageAreaColumn = (
    row: TableOptions<TagMigrationRow>
): JSX.Element => {
    const migrationRow = row.value as TagMigrationRow;
    return (
        <Tooltip
            title={migrationRow.storageArea || ''}
            arrow={true}
            enterDelay={200}
            enterNextDelay={100}
        >
            <OverflowColumn>{migrationRow.storageArea}</OverflowColumn>
        </Tooltip>
    );
};

const getMCCRRespColumn = (row: TableOptions<TagMigrationRow>): JSX.Element => {
    const migrationRow = row.value as TagMigrationRow;
    return (
        <Tooltip
            title={migrationRow.mccrResponsibleCodes || ''}
            arrow={true}
            enterDelay={200}
            enterNextDelay={100}
        >
            <OverflowColumn>{migrationRow.mccrResponsibleCodes}</OverflowColumn>
        </Tooltip>
    );
};

const columns = [
    {
        Header: 'Tag no',
        field: 'tagNo',
        accessor: 'tagNo',
        filter: (
            rows: UseTableRowProps<TagMigrationRow>[],
            id: number,
            filterType: string
        ): UseTableRowProps<TagMigrationRow>[] => {
            return rows.filter((row) => {
                return (
                    row.original.tagNo
                        ?.toLowerCase()
                        .indexOf(filterType.toLowerCase()) > -1
                );
            });
        },
    },
    {
        Header: 'Description',
        field: 'description',
        accessor: (
            d: UseTableRowProps<TagMigrationRow>
        ): UseTableRowProps<TagMigrationRow> => d,
        filter: (
            rows: UseTableRowProps<TagMigrationRow>[],
            id: number,
            filterType: string
        ): UseTableRowProps<TagMigrationRow>[] => {
            return rows.filter((row) => {
                return (
                    row.original.description
                        ?.toLowerCase()
                        .indexOf(filterType.toLowerCase()) > -1
                );
            });
        },
        Cell: getDescriptionColumn,
    },
    {
        Header: 'Remark',
        field: 'preservationRemark',
        accessor: (
            d: UseTableRowProps<TagMigrationRow>
        ): UseTableRowProps<TagMigrationRow> => d,
        filter: (
            rows: UseTableRowProps<TagMigrationRow>[],
            id: number,
            filterType: string
        ): UseTableRowProps<TagMigrationRow>[] => {
            return rows.filter((row) => {
                return (
                    row.original.preservationRemark
                        ?.toLowerCase()
                        .indexOf(filterType.toLowerCase()) > -1
                );
            });
        },
        Cell: getRemarkColumn,
    },
    {
        Header: 'Due',
        field: 'nextUpcommingDueTime',
        accessor: 'nextUpcommingDueTime',
        Cell: (rowData: TableOptions<TagMigrationRow>): JSX.Element => {
            return (
                <div>
                    {getFormattedDate(rowData.row.values.nextUpcommingDueTime)}
                </div>
            );
        },
        filter: (
            rows: UseTableRowProps<TagMigrationRow>[],
            id: number,
            filterType: string
        ): UseTableRowProps<TagMigrationRow>[] => {
            return rows.filter((row) => {
                return (
                    getFormattedDate(row.original.nextUpcommingDueTime)
                        ?.toLowerCase()
                        .indexOf(filterType.toLowerCase()) > -1
                );
            });
        },
    },
    {
        Header: 'Start date',
        field: 'startDate',
        accessor: 'startDate',
        Cell: (rowData: TableOptions<TagMigrationRow>): JSX.Element => {
            return <div>{getFormattedDate(rowData.row.values.startDate)}</div>;
        },
        filter: (
            rows: UseTableRowProps<TagMigrationRow>[],
            id: number,
            filterType: string
        ): UseTableRowProps<TagMigrationRow>[] => {
            return rows.filter((row) => {
                return (
                    getFormattedDate(row.original.startDate)
                        ?.toLowerCase()
                        .indexOf(filterType.toLowerCase()) > -1
                );
            });
        },
    },
    {
        Header: 'Storage area',
        field: 'storageArea',
        accessor: (
            d: UseTableRowProps<TagMigrationRow>
        ): UseTableRowProps<TagMigrationRow> => d,
        filter: (
            rows: UseTableRowProps<TagMigrationRow>[],
            id: number,
            filterType: string
        ): UseTableRowProps<TagMigrationRow>[] => {
            return rows.filter((row) => {
                return (
                    row.original.storageArea
                        ?.toLowerCase()
                        .indexOf(filterType.toLowerCase()) > -1
                );
            });
        },
        Cell: getStorageAreaColumn,
    },
    {
        Header: 'Mode',
        field: 'modeCode',
        accessor: 'modeCode',
        filter: (
            rows: UseTableRowProps<TagMigrationRow>[],
            id: number,
            filterType: string
        ): UseTableRowProps<TagMigrationRow>[] => {
            return rows.filter((row) => {
                return (
                    row.original.modeCode
                        ?.toLowerCase()
                        .indexOf(filterType.toLowerCase()) > -1
                );
            });
        },
    },
    {
        Header: 'Heating',
        accessor: (d: TagMigrationRow): string | undefined => {
            return d.heating ? 'Heating' : 'No heating';
        },
        field: 'heating',
        Cell: (rowData: TableOptions<TagMigrationRow>): JSX.Element => {
            return rowData.row.values.Heating === 'Heating' ? (
                <CheckBox />
            ) : (
                <></>
            );
        },
        Filter: SelectColumnFilter,
        filter: 'equals',
    },
    {
        Header: 'Special req',
        accessor: (d: TagMigrationRow): string | undefined => {
            return d.special ? 'Special req' : 'No';
        },
        field: 'special',
        Cell: (rowData: TableOptions<TagMigrationRow>): JSX.Element => {
            return rowData.row.values['Special req'] !== 'No' ? (
                <CheckBox />
            ) : (
                <></>
            );
        },
        Filter: SelectColumnFilter,
        filter: 'equals',
    },
    {
        Header: 'Preserved',
        accessor: (d: TagMigrationRow): string | undefined => {
            return d.isPreserved ? 'Preserved' : 'Not preserved';
        },
        field: 'isPreserved',
        Cell: (rowData: TableOptions<TagMigrationRow>): JSX.Element => {
            return rowData.row.values.Preserved === 'Preserved' ? (
                <CheckBox />
            ) : (
                <></>
            );
        },
        Filter: SelectColumnFilter,
        filter: 'equals',
    },
    {
        Header: 'MCCR resp',
        field: 'mccrResponsibleCodes',
        accessor: (
            d: UseTableRowProps<TagMigrationRow>
        ): UseTableRowProps<TagMigrationRow> => d,
        filter: (
            rows: UseTableRowProps<TagMigrationRow>[],
            id: number,
            filterType: string
        ): UseTableRowProps<TagMigrationRow>[] => {
            return rows.filter((row) => {
                return (
                    row.original.mccrResponsibleCodes
                        ?.toLowerCase()
                        .indexOf(filterType.toLowerCase()) > -1
                );
            });
        },
        Cell: getMCCRRespColumn,
    },
    {
        Header: 'PO',
        field: 'purchaseOrderTitle',
        accessor: 'purchaseOrderTitle',
        filter: (
            rows: UseTableRowProps<TagMigrationRow>[],
            id: number,
            filterType: string
        ): UseTableRowProps<TagMigrationRow>[] => {
            return rows.filter((row) => {
                return (
                    row.original.purchaseOrderTitle
                        ?.toLowerCase()
                        .indexOf(filterType.toLowerCase()) > -1
                );
            });
        },
    },
    {
        Header: 'Comm pkg',
        field: 'commPkgNo',
        accessor: 'commPkgNo',
        filter: (
            rows: UseTableRowProps<TagMigrationRow>[],
            id: number,
            filterType: string
        ): UseTableRowProps<TagMigrationRow>[] => {
            return rows.filter((row) => {
                return (
                    row.original.commPkgNo
                        ?.toLowerCase()
                        .indexOf(filterType.toLowerCase()) > -1
                );
            });
        },
    },
    {
        Header: 'MC pkg',
        field: 'mcPkgNo',
        accessor: 'mcPkgNo',
        filter: (
            rows: UseTableRowProps<TagMigrationRow>[],
            id: number,
            filterType: string
        ): UseTableRowProps<TagMigrationRow>[] => {
            return rows.filter((row) => {
                return (
                    row.original.mcPkgNo
                        ?.toLowerCase()
                        .indexOf(filterType.toLowerCase()) > -1
                );
            });
        },
    },
    {
        Header: 'Tag function',
        field: 'tagFunctionCode',
        accessor: 'tagFunctionCode',
        filter: (
            rows: UseTableRowProps<TagMigrationRow>[],
            id: number,
            filterType: string
        ): UseTableRowProps<TagMigrationRow>[] => {
            return rows.filter((row) => {
                return (
                    row.original.tagFunctionCode
                        ?.toLowerCase()
                        .indexOf(filterType.toLowerCase()) > -1
                );
            });
        },
    },
];

const SelectMigrateTags = (props: SelectMigrateTagsProps): JSX.Element => {
    const { project, purchaseOrderNumber } = usePreservationContext();
    const history = useHistory();

    useEffect(() => {
        const selectedRows: Record<string, boolean> = {};

        props.selectedTags.map((tag) => {
            const index = props.migrationTableData.indexOf(
                props.migrationTableData.find(
                    (t) => t.tagNo === tag.tagNo
                ) as TagMigrationRow
            );
            selectedRows[index] = true;
        });

        props.setSelectedTableRows(selectedRows);
    }, [props.selectedTags]);

    const removeAllSelectedTagsInScope = (): void => {
        const tagNos: string[] = [];
        props.migrationTableData.forEach((l) => {
            tagNos.push(l.tagNo);
        });
        const newSelectedTags = props.selectedTags.filter(
            (item) => !tagNos.includes(item.tagNo)
        );
        props.setSelectedTags(newSelectedTags);
    };

    const addTagsInScope = (rowData: TagMigrationRow[]): void => {
        const allRows = rowData
            .filter((row) => !row.isPreserved)
            .map((row) => {
                return {
                    tagNo: row.tagNo,
                    tagId: row.id,
                    description: row.description,
                    mcPkgNo: row.mcPkgNo,
                };
            });
        props.setSelectedTags([...allRows]);
    };

    const rowSelectionChanged = (
        rowData: TagMigrationRow[],
        ids: Record<string, boolean>
    ): void => {
        if (
            rowData.length == 0 &&
            props.migrationTableData &&
            props.migrationTableData.length > 0
        ) {
            removeAllSelectedTagsInScope();
        } else {
            addTagsInScope(rowData);
        }

        props.setSelectedTableRows(ids);
    };

    const cancel = (): void => {
        history.push('/');
    };

    return (
        <Container>
            <Header>
                <Typography variant="h1">Migrate preservation scope</Typography>
                <div>{project.name}</div>

                {purchaseOrderNumber && (
                    <div style={{ marginLeft: 'calc(var(--grid-unit) * 4)' }}>
                        PO number: {purchaseOrderNumber}
                    </div>
                )}
            </Header>
            <TopContainer>
                <InnerContainer>
                    <TagsHeader>
                        Select the tags that should be migrated, and click
                        &apos;next&apos;
                    </TagsHeader>
                </InnerContainer>
                <ButtonsContainer>
                    <Button onClick={cancel} variant="outlined">
                        Cancel
                    </Button>
                    <ButtonSeparator />
                    <Button
                        onClick={props.removeFromMigrationScope}
                        disabled={props.selectedTags.length === 0}
                    >
                        Remove from migration scope
                    </Button>
                    <ButtonSeparator />
                    <Button
                        onClick={props.nextStep}
                        disabled={props.selectedTags.length === 0}
                    >
                        Next
                    </Button>
                </ButtonsContainer>
            </TopContainer>

            <TableContainer>
                <ProcosysTable
                    onSelectedChange={(
                        rowData: TagMigrationRow[],
                        ids: any
                    ): void => {
                        rowSelectionChanged(rowData, ids);
                    }}
                    pageIndex={0}
                    pageSize={50}
                    columns={columns}
                    maxRowCount={props.migrationTableData.length}
                    data={props.migrationTableData}
                    clientPagination={true}
                    clientSorting={true}
                    loading={props.isLoading}
                    rowSelect={true}
                    selectedRows={props.selectedTableRows}
                    pageCount={Math.ceil(props.migrationTableData.length / 50)}
                />
            </TableContainer>
        </Container>
    );
};

export default SelectMigrateTags;

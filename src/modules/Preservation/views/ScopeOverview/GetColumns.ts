import { PreservedTag } from '@procosys/modules/Preservation/views/ScopeOverview/types';
import { TableOptions, UseTableRowProps } from 'react-table';

function getColumns(
    getTagNoColumn: (row: TableOptions<PreservedTag>) => JSX.Element,
    getDescriptionColumn: (row: TableOptions<PreservedTag>) => JSX.Element,
    getDueColumn: (row: TableOptions<PreservedTag>) => JSX.Element,
    getNextColumn: (row: TableOptions<PreservedTag>) => JSX.Element,
    getMode: (row: TableOptions<PreservedTag>) => JSX.Element,
    getPOColumn: (row: TableOptions<PreservedTag>) => JSX.Element,
    getAreaCode: (row: TableOptions<PreservedTag>) => JSX.Element,
    getResponsibleColumn: (row: TableOptions<PreservedTag>) => JSX.Element,
    getDisciplineCode: (row: TableOptions<PreservedTag>) => JSX.Element,
    getStatus: (row: TableOptions<PreservedTag>) => JSX.Element,
    getRequirementColumn: (row: TableOptions<PreservedTag>) => JSX.Element,
    getActionsHeader: () => JSX.Element,
    getActionsColumn: (row: TableOptions<PreservedTag>) => JSX.Element
): {
    mobileColumns: (
        | {
              Header: string;
              accessor: (
                  d: UseTableRowProps<PreservedTag>
              ) => UseTableRowProps<PreservedTag>;
              id: string;
              Cell: (row: TableOptions<PreservedTag>) => JSX.Element;
              width: number;
              maxWidth: number;
              minWidth: number;
              defaultCanSort?: undefined;
          }
        | {
              Header: string;
              accessor: (
                  d: UseTableRowProps<PreservedTag>
              ) => UseTableRowProps<PreservedTag>;
              id: string;
              Cell: (row: TableOptions<PreservedTag>) => JSX.Element;
              defaultCanSort: boolean;
              width: number;
              maxWidth: number;
              minWidth: number;
          }
        | {
              Header: string;
              accessor: (
                  d: UseTableRowProps<PreservedTag>
              ) => UseTableRowProps<PreservedTag>;
              Cell: (row: TableOptions<PreservedTag>) => JSX.Element;
              width: number;
              maxWidth: number;
              minWidth: number;
              id?: undefined;
              defaultCanSort?: undefined;
          }
        | {
              Header: string;
              id: string;
              accessor: (
                  d: UseTableRowProps<PreservedTag>
              ) => UseTableRowProps<PreservedTag>;
              Cell: (row: TableOptions<PreservedTag>) => JSX.Element;
              width?: undefined;
              maxWidth?: undefined;
              minWidth?: undefined;
              defaultCanSort?: undefined;
          }
        | {
              Header: string;
              accessor: (d: PreservedTag) => string | undefined;
              id: string;
              Cell: (row: TableOptions<PreservedTag>) => JSX.Element;
              width?: undefined;
              maxWidth?: undefined;
              minWidth?: undefined;
              defaultCanSort?: undefined;
          }
        | {
              Header: JSX.Element;
              accessor: (
                  d: UseTableRowProps<PreservedTag>
              ) => UseTableRowProps<PreservedTag>;
              id: string;
              Cell: (row: TableOptions<PreservedTag>) => JSX.Element;
              defaultCanSort: boolean;
              width: number;
              maxWidth: number;
              minWidth: number;
          }
    )[];
    desktopColumns: (
        | {
              Header: string;
              accessor: (
                  d: UseTableRowProps<PreservedTag>
              ) => UseTableRowProps<PreservedTag>;
              id: string;
              Cell: (row: TableOptions<PreservedTag>) => JSX.Element;
              width: number;
              maxWidth: number;
              minWidth: number;
              defaultCanSort?: undefined;
          }
        | {
              Header: string;
              accessor: (
                  d: UseTableRowProps<PreservedTag>
              ) => UseTableRowProps<PreservedTag>;
              Cell: (row: TableOptions<PreservedTag>) => JSX.Element;
              width: number;
              maxWidth: number;
              minWidth: number;
              id?: undefined;
              defaultCanSort?: undefined;
          }
        | {
              Header: string;
              id: string;
              accessor: (
                  d: UseTableRowProps<PreservedTag>
              ) => UseTableRowProps<PreservedTag>;
              Cell: (row: TableOptions<PreservedTag>) => JSX.Element;
              width?: undefined;
              maxWidth?: undefined;
              minWidth?: undefined;
              defaultCanSort?: undefined;
          }
        | {
              Header: string;
              accessor: (d: PreservedTag) => string | undefined;
              id: string;
              Cell: (row: TableOptions<PreservedTag>) => JSX.Element;
              width?: undefined;
              maxWidth?: undefined;
              minWidth?: undefined;
              defaultCanSort?: undefined;
          }
        | {
              Header: string;
              accessor: (
                  d: UseTableRowProps<PreservedTag>
              ) => UseTableRowProps<PreservedTag>;
              id: string;
              Cell: (row: TableOptions<PreservedTag>) => JSX.Element;
              defaultCanSort: boolean;
              width: number;
              maxWidth: number;
              minWidth: number;
          }
        | {
              Header: JSX.Element;
              accessor: (
                  d: UseTableRowProps<PreservedTag>
              ) => UseTableRowProps<PreservedTag>;
              id: string;
              Cell: (row: TableOptions<PreservedTag>) => JSX.Element;
              defaultCanSort: boolean;
              width: number;
              maxWidth: number;
              minWidth: number;
          }
    )[];
} {
    const desktopColumns = [
        {
            Header: 'Tag no',
            accessor: (
                d: UseTableRowProps<PreservedTag>
            ): UseTableRowProps<PreservedTag> => d,
            id: 'tagNo',
            Cell: getTagNoColumn,
            width: 180,
            maxWidth: 400,
            minWidth: 150,
        },
        {
            Header: 'Description',
            accessor: (
                d: UseTableRowProps<PreservedTag>
            ): UseTableRowProps<PreservedTag> => d,
            Cell: getDescriptionColumn,
            width: 250,
            maxWidth: 400,
            minWidth: 80,
        },
        {
            Header: 'Due',
            accessor: (
                d: UseTableRowProps<PreservedTag>
            ): UseTableRowProps<PreservedTag> => d,
            id: 'due',
            Cell: getDueColumn,
            width: 60,
            maxWidth: 100,
            minWidth: 50,
        },
        {
            Header: 'Next',
            accessor: (
                d: UseTableRowProps<PreservedTag>
            ): UseTableRowProps<PreservedTag> => d,
            id: 'Due',
            Cell: getNextColumn,
            width: 100,
            maxWidth: 150,
            minWidth: 50,
        },
        {
            Header: 'Mode',
            accessor: (
                d: UseTableRowProps<PreservedTag>
            ): UseTableRowProps<PreservedTag> => d,
            Cell: getMode,
            width: 200,
            maxWidth: 400,
            minWidth: 50,
        },
        {
            Header: 'PO',
            accessor: (
                d: UseTableRowProps<PreservedTag>
            ): UseTableRowProps<PreservedTag> => d,
            id: 'PO',
            Cell: getPOColumn,
            width: 100,
            maxWidth: 150,
            minWidth: 50,
        },
        {
            Header: 'Area',
            accessor: (
                d: UseTableRowProps<PreservedTag>
            ): UseTableRowProps<PreservedTag> => d,
            id: 'Area',
            Cell: getAreaCode,
            width: 100,
            maxWidth: 150,
            minWidth: 50,
        },
        {
            Header: 'Resp',
            id: 'responsible',
            accessor: (
                d: UseTableRowProps<PreservedTag>
            ): UseTableRowProps<PreservedTag> => d,
            Cell: getResponsibleColumn,
        },
        {
            Header: 'Disc',
            id: 'discipline',
            accessor: (
                d: UseTableRowProps<PreservedTag>
            ): UseTableRowProps<PreservedTag> => d,
            Cell: getDisciplineCode,
        },
        {
            Header: 'Status',
            accessor: (d: PreservedTag): string | undefined => {
                return d.status;
            },
            id: 'status',
            Cell: getStatus,
        },
        {
            Header: 'Req type',
            accessor: (
                d: UseTableRowProps<PreservedTag>
            ): UseTableRowProps<PreservedTag> => d,
            id: 'reqtype',
            Cell: getRequirementColumn,
            defaultCanSort: false,
            width: 200,
            maxWidth: 400,
            minWidth: 150,
        },
        {
            Header: getActionsHeader(),
            accessor: (
                d: UseTableRowProps<PreservedTag>
            ): UseTableRowProps<PreservedTag> => d,
            id: 'actions',
            Cell: getActionsColumn,
            defaultCanSort: false,
            width: 60,
            maxWidth: 100,
            minWidth: 30,
        },
    ];

    const mobileColumns = [
        {
            Header: 'Tag no',
            accessor: (
                d: UseTableRowProps<PreservedTag>
            ): UseTableRowProps<PreservedTag> => d,
            id: 'tagNo',
            Cell: getTagNoColumn,
            width: 180,
            maxWidth: 400,
            minWidth: 150,
        },
        {
            Header: 'Req type',
            accessor: (
                d: UseTableRowProps<PreservedTag>
            ): UseTableRowProps<PreservedTag> => d,
            id: 'reqtype',
            Cell: getRequirementColumn,
            defaultCanSort: false,
            width: 200,
            maxWidth: 400,
            minWidth: 150,
        },
        {
            Header: 'Due',
            accessor: (
                d: UseTableRowProps<PreservedTag>
            ): UseTableRowProps<PreservedTag> => d,
            id: 'due',
            Cell: getDueColumn,
            width: 60,
            maxWidth: 100,
            minWidth: 50,
        },
        {
            Header: 'Next',
            accessor: (
                d: UseTableRowProps<PreservedTag>
            ): UseTableRowProps<PreservedTag> => d,
            id: 'Due',
            Cell: getNextColumn,
            width: 100,
            maxWidth: 150,
            minWidth: 50,
        },
        {
            Header: 'Mode',
            accessor: (
                d: UseTableRowProps<PreservedTag>
            ): UseTableRowProps<PreservedTag> => d,
            Cell: getMode,
            width: 200,
            maxWidth: 400,
            minWidth: 50,
        },
        {
            Header: 'PO',
            accessor: (
                d: UseTableRowProps<PreservedTag>
            ): UseTableRowProps<PreservedTag> => d,
            id: 'PO',
            Cell: getPOColumn,
            width: 100,
            maxWidth: 150,
            minWidth: 50,
        },
        {
            Header: 'Area',
            accessor: (
                d: UseTableRowProps<PreservedTag>
            ): UseTableRowProps<PreservedTag> => d,
            id: 'Area',
            Cell: getAreaCode,
            width: 100,
            maxWidth: 150,
            minWidth: 50,
        },
        {
            Header: 'Resp',
            id: 'responsible',
            accessor: (
                d: UseTableRowProps<PreservedTag>
            ): UseTableRowProps<PreservedTag> => d,
            Cell: getResponsibleColumn,
        },
        {
            Header: 'Disc',
            id: 'discipline',
            accessor: (
                d: UseTableRowProps<PreservedTag>
            ): UseTableRowProps<PreservedTag> => d,
            Cell: getDisciplineCode,
        },
        {
            Header: 'Status',
            accessor: (d: PreservedTag): string | undefined => {
                return d.status;
            },
            id: 'status',
            Cell: getStatus,
        },
        {
            Header: getActionsHeader(),
            accessor: (
                d: UseTableRowProps<PreservedTag>
            ): UseTableRowProps<PreservedTag> => d,
            id: 'actions',
            Cell: getActionsColumn,
            defaultCanSort: false,
            width: 60,
            maxWidth: 100,
            minWidth: 30,
        },
    ];
    return { mobileColumns, desktopColumns };
}

export default getColumns;

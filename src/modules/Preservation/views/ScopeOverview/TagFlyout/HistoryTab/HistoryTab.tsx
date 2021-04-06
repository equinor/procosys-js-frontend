import { Container, DetailsContainer, DueContainer } from './HistoryTab.style';
import React, { useEffect, useState } from 'react';
import { TableOptions, UseTableRowProps } from 'react-table';

import { Canceler } from 'axios';
import EdsIcon from '@procosys/components/EdsIcon';
import HistoryDetails from './HistoryDetails';
import PreservedRequirement from './PreservedRequirement';
import ProcosysTable from '@procosys/components/Table';
import Spinner from '@procosys/components/Spinner';
import { Tooltip } from '@material-ui/core';
import { getFormattedDate } from '@procosys/core/services/DateService';
import { showSnackbarNotification } from '../../../../../../core/services/NotificationService';
import { tokens } from '@equinor/eds-tokens';
import { usePreservationContext } from '../../../../context/PreservationContext';

interface HistoryLogItem {
    id: number;
    description: string;
    createdAtUtc: Date;
    createdBy: {
        id: number;
        firstName: string;
        lastName: string;
    };
    eventType: string;
    dueWeeks: number;
    tagRequirementId: number;
    preservationRecordGuid: string;
}

interface HistoryTabProps {
    tagId: number;
}

const HistoryTab = ({
    tagId
}: HistoryTabProps): JSX.Element => {

    const { apiClient } = usePreservationContext();
    const [historyLog, setHistoryLog] = useState<HistoryLogItem[]>([]);
    const [selectedHistoryItem, setSelectedHistoryItem] = useState<HistoryLogItem | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showRequirementDialog, setShowRequirementDialog] = useState<boolean>(false);

    const getHistoryLog = (): Canceler | null => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            try {
                if (tagId != null) {
                    setIsLoading(true);
                    const historyLog = await apiClient.getHistory(tagId, (cancel: Canceler) => requestCancellor = cancel);
                    setHistoryLog(historyLog);
                }
            } catch (error) {
                console.error('Get history log failed: ', error.message, error.data);
                showSnackbarNotification(error.message, 5000, true);
            }
            setIsLoading(false);
        })();

        return (): void => {
            requestCancellor && requestCancellor();
        };
    };

    /*Get the history log initially */
    useEffect(() => {
        getHistoryLog();
    }, []);

    const showHistoryDetails = (historyItem: HistoryLogItem): void => {
        setSelectedHistoryItem(historyItem);

        if (historyItem.eventType === 'RequirementPreserved') {
            setShowRequirementDialog(true);
        }
    };

    const closeHistoryDetails = (): void => {
        setSelectedHistoryItem(null);
        setShowRequirementDialog(false);
    };

    const getDateColumn = (row: TableOptions<HistoryLogItem>): JSX.Element => {
        const historyItem = row.value as HistoryLogItem;
        return (
            <DueContainer isOverdue={historyItem.dueWeeks < 0}>
                {getFormattedDate(historyItem.createdAtUtc)}
            </DueContainer>
        );
    };

    const getUserColumn = (row: TableOptions<HistoryLogItem>): JSX.Element => {
        const historyItem = row.value as HistoryLogItem;
        return (
            <div>
                {`${historyItem.createdBy.firstName} ${historyItem.createdBy.lastName}`}
            </div>
        );
    };

    const getDueColumn = (row: TableOptions<HistoryLogItem>): JSX.Element => {
        const historyItem = row.value as HistoryLogItem;
        return (
            <DueContainer isOverdue={historyItem.dueWeeks < 0}>
                {historyItem.dueWeeks}
            </DueContainer>
        );
    };

    const getDetailsColumn = (row: TableOptions<HistoryLogItem>): JSX.Element => {
        const historyItem = row.value as HistoryLogItem;
        if (historyItem.eventType === 'RequirementPreserved') {
            return (
                <Tooltip title={'Show details'} arrow={true} enterDelay={200} enterNextDelay={100}>
                    <DetailsContainer onClick={(): void => showHistoryDetails(historyItem)}>
                        <EdsIcon name='info_circle' size={24} color={tokens.colors.text.static_icons__tertiary.rgba} />
                    </DetailsContainer>
                </Tooltip>
            );
        }

        return <div></div>;
    };

    if (isLoading) {
        return (
            <div style={{ margin: 'calc(var(--grid-unit) * 5) auto' }}><Spinner large /></div>
        );
    }


    const columns = [
        {
            Header: 'Date',
            accessor: (d: UseTableRowProps<HistoryLogItem>): UseTableRowProps<HistoryLogItem> => d,
            Cell: getDateColumn
        },
        {
            Header: 'User',
            accessor: (d: UseTableRowProps<HistoryLogItem>): UseTableRowProps<HistoryLogItem> => d,
            Cell: getUserColumn
        },
        {
            Header: 'Due',
            accessor: (d: UseTableRowProps<HistoryLogItem>): UseTableRowProps<HistoryLogItem> => d,
            Cell: getDueColumn
        },
        {
            Header: 'Description',
            field: 'description',
            accessor: 'description'
        },
        {
            Header: ' ',
            field: 'eventType',
            accessor: (d: UseTableRowProps<HistoryLogItem>): UseTableRowProps<HistoryLogItem> => d,
            Cell: getDetailsColumn
        },
    ];

    return (
        <>
            <Container>
                <div style={{ height: '500px' }} id="kake">
                    <ProcosysTable
                        pageIndex={0}
                        pageSize={10}
                        columns={columns}
                        maxRowCount={historyLog.length}
                        data={historyLog}
                        clientPagination={true}
                        clientSorting={true}
                        loading={false}
                        pageCount={Math.ceil(historyLog.length / 10)} />
                </div>
            </Container>
            {
                showRequirementDialog && (
                    <HistoryDetails close={(): void => closeHistoryDetails()}>
                        {
                            selectedHistoryItem && (
                                <PreservedRequirement
                                    tagId={tagId}
                                    tagRequirementId={selectedHistoryItem.tagRequirementId}
                                    preservationRecordGuid={selectedHistoryItem.preservationRecordGuid}
                                    close={closeHistoryDetails}
                                />
                            )
                        }
                    </HistoryDetails>
                )
            }
        </>
    );
};

export default HistoryTab;

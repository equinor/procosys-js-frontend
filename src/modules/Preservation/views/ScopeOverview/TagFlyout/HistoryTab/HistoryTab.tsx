import React, { useState, useEffect } from 'react';
import { showSnackbarNotification } from '../../../../../../core/services/NotificationService';
import { usePreservationContext } from '../../../../context/PreservationContext';
import { Canceler } from 'axios';
import Spinner from '@procosys/components/Spinner';
import { Container } from './HistoryTab.style';
import Table from '../../../../../../components/Table';
import { tokens } from '@equinor/eds-tokens';

export interface HistoryLogItem {
    id: number;
    description: string;
    createdAtUtc: Date;
    createdById: string;
    eventType: string;
    dueWeeks: number;
    preservationRecordId: number;
}

interface HistoryTabProps {
    tagId: number;
}

const HistoryTab = ({
    tagId
}: HistoryTabProps): JSX.Element => {

    const { apiClient } = usePreservationContext();
    const [historyLog, setHistoryLog] = useState<HistoryLogItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

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
                console.error('Get history log failed: ', error.messsage, error.data);
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


    if (isLoading) {
        return (
            <div style={{ margin: 'calc(var(--grid-unit) * 5) auto' }}><Spinner large /></div>
        );
    }

    return (
        <Container>
            <Table
                columns={[
                    { title: 'Date', field: 'date' },
                    { title: 'User', field: 'user' },
                    { title: 'Due', field: 'dueWeeks' },
                    { title: 'Description', field: 'description' },
                ]}
                data={historyLog}
                options={{
                    search: false,
                    pageSize: 5,
                    pageSizeOptions: [5, 10, 50, 100],
                    padding: 'dense',
                    showTitle: false,
                    draggable: false,
                    selection: false,
                    emptyRowsWhenPaging: false,
                    filtering: true,
                    headerStyle: {
                        backgroundColor: tokens.colors.interactive.table__header__fill_resting.rgba
                    },
                }}
                style={{ boxShadow: 'none' }}
            />

        </Container>
    );
};

export default HistoryTab; 
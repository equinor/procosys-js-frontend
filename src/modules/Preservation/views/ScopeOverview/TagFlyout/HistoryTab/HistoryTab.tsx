/* eslint-disable @typescript-eslint/ban-ts-ignore */
import React, { useState, useEffect } from 'react';
import { showSnackbarNotification } from '../../../../../../core/services/NotificationService';
import { usePreservationContext } from '../../../../context/PreservationContext';
import { Canceler } from 'axios';
import Spinner from '@procosys/components/Spinner';
import { Container } from './HistoryTab.style';
import Table from '../../../../../../components/Table';
import { tokens } from '@equinor/eds-tokens';
import { getFormattedDate } from '@procosys/core/services/DateService';
import EdsIcon from '@procosys/components/EdsIcon';

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
    preservationRecordId: number;
}

interface HistoryLogTableItem extends HistoryLogItem {
    createdAtFormatted: string;
    createdByFullName: string;
}

interface HistoryTabProps {
    tagId: number;
}

const HistoryTab = ({
    tagId
}: HistoryTabProps): JSX.Element => {

    const { apiClient } = usePreservationContext();
    const [historyLog, setHistoryLog] = useState<HistoryLogTableItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const getHistoryLog = (): Canceler | null => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            try {
                if (tagId != null) {
                    setIsLoading(true);
                    const historyLog = await apiClient.getHistory(tagId, (cancel: Canceler) => requestCancellor = cancel);
                    const historyTableItems: HistoryLogTableItem[] = [];

                    historyLog.forEach(history => {
                        historyTableItems.push({
                            ...history,
                            createdAtFormatted: getFormattedDate(history.createdAtUtc),
                            createdByFullName: `${history.createdBy.firstName} ${history.createdBy.lastName}`
                        });
                    });

                    setHistoryLog(historyTableItems);
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

    const getInformationIcon = (historyItem: HistoryLogTableItem): JSX.Element => {
        if (historyItem.eventType === 'RequirementPreserved') {
            return <EdsIcon name='info_circle' size={24} />;
        }

        return <div></div>;
    };

    if (isLoading) {
        return (
            <div style={{ margin: 'calc(var(--grid-unit) * 5) auto' }}><Spinner large /></div>
        );
    }
    return (
        <Container>
            <Table
                columns={[
                    // @ts-ignore
                    { title: 'Date', field: 'createdAtFormatted', width: '5%', cellStyle: {paddingLeft: 'var(--grid-unit)', paddingRight: 'var(--grid-unit)'} },
                    // @ts-ignore
                    { title: 'User', field: 'createdByFullName', width: '20%', cellStyle: {paddingLeft: 'var(--grid-unit)', paddingRight: 'var(--grid-unit)'} },
                    // @ts-ignore
                    { title: 'Due', field: 'dueWeeks', width: '1%', cellStyle: {paddingLeft: 'var(--grid-unit)', paddingRight: 'var(--grid-unit)'} },
                    // @ts-ignore
                    { title: 'Description', field: 'description', width: '73%', cellStyle: {paddingLeft: 'var(--grid-unit)', paddingRight: 'var(--grid-unit)'} },
                    // @ts-ignore
                    { title: '', render: getInformationIcon, width: '1%', cellStyle: {paddingLeft: 'var(--grid-unit)', paddingRight: 'var(--grid-unit)'} }
                ]}
                data={historyLog}
                options={{
                    search: false,
                    pageSize: 10,
                    pageSizeOptions: [5, 10, 50, 100],
                    padding: 'dense',
                    showTitle: false,
                    draggable: false,
                    selection: false,
                    emptyRowsWhenPaging: false,
                    filtering: false,
                    thirdSortClick: false,
                    headerStyle: {
                        backgroundColor: tokens.colors.interactive.table__header__fill_resting.rgba,
                        paddingLeft: 'var(--grid-unit)',
                        paddingRight: 'var(--grid-unit)'
                    },
                    rowStyle: { 
                        verticalAlign: 'top'
                    }
                }}
                components={{
                    Toolbar: (): any => (
                        <></>
                    )
                }}
                style={{ boxShadow: 'none' }}
            />
        </Container>
    );
};

export default HistoryTab; 
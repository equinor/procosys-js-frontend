/* eslint-disable @typescript-eslint/ban-ts-ignore */
import React, { useState, useEffect } from 'react';
import { showSnackbarNotification } from '../../../../../../core/services/NotificationService';
import { usePreservationContext } from '../../../../context/PreservationContext';
import { Canceler } from 'axios';
import Spinner from '@procosys/components/Spinner';
import { Container, DetailsContainer, DueContainer } from './HistoryTab.style';
import Table from '../../../../../../components/Table';
import { tokens } from '@equinor/eds-tokens';
import { getFormattedDate } from '@procosys/core/services/DateService';
import EdsIcon from '@procosys/components/EdsIcon';
import { Tooltip } from '@material-ui/core';
import HistoryDetails from './HistoryDetails';
import PreservedRequirement from './PreservedRequirement';

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

    const getDateColumn = (historyItem: HistoryLogItem): JSX.Element => {
        return (
            <DueContainer isOverdue={historyItem.dueWeeks < 0}>
                {getFormattedDate(historyItem.createdAtUtc)}
            </DueContainer>
        );
    };

    const getUserColumn = (historyItem: HistoryLogItem): JSX.Element => {
        return (
            <div>
                {`${historyItem.createdBy.firstName} ${historyItem.createdBy.lastName}`}
            </div>
        );
    };

    const getDueColumn = (historyItem: HistoryLogItem): JSX.Element => {
        return (
            <DueContainer isOverdue={historyItem.dueWeeks < 0}>
                {historyItem.dueWeeks}
            </DueContainer>
        );
    };

    const getDetailsColumn = (historyItem: HistoryLogItem): JSX.Element => {
        if (historyItem.eventType === 'RequirementPreserved') {
            return (
                <Tooltip title={'Show details'} arrow={true} enterDelay={200} enterNextDelay={100}>
                    <DetailsContainer onClick={(): void => showHistoryDetails(historyItem)}>
                        <EdsIcon name='info_circle' size={24} />
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

    return (
        <>
            <Container>
                <Table
                    columns={[
                    // @ts-ignore
                        { title: 'Date', render: getDateColumn, width: '5%', cellStyle: {paddingLeft: 'var(--grid-unit)', paddingRight: 'var(--grid-unit)'} },
                        // @ts-ignore
                        { title: 'User', render: getUserColumn, width: '20%', cellStyle: {paddingLeft: 'var(--grid-unit)', paddingRight: 'var(--grid-unit)'} },
                        // @ts-ignore
                        { title: 'Due', render: getDueColumn, width: '1%', cellStyle: {paddingLeft: 'var(--grid-unit)', paddingRight: 'var(--grid-unit)'} },
                        // @ts-ignore
                        { title: 'Description', field: 'description', width: '73%', cellStyle: {paddingLeft: 'var(--grid-unit)', paddingRight: 'var(--grid-unit)'} },
                        // @ts-ignore
                        { title: '', render: getDetailsColumn, width: '1%', cellStyle: {paddingLeft: 'var(--grid-unit)', paddingRight: 'var(--grid-unit)'} }
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
            {
                showRequirementDialog && (
                    <HistoryDetails close={(): void => closeHistoryDetails()}>
                        {
                            selectedHistoryItem && (
                                <PreservedRequirement 
                                    tagId={tagId}
                                    requirementId={selectedHistoryItem.tagRequirementId}
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

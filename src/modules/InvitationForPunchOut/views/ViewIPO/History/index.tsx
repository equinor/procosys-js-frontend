import { Container, FormContainer, HistoryTable, SpinnerContainer } from './index.style';
import React, { useEffect, useState } from 'react';

import { Canceler } from '@procosys/http/HttpClient';
import { History } from '../types';
import Spinner from '@procosys/components/Spinner';
import { Table } from '@equinor/eds-core-react';
import { Typography } from '@equinor/eds-core-react';
import { format } from 'date-fns';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { useInvitationForPunchOutContext } from '@procosys/modules/InvitationForPunchOut/context/InvitationForPunchOutContext';

const { Head, Body, Cell, Row } = Table;


interface HistoryProps {
    ipoId: number;
}

const History = ({ ipoId }: HistoryProps): JSX.Element => {
    const [history, setHistory] = useState<History[]>([]);
    const { apiClient } = useInvitationForPunchOutContext();
    const [loading, setLoading] = useState<boolean>(false);

    const getHistory = async (requestCanceller?: (cancelCallback: Canceler) => void): Promise<void> => {
        try {
            const response = await apiClient.getHistory(ipoId, requestCanceller);
            setHistory(response);
        } catch (error) {
            console.error(error.message, error.data);
            showSnackbarNotification(error.message);
        }
    };


    useEffect(() => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            setLoading(true);
            await getHistory((cancel: Canceler) => { requestCancellor = cancel; });
            setLoading(false);
        })();
        return (): void => {
            requestCancellor && requestCancellor();
        };
    }, []);


    return (
        <Container>
            {loading && (
                <SpinnerContainer>
                    <Spinner large />
                </SpinnerContainer>
            )}
            <FormContainer>
                <HistoryTable>
                    <Head>
                        <Row>
                            <Cell as="th" scope="col" style={{verticalAlign: 'middle'}} width="10%">Date</Cell>
                            <Cell as="th" scope="col" style={{verticalAlign: 'middle'}} width="10%">Changed by</Cell>
                            <Cell as="th" scope="col" style={{verticalAlign: 'middle'}} width="10%">Event type</Cell>
                            <Cell as="th" scope="col" style={{verticalAlign: 'middle'}}>Description</Cell>
                        </Row>
                    </Head>
                    <Body>
                        {history && history.length > 0 ? history.map((historyItem) => (
                            <Row key={historyItem.id}>
                                <Cell as="td" style={{verticalAlign: 'middle', lineHeight: '1em'}}>
                                    <Typography variant="body_short">{format(new Date(historyItem.createdAtUtc), 'dd/MM/yyyy HH:mm')}</Typography>
                                </Cell>
                                <Cell as="td" style={{verticalAlign: 'middle', lineHeight: '1em'}}>
                                    <Typography variant="body_short">{`${historyItem.createdBy.firstName} ${historyItem.createdBy.lastName}`}</Typography>
                                </Cell>
                                <Cell as="td" style={{verticalAlign: 'middle', lineHeight: '1em'}}>
                                    <Typography variant="body_short">{`${historyItem.eventType}`}</Typography>
                                </Cell>
                                <Cell as="td" style={{verticalAlign: 'middle', lineHeight: '1em'}}>
                                    <Typography variant="body_short">{`${historyItem.description}`}</Typography>
                                </Cell>
                            </Row>
                        )) : (
                            <Row>
                                <Cell style={{verticalAlign: 'middle', width: '100%'}}><Typography style={{textAlign: 'center'}} variant="body_short">No records to display</Typography></Cell>
                            </Row>
                        )}
                    </Body>

                </HistoryTable>
            </FormContainer>
        </Container>);
};

export default History;


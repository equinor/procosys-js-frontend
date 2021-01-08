import { Container, FormContainer, HistoryTable, SpinnerContainer } from './index.style';
import React, { useEffect, useState } from 'react';

import { Canceler } from '@procosys/http/HttpClient';
import { HistoryItem } from '../types';
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
    const [history, setHistory] = useState<HistoryItem[]>([]);
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
            {loading ? (
                <SpinnerContainer>
                    <Spinner large />
                </SpinnerContainer>
            ) : (
                <FormContainer>
                    <HistoryTable>
                        <Head>
                            <Row>
                                <Cell as="th" scope="col" style={{verticalAlign: 'middle'}} width="12%">Date</Cell>
                                <Cell as="th" scope="col" style={{verticalAlign: 'middle'}} width="12%">Changed by</Cell>
                                <Cell as="th" scope="col" style={{verticalAlign: 'middle'}}>Description</Cell>
                            </Row>
                        </Head>
                        <Body>
                            {history && history.length > 0 ? history.map((historyItem) => (
                                <Row key={historyItem.id}>
                                    <Cell as="td" style={{verticalAlign: 'middle', lineHeight: '1em'}}>
                                        {format(new Date(historyItem.createdAtUtc), 'dd/MM/yyyy HH:mm')}
                                    </Cell>
                                    <Cell as="td" style={{verticalAlign: 'middle', lineHeight: '1em'}}>
                                        {`${historyItem.createdBy.userName}`}
                                    </Cell>
                                    <Cell as="td" style={{verticalAlign: 'middle', lineHeight: '1em'}}>
                                        {`${historyItem.description}`}
                                    </Cell>
                                </Row>
                            )) : (
                                <Row>
                                    <Cell colSpan={4} tyle={{verticalAlign: 'middle', width: '100%'}}><Typography style={{textAlign: 'center'}} variant="body_short">No records to display</Typography></Cell>
                                </Row>
                            )}
                        </Body>

                    </HistoryTable>
                </FormContainer>
            )}
        </Container>);
};

export default History;


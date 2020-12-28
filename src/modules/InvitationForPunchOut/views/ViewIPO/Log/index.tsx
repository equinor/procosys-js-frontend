import { Container, FormContainer, LogsTable, SpinnerContainer } from './index.style';
import React, { useEffect, useState } from 'react';
import { Log } from '../types';

import { Canceler } from '@procosys/http/HttpClient';
import Spinner from '@procosys/components/Spinner';
import { Table } from '@equinor/eds-core-react';
import { Typography } from '@equinor/eds-core-react';
import { format } from 'date-fns';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { useInvitationForPunchOutContext } from '@procosys/modules/InvitationForPunchOut/context/InvitationForPunchOutContext';

const { Head, Body, Cell, Row } = Table;


interface LogProps {
    ipoId: number;
}

const Log = ({ ipoId }: LogProps): JSX.Element => {
    const [logs, setLogs] = useState<Log[]>([]);
    const { apiClient } = useInvitationForPunchOutContext();
    const [loading, setLoading] = useState<boolean>(false);

    const getLogs = async (requestCanceller?: (cancelCallback: Canceler) => void): Promise<void> => {
        try {
            const response = await apiClient.getLogs(ipoId, requestCanceller);
            setLogs(response);
        } catch (error) {
            console.error(error.message, error.data);
            showSnackbarNotification(error.message);
        }
    };


    useEffect(() => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            setLoading(true);
            await getLogs((cancel: Canceler) => { requestCancellor = cancel; });
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
                <LogsTable>
                    <Head>
                        <Row>
                            <Cell as="th" scope="col" style={{verticalAlign: 'middle'}} width="10%">Date</Cell>
                            <Cell as="th" scope="col" style={{verticalAlign: 'middle'}} width="10%">Changed by</Cell>
                            <Cell as="th" scope="col" style={{verticalAlign: 'middle'}} width="10%">Event type</Cell>
                            <Cell as="th" scope="col" style={{verticalAlign: 'middle'}}>Description</Cell>
                        </Row>
                    </Head>
                    <Body>
                        {logs && logs.length > 0 ? logs.map((logItem) => (
                            <Row key={logItem.id}>
                                <Cell as="td" style={{verticalAlign: 'middle', lineHeight: '1em'}}>
                                    <Typography variant="body_short">{format(new Date(logItem.createdAtUtc), 'dd/MM/yyyy HH:mm')}</Typography>
                                </Cell>
                                <Cell as="td" style={{verticalAlign: 'middle', lineHeight: '1em'}}>
                                    <Typography variant="body_short">{`${logItem.createdBy.firstName} ${logItem.createdBy.lastName}`}</Typography>
                                </Cell>
                                <Cell as="td" style={{verticalAlign: 'middle', lineHeight: '1em'}}>
                                    <Typography variant="body_short">{`${logItem.eventType}`}</Typography>
                                </Cell>
                                <Cell as="td" style={{verticalAlign: 'middle', lineHeight: '1em'}}>
                                    <Typography variant="body_short">{`${logItem.description}`}</Typography>
                                </Cell>
                            </Row>
                        )) : (
                            <Row>
                                <Cell style={{verticalAlign: 'middle', width: '100%'}}><Typography style={{textAlign: 'center'}} variant="body_short">No records to display</Typography></Cell>
                            </Row>
                        )}
                    </Body>

                </LogsTable>
            </FormContainer>
        </Container>);
};

export default Log;


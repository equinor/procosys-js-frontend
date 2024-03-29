import {
    Container,
    FormContainer,
    HistoryTable,
    SpinnerContainer,
} from './index.style';
import React, { useEffect, useState } from 'react';

import { Canceler } from '@procosys/http/HttpClient';
import { HistoryItem } from '../types';
import Spinner from '@procosys/components/Spinner';
import { Table } from '@equinor/eds-core-react';
import { Typography } from '@equinor/eds-core-react';
import { getFormattedDateAndTime } from '@procosys/core/services/DateService';
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

    const getHistory = async (
        requestCanceller?: (cancelCallback: Canceler) => void
    ): Promise<void> => {
        try {
            const response = await apiClient.getHistory(
                ipoId,
                requestCanceller
            );
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
            await getHistory((cancel: Canceler) => {
                requestCancellor = cancel;
            });
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
                                <Cell
                                    as="th"
                                    scope="col"
                                    style={{ verticalAlign: 'middle' }}
                                    width="160px"
                                >
                                    Date
                                </Cell>
                                <Cell
                                    as="th"
                                    scope="col"
                                    style={{ verticalAlign: 'middle' }}
                                    width="90px"
                                >
                                    Changed by
                                </Cell>
                                <Cell
                                    as="th"
                                    scope="col"
                                    style={{ verticalAlign: 'middle' }}
                                >
                                    Description
                                </Cell>
                            </Row>
                        </Head>
                        <Body>
                            {history && history.length > 0 ? (
                                history.map((historyItem) => (
                                    <Row key={historyItem.id}>
                                        <Cell
                                            as="td"
                                            style={{
                                                verticalAlign: 'middle',
                                                lineHeight: '1em',
                                            }}
                                        >
                                            <Typography variant="body_short">
                                                {getFormattedDateAndTime(
                                                    new Date(
                                                        historyItem.createdAtUtc
                                                    )
                                                )}
                                            </Typography>
                                        </Cell>
                                        <Cell
                                            as="td"
                                            style={{
                                                verticalAlign: 'middle',
                                                lineHeight: '1em',
                                            }}
                                        >
                                            <Typography variant="body_short">
                                                {`${historyItem.createdBy.userName}`}
                                            </Typography>
                                        </Cell>
                                        <Cell
                                            as="td"
                                            style={{
                                                verticalAlign: 'middle',
                                                lineHeight: '1em',
                                            }}
                                        >
                                            <Typography variant="body_short">
                                                {`${historyItem.description}`}
                                            </Typography>
                                        </Cell>
                                    </Row>
                                ))
                            ) : (
                                <Row>
                                    <Cell
                                        colSpan={4}
                                        tyle={{
                                            verticalAlign: 'middle',
                                            width: '100%',
                                        }}
                                    >
                                        <Typography
                                            style={{ textAlign: 'center' }}
                                            variant="body_short"
                                        >
                                            No records to display
                                        </Typography>
                                    </Cell>
                                </Row>
                            )}
                        </Body>
                    </HistoryTable>
                </FormContainer>
            )}
        </Container>
    );
};

export default History;

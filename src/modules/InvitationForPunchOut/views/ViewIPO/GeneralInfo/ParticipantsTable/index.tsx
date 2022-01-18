import { Button, Switch, TextField } from '@equinor/eds-core-react';
import {
    ComponentName,
    IpoStatusEnum,
    OrganizationsEnum,
} from '../../../enums';
import {
    Container,
    CustomTable,
    ResponseWrapper,
    SpinnerContainer,
} from './style';
import { ExternalEmail, FunctionalRole, Participant } from '../../types';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import CustomPopover from './CustomPopover';
import CustomTooltip from './CustomTooltip';
import { Organization } from '../../../../types';
import { OrganizationMap } from '../../../utils';
import { OutlookResponseType } from '../../enums';
import Spinner from '@procosys/components/Spinner';
import { Table } from '@equinor/eds-core-react';
import { Typography } from '@equinor/eds-core-react';
import { getFormattedDateAndTime } from '@procosys/core/services/DateService';
import { useDirtyContext } from '@procosys/core/DirtyContext';
import SignatureButtons from './Buttons/SignatureButtons';

export type AttNoteData = {
    id: number;
    attended: boolean;
    note: string;
    rowVersion: string;
};

interface ParticipantsTableProps {
    participants: Participant[];
    status: string;
    complete: (p: Participant, attNoteData: AttNoteData[]) => Promise<any>;
    accept: (p: Participant, attNoteData: AttNoteData[]) => Promise<any>;
    update: (attNoteData: AttNoteData[]) => Promise<any>;
    sign: (p: Participant) => Promise<any>;
    unaccept: (p: Participant) => Promise<any>;
    uncomplete: (p: Participant) => Promise<any>;
    unsign: (p: Participant) => Promise<any>;
}

const ParticipantsTable = ({
    participants,
    status,
    complete,
    accept,
    update,
    sign,
    unaccept,
    uncomplete,
    unsign,
}: ParticipantsTableProps): JSX.Element => {
    const [loading, setLoading] = useState<boolean>(false);
    const [editAttendedDisabled, setEditAttendedDisabled] =
        useState<boolean>(true);
    const [editNotesDisabled, setEditNotesDisabled] = useState<boolean>(true);
    const [attNoteData, setAttNoteData] = useState<AttNoteData[]>([]);
    const [cleanData, setCleanData] = useState<AttNoteData[]>([]);
    const [canUpdate, setCanUpdate] = useState<boolean>(false);
    const { setDirtyStateFor, unsetDirtyStateFor } = useDirtyContext();

    useEffect(() => {
        const participant = participants.find((p) => p.canSign);
        if (
            participant &&
            participant.sortKey === 0 &&
            (status === IpoStatusEnum.PLANNED ||
                status === IpoStatusEnum.COMPLETED)
        ) {
            setEditAttendedDisabled(false);
            setEditNotesDisabled(false);
        } else if (
            participant &&
            participant.sortKey === 1 &&
            status === IpoStatusEnum.COMPLETED
        ) {
            setEditNotesDisabled(false);
        } else {
            setEditAttendedDisabled(true);
            setEditNotesDisabled(true);
        }
    }, [participants, status]);

    useEffect(() => {
        if (JSON.stringify(attNoteData) !== JSON.stringify(cleanData)) {
            setDirtyStateFor(ComponentName.ParticipantsTable);
            setCanUpdate(true);
        } else {
            unsetDirtyStateFor(ComponentName.ParticipantsTable);
            setCanUpdate(false);
        }
    }, [attNoteData]);

    useEffect(() => {
        const newCleanData = participants.map((participant) => {
            const x = participant.person
                ? participant.person
                : participant.functionalRole
                ? participant.functionalRole
                : participant.externalEmail;
            const attendedStatus =
                status === IpoStatusEnum.PLANNED
                    ? participant.person
                        ? participant.person.response
                            ? participant.person.response ===
                              OutlookResponseType.ATTENDING
                            : false
                        : (x as FunctionalRole | ExternalEmail).response
                        ? (x as FunctionalRole | ExternalEmail).response ===
                          OutlookResponseType.ATTENDING
                        : false
                    : participant.attended;

            return {
                id: x.id,
                attended: attendedStatus,
                note: participant.note ? participant.note : '',
                rowVersion: participant.rowVersion,
            };
        });
        setCleanData(newCleanData);
        setAttNoteData(newCleanData);
    }, [participants]);

    const getSignatureButton = useCallback(
        (
            participant: Participant,
            status: string,
            canUpdate: boolean,
            attNoteData: AttNoteData[],
            loading: boolean
        ): JSX.Element => (
            <SignatureButtons
                participant={participant}
                status={status}
                attNoteData={attNoteData}
                loading={loading}
                setLoading={setLoading}
                unsetDirtyStateFor={unsetDirtyStateFor}
                complete={complete}
                accept={accept}
                update={update}
                sign={sign}
                unaccept={unaccept}
                uncomplete={uncomplete}
                unsign={unsign}
                canUpdate={canUpdate}
            />
        ),
        [status]
    );

    const handleEditAttended = (id: number): void => {
        const updateData = [...attNoteData];
        const index = updateData.findIndex((x) => x.id === id);
        updateData[index] = {
            ...updateData[index],
            attended: !updateData[index].attended,
        };
        setAttNoteData([...updateData]);
    };

    const handleEditNotes = (event: any, id: number): void => {
        event.preventDefault();
        const updateData = [...attNoteData];
        const index = updateData.findIndex((x) => x.id === id);
        updateData[index] = { ...updateData[index], note: event.target.value };
        setAttNoteData([...updateData]);
    };

    const getOrganizationText = (
        organization: string,
        sortKey: number
    ): string | undefined => {
        let organizationText = OrganizationMap.get(
            organization as Organization
        );
        const organizationIsContractorOrConstructionCompany =
            organization === OrganizationsEnum.Contractor ||
            organization === OrganizationsEnum.ConstructionCompany;
        if (sortKey > 1 && organizationIsContractorOrConstructionCompany) {
            organizationText += ' additional';
        }
        return organizationText;
    };

    return (
        <Container>
            {loading && (
                <SpinnerContainer>
                    <Spinner large />
                </SpinnerContainer>
            )}
            <CustomTable>
                <Table.Head>
                    <Table.Row>
                        <Table.Cell
                            as="th"
                            scope="col"
                            style={{ verticalAlign: 'middle' }}
                        >
                            Attendance list{' '}
                        </Table.Cell>
                        <Table.Cell
                            as="th"
                            scope="col"
                            style={{ verticalAlign: 'middle' }}
                        >
                            Representative{' '}
                        </Table.Cell>
                        <Table.Cell
                            as="th"
                            scope="col"
                            style={{ verticalAlign: 'middle' }}
                        >
                            Outlook response
                        </Table.Cell>
                        <Table.Cell
                            as="th"
                            scope="col"
                            style={{ verticalAlign: 'middle' }}
                        >
                            Attended
                        </Table.Cell>
                        <Table.Cell
                            as="th"
                            scope="col"
                            style={{ verticalAlign: 'middle' }}
                        >
                            Notes
                        </Table.Cell>
                        <Table.Cell
                            as="th"
                            scope="col"
                            style={{ verticalAlign: 'middle' }}
                        ></Table.Cell>
                        <Table.Cell
                            as="th"
                            scope="col"
                            style={{ verticalAlign: 'middle' }}
                        >
                            Signed by
                        </Table.Cell>
                        <Table.Cell
                            as="th"
                            scope="col"
                            style={{ verticalAlign: 'middle' }}
                        >
                            Signed at
                        </Table.Cell>
                    </Table.Row>
                </Table.Head>
                <Table.Body>
                    {participants.map(
                        (participant: Participant, index: number) => {
                            const representative = participant.person
                                ? `${participant.person.firstName} ${participant.person.lastName}`
                                : participant.functionalRole
                                ? participant.functionalRole.code
                                : participant.externalEmail.externalEmail;

                            const response = participant.person
                                ? participant.person.response
                                    ? participant.person.response
                                    : ''
                                : participant.externalEmail
                                ? participant.externalEmail.response
                                    ? participant.externalEmail.response
                                    : ''
                                : participant.functionalRole
                                ? participant.functionalRole.response
                                    ? participant.functionalRole.response
                                    : ''
                                : '';

                            const id = participant.person
                                ? participant.person.id
                                : participant.functionalRole
                                ? participant.functionalRole.id
                                : participant.externalEmail.id;

                            const addPopover = participant.functionalRole
                                ? participant.functionalRole.response
                                    ? participant.functionalRole.persons.length
                                        ? true
                                        : false
                                    : false
                                : false;

                            return (
                                <Table.Row key={participant.sortKey} as="tr">
                                    <Table.Cell
                                        as="td"
                                        style={{ verticalAlign: 'middle' }}
                                    >
                                        <Typography variant="body_short">
                                            {getOrganizationText(
                                                participant.organization,
                                                participant.sortKey
                                            )}
                                        </Typography>
                                    </Table.Cell>
                                    <Table.Cell
                                        as="td"
                                        style={{ verticalAlign: 'middle' }}
                                    >
                                        <Typography variant="body_short">
                                            {representative}
                                        </Typography>
                                    </Table.Cell>
                                    <Table.Cell
                                        as="td"
                                        style={{ verticalAlign: 'middle' }}
                                    >
                                        <ResponseWrapper>
                                            <Typography variant="body_short">
                                                {response}
                                            </Typography>
                                            {addPopover && (
                                                <CustomPopover
                                                    participant={participant}
                                                />
                                            )}
                                        </ResponseWrapper>
                                    </Table.Cell>
                                    <Table.Cell
                                        as="td"
                                        style={{
                                            verticalAlign: 'middle',
                                            minWidth: '160px',
                                        }}
                                    >
                                        <Switch
                                            id={`attendance${id}`}
                                            disabled={editAttendedDisabled}
                                            default
                                            label={
                                                attNoteData[index]
                                                    ? attNoteData[index]
                                                          .attended
                                                        ? 'Attended'
                                                        : 'Did not attend'
                                                    : null
                                            }
                                            checked={
                                                attNoteData[index]
                                                    ? attNoteData[index]
                                                          .attended
                                                    : false
                                            }
                                            onChange={(): void =>
                                                handleEditAttended(id)
                                            }
                                        />
                                    </Table.Cell>
                                    <Table.Cell
                                        as="td"
                                        style={{
                                            verticalAlign: 'middle',
                                            width: '40%',
                                            minWidth: '200px',
                                        }}
                                    >
                                        <TextField
                                            id={`textfield${id}`}
                                            disabled={editNotesDisabled}
                                            defaultValue={
                                                participant.note
                                                    ? participant.note
                                                    : ''
                                            }
                                            onChange={(e: any): void =>
                                                handleEditNotes(e, id)
                                            }
                                        />
                                    </Table.Cell>
                                    <Table.Cell
                                        as="td"
                                        style={{
                                            verticalAlign: 'middle',
                                            minWidth: '160px',
                                        }}
                                    >
                                        <Typography variant="body_short">
                                            {getSignatureButton(
                                                participant,
                                                status,
                                                canUpdate,
                                                attNoteData,
                                                loading
                                            )}
                                        </Typography>
                                    </Table.Cell>
                                    <Table.Cell
                                        as="td"
                                        style={{
                                            verticalAlign: 'middle',
                                            minWidth: '160px',
                                        }}
                                    >
                                        <Typography variant="body_short">
                                            <span>
                                                {participant.signedBy
                                                    ? `${participant.signedBy.userName}`
                                                    : ''}
                                            </span>
                                        </Typography>
                                    </Table.Cell>
                                    <Table.Cell
                                        as="td"
                                        style={{
                                            verticalAlign: 'middle',
                                            minWidth: '150px',
                                        }}
                                    >
                                        <Typography variant="body_short">
                                            {participant.signedAtUtc
                                                ? `${getFormattedDateAndTime(
                                                      new Date(
                                                          participant.signedAtUtc
                                                      )
                                                  )}`
                                                : '-'}
                                        </Typography>
                                    </Table.Cell>
                                </Table.Row>
                            );
                        }
                    )}
                </Table.Body>
            </CustomTable>
        </Container>
    );
};

export default ParticipantsTable;

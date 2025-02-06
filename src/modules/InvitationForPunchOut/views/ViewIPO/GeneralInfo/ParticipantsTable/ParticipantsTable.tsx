import { Switch, TextField } from '@equinor/eds-core-react';
import { OrganizationsEnum } from '../../../enums';
import {
    Container,
    CustomTable,
    ResponseWrapper,
    SpinnerContainer,
} from './ParticipantsTable.style';
import { Participant } from '../../types';
import React, { useCallback, useEffect, useState } from 'react';
import CustomPopover from './CustomPopover/CustomPopover';
import { Organization } from '../../../../types';
import { OrganizationMap } from '../../../utils';
import { OutlookResponseType } from '../../enums';
import Spinner from '@procosys/components/Spinner';
import { Table } from '@equinor/eds-core-react';
import { Typography } from '@equinor/eds-core-react';
import { getFormattedDateAndTime } from '@procosys/core/services/DateService';
import SignatureButtons from './Buttons/SignatureButtons';
import {
    AttendedStatusDto,
    NotesDto,
} from '@procosys/modules/InvitationForPunchOut/http/InvitationForPunchOutApiClient';

export type AttNoteData = {
    id: number;
    attended: boolean;
    note: string;
    rowVersion: string;
};

interface ParticipantsTableProps {
    participants: Participant[];
    status: string;
    complete: (p: Participant) => Promise<any>;
    accept: (p: Participant) => Promise<any>;
    sign: (p: Participant) => Promise<any>;
    unaccept: (p: Participant) => Promise<any>;
    uncomplete: (p: Participant) => Promise<any>;
    unsign: (p: Participant) => Promise<any>;
    updateAttendedStatus: (attendedStatus: AttendedStatusDto) => Promise<any>;
    updateNotes: (notes: NotesDto) => Promise<any>;
    isUsingAdminRights: boolean;
}

const ParticipantsTable = ({
    participants,
    status,
    complete,
    accept,
    sign,
    unaccept,
    uncomplete,
    unsign,
    updateAttendedStatus,
    updateNotes,
    isUsingAdminRights,
}: ParticipantsTableProps): JSX.Element => {
    const [loading, setLoading] = useState<boolean>(false);
    const [attNoteData, setAttNoteData] = useState<AttNoteData[]>([]);

    useEffect(() => {
        const newCleanData = participants.map((participant) => {
            return {
                id: participant.id,
                attended: participant.attended,
                note: participant.note ? participant.note : '',
                rowVersion: participant.rowVersion,
            };
        });
        setAttNoteData(newCleanData);
    }, [participants]);

    const getSignatureButton = useCallback(
        (
            participant: Participant,
            status: string,
            loading: boolean,
            isUsingAdminRights
        ): JSX.Element => (
            <SignatureButtons
                participant={participant}
                status={status}
                loading={loading}
                setLoading={setLoading}
                complete={complete}
                accept={accept}
                sign={sign}
                unaccept={unaccept}
                uncomplete={uncomplete}
                unsign={unsign}
                isUsingAdminRights={isUsingAdminRights}
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

    const handleEditNotesBlur = (
        id: number,
        rowVersion: string,
        note: string
    ): void => {
        const participantData = (note: string, id: number): boolean =>
            participants.some((data) => data.note === note && data.id === id);
        const exist = participantData(note, id);

        if (!exist) {
            updateNotes({
                id,
                note,
                rowVersion,
            });
        }
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
                                : participant.functionalRole?.code ||
                                  participant.externalEmail?.externalEmail ||
                                  '';

                            const response =
                                participant.person?.response ||
                                participant.externalEmail?.response ||
                                participant.functionalRole?.response ||
                                '';

                            const addPopover = !!(
                                participant.functionalRole &&
                                participant.functionalRole.response &&
                                participant.functionalRole.persons?.length
                            );

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
                                            id={`attendance${participant.id}`}
                                            disabled={
                                                !(
                                                    participant.canEditAttendedStatusAndNote ||
                                                    isUsingAdminRights
                                                )
                                            }
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
                                                    : true
                                            }
                                            onChange={(): void => {
                                                updateAttendedStatus({
                                                    id: participant.id,
                                                    attended: attNoteData[index]
                                                        ? !attNoteData[index]
                                                              .attended
                                                        : !participant.attended,
                                                    rowVersion:
                                                        participant.rowVersion,
                                                });
                                                handleEditAttended(
                                                    participant.id
                                                );
                                            }}
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
                                            id={`textfield${participant.id}`}
                                            disabled={
                                                !(
                                                    participant.canEditAttendedStatusAndNote ||
                                                    isUsingAdminRights
                                                )
                                            }
                                            defaultValue={
                                                participant.note
                                                    ? participant.note
                                                    : ''
                                            }
                                            onChange={(e: any): void =>
                                                handleEditNotes(
                                                    e,
                                                    participant.id
                                                )
                                            }
                                            onBlur={(): void =>
                                                handleEditNotesBlur(
                                                    participant.id,
                                                    participant.rowVersion,
                                                    attNoteData[index]
                                                        ? attNoteData[index]
                                                              .note
                                                        : participant.note
                                                )
                                            }
                                            multiline
                                            rows={1}
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
                                                loading,
                                                isUsingAdminRights
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
                                                    ? `${participant.signedBy.lastName}, ${participant.signedBy.firstName}`
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

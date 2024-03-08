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

    const updateParticipantNote = (
        participantId: number,
        newNote: string,
        rowVersion: string
    ) => {
        const currentParticipantNote = attNoteData.find(
            (participant) => participant.id === participantId
        );

        if (currentParticipantNote && currentParticipantNote.note === newNote) {
            return;
        }
        updateNotes({
            id: participantId,
            note: newNote,
            rowVersion: rowVersion,
        });
    };

    const TableCellTitle = [
        'Attendance list ',
        'Representative ',
        'Outlook response',
        'Attended',
        'Notes',
        '',
        'Signed by',
        'Signed at',
    ];

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
                        {TableCellTitle.map((title: string, index: number) => (
                            <Table.Cell
                                key={index}
                                as="th"
                                scope="col"
                                style={{ verticalAlign: 'middle' }}
                            >
                                {title}
                            </Table.Cell>
                        ))}
                    </Table.Row>
                </Table.Head>

                <Table.Body>
                    {participants.map((participant, index) => (
                        <ParticipantsTableRow
                            key={participant.sortKey}
                            participant={participant}
                            index={index}
                            status={status}
                            loading={loading}
                            setLoading={setLoading}
                            complete={complete}
                            accept={accept}
                            sign={sign}
                            unaccept={unaccept}
                            uncomplete={uncomplete}
                            unsign={unsign}
                            updateAttendedStatus={updateAttendedStatus}
                            updateNotes={updateNotes}
                            attNoteData={attNoteData}
                            setAttNoteData={setAttNoteData}
                            isUsingAdminRights={isUsingAdminRights}
                            updateParticipantNote={updateParticipantNote}
                        />
                    ))}
                </Table.Body>
            </CustomTable>
        </Container>
    );
};

interface ParticipantsTableRowProps {
    participant: Participant;
    index: number;
    status: string;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    complete: (p: Participant) => Promise<any>;
    accept: (p: Participant) => Promise<any>;
    sign: (p: Participant) => Promise<any>;
    unaccept: (p: Participant) => Promise<any>;
    uncomplete: (p: Participant) => Promise<any>;
    unsign: (p: Participant) => Promise<any>;
    updateAttendedStatus: (attendedStatus: AttendedStatusDto) => Promise<any>;
    updateNotes: (notes: NotesDto) => Promise<any>;
    attNoteData: AttNoteData[];
    setAttNoteData: React.Dispatch<React.SetStateAction<AttNoteData[]>>;
    isUsingAdminRights: boolean;
    updateParticipantNote: (
        participantId: number,
        newNote: string,
        rowVersion: string
    ) => void;
}

const ParticipantsTableRow: React.FC<ParticipantsTableRowProps> = ({
    participant,
    index,
    status,
    loading,
    setLoading,
    complete,
    accept,
    sign,
    unaccept,
    uncomplete,
    unsign,
    updateAttendedStatus,
    updateNotes,
    attNoteData,
    setAttNoteData,
    isUsingAdminRights,
    updateParticipantNote,
}) => {
    const handleEditAttended = (id: number) => {
        setAttNoteData((prevData) =>
            prevData.map((data) =>
                data.id === id ? { ...data, attended: !data.attended } : data
            )
        );
    };

    const handleEditNotes = (
        event: React.ChangeEvent<HTMLInputElement>,
        id: number
    ) => {
        event.preventDefault();
        const newNote = event.target.value;
        setAttNoteData((prevData) =>
            prevData.map((data) =>
                data.id === id ? { ...data, note: newNote } : data
            )
        );
    };

    const representative = participant.person
        ? `${participant.person.firstName} ${participant.person.lastName}`
        : participant.functionalRole
          ? participant.functionalRole.code
          : participant.externalEmail.externalEmail;

    const response = participant.person
        ? participant.person.response || ''
        : participant.externalEmail
          ? participant.externalEmail.response || ''
          : participant.functionalRole
            ? participant.functionalRole.response || ''
            : '';

    const addPopover = participant.functionalRole
        ? participant.functionalRole.response
            ? participant.functionalRole.persons.length > 0
            : false
        : false;

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

    const handleEditNotesBlur = (id: number, newNote: string) => {
        const participantData = attNoteData.find((data) => data.id === id);
        if (participantData && participantData.note !== newNote) {
            updateParticipantNote(id, newNote, participantData.rowVersion);
        }
    };

    return (
        <Table.Row as="tr">
            <Table.Cell as="td" style={{ verticalAlign: 'middle' }}>
                <Typography variant="body_short">
                    {getOrganizationText(
                        participant.organization,
                        participant.sortKey
                    )}
                </Typography>
            </Table.Cell>
            <Table.Cell as="td" style={{ verticalAlign: 'middle' }}>
                <Typography variant="body_short">{representative}</Typography>
            </Table.Cell>
            <Table.Cell as="td" style={{ verticalAlign: 'middle' }}>
                <ResponseWrapper>
                    <Typography variant="body_short">{response}</Typography>
                    {addPopover && <CustomPopover participant={participant} />}
                </ResponseWrapper>
            </Table.Cell>
            <Table.Cell
                as="td"
                style={{ verticalAlign: 'middle', minWidth: '160px' }}
            >
                <Switch
                    id={`attendance${participant.id}`}
                    disabled={
                        !participant.canEditAttendedStatusAndNote &&
                        !isUsingAdminRights
                    }
                    label={
                        attNoteData[index]?.attended
                            ? 'Attended'
                            : 'Did not attend'
                    }
                    checked={attNoteData[index]?.attended ?? true}
                    onChange={() => {
                        updateAttendedStatus({
                            id: participant.id,
                            attended: !attNoteData[index]?.attended,
                            rowVersion: participant.rowVersion,
                        });
                        handleEditAttended(participant.id);
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
                        !participant.canEditAttendedStatusAndNote &&
                        !isUsingAdminRights
                    }
                    defaultValue={participant.note || ''}
                    onChange={(e: any) => handleEditNotes(e, participant.id)}
                    onBlur={(e: any) =>
                        handleEditNotesBlur(participant.id, e.target.value)
                    }
                />
            </Table.Cell>
            <Table.Cell
                as="td"
                style={{ verticalAlign: 'middle', minWidth: '160px' }}
            >
                {getSignatureButton(
                    participant,
                    status,
                    loading,
                    isUsingAdminRights
                )}
            </Table.Cell>
            <Table.Cell
                as="td"
                style={{ verticalAlign: 'middle', minWidth: '160px' }}
            >
                <Typography variant="body_short">
                    {participant.signedBy
                        ? `${participant.signedBy.lastName}, ${participant.signedBy.firstName}`
                        : ''}
                </Typography>
            </Table.Cell>

            <Table.Cell
                as="td"
                style={{ verticalAlign: 'middle', minWidth: '150px' }}
            >
                <Typography variant="body_short">
                    {participant.signedAtUtc
                        ? getFormattedDateAndTime(
                              new Date(participant.signedAtUtc)
                          )
                        : '-'}
                </Typography>
            </Table.Cell>
        </Table.Row>
    );
};

export default ParticipantsTable;

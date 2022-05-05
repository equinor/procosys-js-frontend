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
    complete: (p: Participant, attNoteData: AttNoteData[]) => Promise<any>;
    accept: (p: Participant, attNoteData: AttNoteData[]) => Promise<any>;
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
    const [cleanData, setCleanData] = useState<AttNoteData[]>([]);
    const [canUpdate, setCanUpdate] = useState<boolean>(false);
    const { setDirtyStateFor, unsetDirtyStateFor } = useDirtyContext();

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

            // TODO: change attendedStatus once backend is fixed
            const attendedStatus = participant.attended
                ? participant.attended
                : participant.person
                ? participant.person.response
                    ? participant.person.response ===
                          OutlookResponseType.ATTENDING ||
                      participant.person.response ===
                          OutlookResponseType.ORGANIZER
                    : participant.attended
                : (x as FunctionalRole | ExternalEmail).response
                ? (x as FunctionalRole | ExternalEmail).response ===
                      OutlookResponseType.ATTENDING ||
                  (x as FunctionalRole | ExternalEmail).response ===
                      OutlookResponseType.ORGANIZER
                : participant.attended;

            return {
                id: participant.id,
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
            loading: boolean,
            isUsingAdminRights
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
                sign={sign}
                unaccept={unaccept}
                uncomplete={uncomplete}
                unsign={unsign}
                canUpdate={canUpdate}
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

                            // TODO: may need to use ID of person in func. role.
                            // const id = participant.person
                            //     ? participant.person
                            //     : participant.functionalRole
                            //     ? participant.functionalRole.id
                            //     : participant.externalEmail.id;

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
                                            onBlur={(): void => {
                                                updateNotes({
                                                    id: participant.id,
                                                    note: attNoteData[index]
                                                        ? attNoteData[index]
                                                              .note
                                                        : participant.note,
                                                    rowVersion:
                                                        participant.rowVersion,
                                                });
                                            }}
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

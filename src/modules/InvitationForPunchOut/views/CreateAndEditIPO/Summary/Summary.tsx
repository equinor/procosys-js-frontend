import {
    Attachment,
    CommPkgRow,
    GeneralInfoDetails,
    Participant,
    Person,
} from '@procosys/modules/InvitationForPunchOut/types';
import {
    Container,
    FormContainer,
    Section,
    Subsection,
    TableSection,
    Column,
    LocationDetails,
} from './Summary.style';
import { Table, Typography } from '@equinor/eds-core-react';
import { getFileName, getFileTypeIconName } from '../../utils';
import {
    getFormattedDate,
    getFormattedTime,
} from '@procosys/core/services/DateService';

import CommPkgsTable from '../../ViewIPO/Scope/CommPkgsTable';
import EdsIcon from '@procosys/components/EdsIcon';
import { McPkgScope } from '../../ViewIPO/types';
import McPkgsTable from '../../ViewIPO/Scope/McPkgsTable';
import React from 'react';
import ReportsTable from '../../ViewIPO/Scope/ReportsTable';
import { getAttachmentDownloadLink } from '../utils';
import Checkbox from '@procosys/components/Checkbox';

const { Body, Row, Cell, Head } = Table;

interface SummaryProps {
    generalInfo: GeneralInfoDetails;
    mcPkgScope: McPkgScope[];
    commPkgScope: CommPkgRow[];
    participants: Participant[];
    attachments: Attachment[];
}

const Summary = ({
    generalInfo,
    mcPkgScope,
    commPkgScope,
    participants,
    attachments,
}: SummaryProps): JSX.Element => {
    const getNotifiedPersons = (persons: Person[], value: string): string => {
        const filtered = persons.filter(
            (p) => p.radioOption == value.toLocaleLowerCase()
        );
        let notifyString = '';
        if (filtered.length > 0) {
            notifyString += value + ': ';
            filtered.forEach((t, i) => {
                notifyString += t.name;
                if (i < filtered.length - 1) {
                    notifyString += ', ';
                }
            });
        }
        return notifyString;
    };

    const getParticipants = (
        participant: Participant,
        index: number
    ): JSX.Element => {
        return (
            <Row key={index}>
                <Cell>{participant.organization.text}</Cell>
                {participant.role && (
                    <Cell>
                        <div>
                            {participant.role.code +
                                ' - ' +
                                participant.role.description}
                        </div>
                        {!participant.role.usePersonalEmail && (
                            <>
                                <div style={{ fontSize: '12px' }}>
                                    {getNotifiedPersons(
                                        participant.role.persons,
                                        'To'
                                    )}
                                </div>
                                <div style={{ fontSize: '12px' }}>
                                    {getNotifiedPersons(
                                        participant.role.persons,
                                        'CC'
                                    )}
                                </div>
                            </>
                        )}
                    </Cell>
                )}
                {participant.person && <Cell>{participant.person.name}</Cell>}
                {participant.externalEmail && (
                    <Cell>{participant.externalEmail.email}</Cell>
                )}
            </Row>
        );
    };

    const attachmentList = attachments
        .filter((attachment) => !attachment.toBeDeleted)
        .map((attachment, index) => {
            const link = getAttachmentDownloadLink(attachment);

            return (
                <Row key={index}>
                    <Cell>
                        <EdsIcon
                            name={getFileTypeIconName(attachment.fileName)}
                        />
                    </Cell>
                    <Cell>
                        <Typography link={!!link} target="_blank" href={link}>
                            {getFileName(attachment.fileName)}
                        </Typography>
                    </Cell>
                </Row>
            );
        });

    return (
        <Container>
            <FormContainer>
                <Column>
                    <Section>
                        <Typography variant="h5">General info</Typography>
                        <Subsection>
                            <Typography token={{ fontSize: '12px' }}>
                                Selected project
                            </Typography>
                            <Typography variant="body_long">
                                {generalInfo.projectName}
                            </Typography>
                        </Subsection>
                        <Subsection>
                            <Typography token={{ fontSize: '12px' }}>
                                Type
                            </Typography>
                            <Typography variant="body_long">
                                {generalInfo.poType
                                    ? generalInfo.poType.text
                                    : '-'}
                            </Typography>
                        </Subsection>
                        <Subsection>
                            <Typography token={{ fontSize: '12px' }}>
                                Title
                            </Typography>
                            <Typography variant="body_long">
                                {generalInfo.title}
                            </Typography>
                        </Subsection>
                        <Subsection>
                            <Typography token={{ fontSize: '12px' }}>
                                Description
                            </Typography>
                            <Typography variant="body_long">
                                {generalInfo.description
                                    ? generalInfo.description
                                    : '-'}
                            </Typography>
                        </Subsection>
                    </Section>
                    <Section>
                        <Typography variant="h5">
                            Date and time for punch round
                        </Typography>
                        <div className="timeContainer">
                            <Subsection>
                                <Typography token={{ fontSize: '12px' }}>
                                    Date
                                </Typography>
                                <Typography variant="body_long">
                                    {getFormattedDate(generalInfo.date)}
                                </Typography>
                            </Subsection>
                            <Subsection>
                                <Typography token={{ fontSize: '12px' }}>
                                    Start
                                </Typography>
                                <Typography variant="body_long">
                                    {getFormattedTime(generalInfo.startTime)}
                                </Typography>
                            </Subsection>
                            <Subsection>
                                <Typography token={{ fontSize: '12px' }}>
                                    End
                                </Typography>
                                <Typography variant="body_long">
                                    {getFormattedTime(generalInfo.endTime)}
                                </Typography>
                            </Subsection>
                        </div>
                        <Subsection>
                            <Typography token={{ fontSize: '12px' }}>
                                Location
                            </Typography>
                            <LocationDetails>
                                <Typography variant="body_long">
                                    {generalInfo.location
                                        ? generalInfo.location
                                        : '-'}
                                </Typography>

                                <Checkbox
                                    disabled
                                    checked={generalInfo.isOnline}
                                >
                                    Teams meeting
                                </Checkbox>
                            </LocationDetails>
                        </Subsection>
                    </Section>

                    <Section>
                        <Typography variant="h5">Reports added</Typography>
                        <ReportsTable
                            commPkgNumbers={commPkgScope.map((commPkg) => {
                                return commPkg.commPkgNo;
                            })}
                            mcPkgNumbers={mcPkgScope.map((mcPkg) => {
                                return mcPkg.mcPkgNo;
                            })}
                        />
                    </Section>
                    {attachmentList.length > 0 && (
                        <TableSection>
                            <Typography variant="h5">Attachments</Typography>
                            <Table>
                                <Head>
                                    <Row>
                                        <Cell as="th" width="30px" scope="col">
                                            Type
                                        </Cell>
                                        <Cell as="th" scope="col">
                                            Title
                                        </Cell>
                                    </Row>
                                </Head>
                                <Body>{attachmentList}</Body>
                            </Table>
                        </TableSection>
                    )}
                </Column>
                <Column>
                    <TableSection>
                        <Typography variant="h5">Participants</Typography>
                        <Table>
                            <Head>
                                <Row>
                                    <Cell as="th" scope="col">
                                        Organization
                                    </Cell>
                                    <Cell as="th" scope="col">
                                        Person/Role
                                    </Cell>
                                </Row>
                            </Head>
                            <Body>
                                {participants.map((participant, i) =>
                                    getParticipants(participant, i)
                                )}
                            </Body>
                        </Table>
                    </TableSection>
                    {commPkgScope &&
                        generalInfo.projectName &&
                        commPkgScope.length > 0 && (
                            <>
                                <Section>
                                    <Typography variant="h5">
                                        Included Comm Packages
                                    </Typography>
                                    <CommPkgsTable
                                        commPkgScope={commPkgScope}
                                        projectName={generalInfo.projectName}
                                    />
                                </Section>
                            </>
                        )}
                    {mcPkgScope &&
                        generalInfo.projectName &&
                        mcPkgScope.length > 0 && (
                            <>
                                <Section>
                                    <Typography variant="h5">
                                        Included MC Packages
                                    </Typography>
                                    <McPkgsTable
                                        mcPkgScope={mcPkgScope.map((mcPkg) => {
                                            return {
                                                mcPkgNo: mcPkg.mcPkgNo,
                                                description: mcPkg.description,
                                                commPkgNo: mcPkg.commPkgNo,
                                                system: mcPkg.system,
                                            };
                                        })}
                                        projectName={generalInfo.projectName}
                                    />
                                </Section>
                            </>
                        )}
                </Column>
            </FormContainer>
        </Container>
    );
};

export default Summary;

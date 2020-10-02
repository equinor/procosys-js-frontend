import React from 'react';
import { Button, Typography, Table } from '@equinor/eds-core-react';
import { Container, FormContainer, ButtonContainer, Section, Subsection, TableSection } from './Summary.style';
import { GeneralInfoDetails, CommPkgRow, McPkgRow, Participant } from '@procosys/modules/InvitationForPunchOut/types';

const { Body, Row, Cell, Head } = Table;

interface SummaryProps {
    previous: () => void;
    generalInfo: GeneralInfoDetails;
    mcScope: McPkgRow[];
    commPkgScope: CommPkgRow[];
    participants: Participant[];
}

const Summary = ({
    previous,
    generalInfo,
    mcScope,
    commPkgScope,
    participants
}: SummaryProps): JSX.Element => {

    const getHeaders = (): JSX.Element => {
        if (mcScope.length > 0) {
            return (<Row>
                <Cell as="th" scope="col">
                    Mc pkg no
                </Cell>
                <Cell as="th" scope="col">
                    Description
                </Cell>
            </Row>);
        }
        return (<Row>
            <Cell as="th" scope="col">
                Comm pkg no
            </Cell>
            <Cell as="th" scope="col">
                Description
            </Cell>
            <Cell as="th" scope="col">
                Comm status
            </Cell>
        </Row>);
    };

    const getMcScope = (mcPkg: McPkgRow): JSX.Element => {
        return (
            <Row key={mcPkg.mcPkgNo}>
                <Cell>{mcPkg.mcPkgNo}</Cell>
                <Cell>{mcPkg.description}</Cell>
            </Row>);
    };

    const getCommPkgScope = (commPkg: CommPkgRow): JSX.Element => {
        return (
            <Row key={commPkg.commPkgNo}>
                <Cell>{commPkg.commPkgNo}</Cell>
                <Cell>{commPkg.description}</Cell>
                <Cell>{commPkg.status}</Cell>
            </Row>);
    };

    const getParticipants = (participant: Participant, index: number): JSX.Element => {
        return (
            <Row key={index}>
                <Cell>{participant.organization}</Cell>
                <Cell>{'Test Name'}</Cell>
            </Row>);
    };

    return (<Container>
        <FormContainer>
            <Section>
                <Typography variant="h5">General info</Typography>
                <Subsection>
                    <Typography token={{fontSize: '12px'}}>Selected project</Typography>
                    <Typography variant="body_long">{ generalInfo.projectName }</Typography>
                </Subsection>
                <Subsection>
                    <Typography token={{fontSize: '12px'}}>Type</Typography>
                    <Typography variant="body_long">{ generalInfo.poType ? generalInfo.poType.text : '-' }</Typography>
                </Subsection>
                <Subsection>
                    <Typography token={{fontSize: '12px'}}>Title</Typography>
                    <Typography variant="body_long">{ generalInfo.title }</Typography>
                </Subsection>
                <Subsection>
                    <Typography token={{fontSize: '12px'}}>Description</Typography>
                    <Typography variant="body_long">{ generalInfo.description ? generalInfo.description : '-' }</Typography>
                </Subsection>
            </Section>
            <Section>
                <Typography variant="h5">Date and time for punch round</Typography>
                <div className='timeContainer'>
                    <Subsection>
                        <Typography token={{fontSize: '12px'}}>From</Typography>
                        <Typography variant="body_long">{ generalInfo.startDate }</Typography>
                    </Subsection>
                    <Subsection>
                        <Typography token={{fontSize: '12px'}}>Time</Typography>
                        <Typography variant="body_long">{ generalInfo.startTime}</Typography>
                    </Subsection>
                    <Subsection>
                        <Typography token={{fontSize: '12px'}}>To</Typography>
                        <Typography variant="body_long">{ generalInfo.endDate }</Typography>
                    </Subsection>
                    <Subsection>
                        <Typography token={{fontSize: '12px'}}>Time</Typography>
                        <Typography variant="body_long">{ generalInfo.endTime }</Typography>
                    </Subsection>
                </div>
                <Subsection>
                    <Typography token={{fontSize: '12px'}}>Location</Typography>
                    <Typography variant="body_long">{ generalInfo.location ? generalInfo.location : '-' }</Typography>
                </Subsection>
            </Section>
            <TableSection>
                <Typography variant="h5">Reports added</Typography>
                <Table>
                    <Head>
                        <Row>
                            <Cell as="th" scope="col">
                                Reports
                            </Cell>
                            <Cell as="th" scope="col">
                                {''}
                            </Cell>
                        </Row>
                    </Head>
                    <Body>
                        <Row key={'MC32'}>
                            <Cell>{'MC32'}</Cell>
                            <Cell>{'MC scope'}</Cell>
                        </Row>
                        <Row key={'MC84'}>
                            <Cell>{'MC84'}</Cell>
                            <Cell>{'Punch list'}</Cell>
                        </Row>
                    </Body>
                </Table>
            </TableSection>
            <TableSection>
                <Typography variant="h5">Selected scope</Typography>
                <Table>
                    <Head>
                        { getHeaders() }
                    </Head>
                    <Body>
                        { mcScope.length > 0 && mcScope.map(mcPkg => getMcScope(mcPkg)) }
                        { commPkgScope.length > 0 && commPkgScope.map(commPkg => getCommPkgScope(commPkg)) }
                    </Body>
                </Table>
            </TableSection>
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
                        { participants.map((participant, i) => getParticipants(participant, i)) }
                    </Body>
                </Table>
            </TableSection>
            <TableSection>
                <Typography variant="h5">Attachments</Typography>
            </TableSection>
        </FormContainer>
        <ButtonContainer>
            <Button 
                variant='outlined'
                onClick={previous}
            >
                Previous
            </Button>
            <Button
                disabled
            >
                Next
            </Button>
        </ButtonContainer>
    </Container>);
};

export default Summary;

import React from 'react';
import { AttNoteData } from '..';
import {
    ComponentName,
    IpoStatusEnum,
    OrganizationsEnum,
} from '../../../../enums';
import { Participant } from '../../../types';
import SignatureButton from './SignatureButton';
import SignatureButtonWithTooltip from './SignatureButtonWithTooltip';

const tooltipComplete = (
    <div>
        When punch round has been completed
        <br />
        and any punches have been added.
        <br />
        Complete and go to next step.
    </div>
);

const tooltipUpdate = (
    <div>Update attended status and notes for participants.</div>
);

const tooltipAccept = <div>Punch round has been checked by company.</div>;

interface SignatureButtonsProps {
    participant: Participant;
    status: string;
    attNoteData: AttNoteData[];
    loading: boolean;
    setLoading: (isLoasing: boolean) => void;
    unsetDirtyStateFor: (componentName: string) => void;
    complete: (p: Participant, attNoteData: AttNoteData[]) => Promise<any>;
    accept: (p: Participant, attNoteData: AttNoteData[]) => Promise<any>;
    update: (attNoteData: AttNoteData[]) => Promise<any>;
    sign: (p: Participant) => Promise<any>;
    unaccept: (p: Participant) => Promise<any>;
    uncomplete: (p: Participant) => Promise<any>;
    unsign: (p: Participant) => Promise<any>;
    canUpdate: boolean;
}

const SignatureButtons = ({
    participant,
    status,
    attNoteData,
    loading,
    setLoading,
    unsetDirtyStateFor,
    complete,
    accept,
    update,
    sign,
    unaccept,
    uncomplete,
    unsign,
    canUpdate,
}: SignatureButtonsProps): JSX.Element => {
    const handleCompletePunchOut = async (): Promise<any> => {
        setLoading(true);
        await complete(participant, attNoteData);
        setLoading(false);
        unsetDirtyStateFor(ComponentName.ParticipantsTable);
    };

    const handleUnCompletePunchOut = async (): Promise<any> => {
        setLoading(true);
        await uncomplete(participant);
        setLoading(false);
        unsetDirtyStateFor(ComponentName.ParticipantsTable);
    };

    const handleAcceptPunchOut = async (): Promise<any> => {
        setLoading(true);
        await accept(participant, attNoteData);
        setLoading(false);
        unsetDirtyStateFor(ComponentName.ParticipantsTable);
    };

    const handleUnAcceptPunchOut = async (): Promise<any> => {
        setLoading(true);
        await unaccept(participant);
        setLoading(false);
        unsetDirtyStateFor(ComponentName.ParticipantsTable);
    };

    const handleUpdateParticipants = async (): Promise<any> => {
        setLoading(true);
        await update(attNoteData);
        setLoading(false);
        unsetDirtyStateFor(ComponentName.ParticipantsTable);
    };

    const handleSignPunchOut = async (): Promise<any> => {
        setLoading(true);
        await sign(participant);
        setLoading(false);
    };

    const handleUnsignPunchOut = async (): Promise<any> => {
        setLoading(true);
        await unsign(participant);
        setLoading(false);
    };

    const getUnCompleteAndUpdateParticipantsButtons = (): JSX.Element => {
        return (
            <>
                <SignatureButtonWithTooltip
                    name={'Update'}
                    tooltip={tooltipUpdate}
                    onClick={handleUpdateParticipants}
                    disabled={!canUpdate || loading}
                />
                <span> </span>
                <SignatureButton
                    name={'Uncomplete'}
                    onClick={handleUnCompletePunchOut}
                    disabled={loading}
                />
            </>
        );
    };

    const getSignButton = (): JSX.Element => {
        return (
            <SignatureButton
                name={'Sign punch-out'}
                onClick={handleSignPunchOut}
                disabled={loading}
            />
        );
    };
    const getUnsignButton = (): JSX.Element => {
        return (
            <SignatureButton
                name={'Unsign punch-out'}
                onClick={handleUnsignPunchOut}
                disabled={loading}
            />
        );
    };
    if (status === IpoStatusEnum.CANCELED) return <></>;
    switch (participant.organization) {
        case OrganizationsEnum.Contractor:
            if (participant.sortKey === 0) {
                if (participant.canSign && status === IpoStatusEnum.PLANNED) {
                    return (
                        <SignatureButtonWithTooltip
                            name={'Complete punch-out'}
                            tooltip={tooltipComplete}
                            onClick={handleCompletePunchOut}
                            disabled={loading}
                        />
                    );
                } else if (
                    participant.canSign &&
                    status === IpoStatusEnum.COMPLETED
                ) {
                    return getUnCompleteAndUpdateParticipantsButtons();
                }
            } else {
                if (participant.signedBy) {
                    return getUnsignButton();
                } else if (
                    participant.canSign &&
                    status !== IpoStatusEnum.CANCELED
                ) {
                    return getSignButton();
                }
            }
            break;
        case OrganizationsEnum.ConstructionCompany:
            if (participant.sortKey === 1) {
                if (participant.canSign && status === IpoStatusEnum.ACCEPTED) {
                    return (
                        <SignatureButton
                            name={'Unaccept punch-out'}
                            onClick={handleUnAcceptPunchOut}
                            disabled={loading}
                        />
                    );
                } else if (
                    participant.canSign &&
                    status === IpoStatusEnum.COMPLETED
                ) {
                    return (
                        <SignatureButtonWithTooltip
                            name={'Accept punch-out'}
                            tooltip={tooltipAccept}
                            onClick={handleAcceptPunchOut}
                            disabled={loading}
                        />
                    );
                }
            } else {
                if (participant.signedBy) {
                    return getUnsignButton();
                } else if (participant.canSign) {
                    return getSignButton();
                }
            }
            break;
        case OrganizationsEnum.Operation:
        case OrganizationsEnum.TechnicalIntegrity:
        case OrganizationsEnum.Commissioning:
            if (participant.signedBy) {
                return getUnsignButton();
            } else if (participant.canSign) {
                return getSignButton();
            }
            break;
    }

    return <span>-</span>;
};

export default SignatureButtons;

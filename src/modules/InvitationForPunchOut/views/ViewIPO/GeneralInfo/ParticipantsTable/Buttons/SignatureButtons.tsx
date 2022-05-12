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

const tooltipAccept = <div>Punch round has been checked by company.</div>;

interface SignatureButtonsProps {
    participant: Participant;
    status: string;
    loading: boolean;
    setLoading: (isLoasing: boolean) => void;
    unsetDirtyStateFor: (componentName: string) => void;
    complete: (p: Participant) => Promise<any>;
    accept: (p: Participant) => Promise<any>;
    sign: (p: Participant) => Promise<any>;
    unaccept: (p: Participant) => Promise<any>;
    uncomplete: (p: Participant) => Promise<any>;
    unsign: (p: Participant) => Promise<any>;
    canUpdate: boolean;
    isUsingAdminRights: boolean;
}

const SignatureButtons = ({
    participant,
    status,
    loading,
    setLoading,
    unsetDirtyStateFor,
    complete,
    accept,
    sign,
    unaccept,
    uncomplete,
    unsign,
    isUsingAdminRights,
}: SignatureButtonsProps): JSX.Element => {
    const handleButtonClick = async (
        buttonAction: () => Promise<any>
    ): Promise<void> => {
        setLoading(true);
        await buttonAction();
        setLoading(false);
        unsetDirtyStateFor(ComponentName.ParticipantsTable);
    };

    const handleSignButtonClick = async (
        buttonAction: () => Promise<any>
    ): Promise<void> => {
        setLoading(true);
        await buttonAction();
        setLoading(false);
    };

    const getUnCompleteAndUpdateParticipantsButtons = (): JSX.Element => {
        return (
            <SignatureButton
                name={'Uncomplete'}
                onClick={(): Promise<void> =>
                    handleButtonClick(async (): Promise<any> => {
                        return await uncomplete(participant);
                    })
                }
                disabled={loading}
            />
        );
    };

    const getSignButton = (): JSX.Element => {
        return (
            <SignatureButton
                name={'Sign punch-out'}
                onClick={(): Promise<void> =>
                    handleSignButtonClick(async (): Promise<any> => {
                        return await sign(participant);
                    })
                }
                disabled={loading}
            />
        );
    };
    const getUnsignButton = (): JSX.Element => {
        return (
            <SignatureButton
                name={'Unsign punch-out'}
                onClick={(): Promise<void> =>
                    handleSignButtonClick(async (): Promise<any> => {
                        return await unsign(participant);
                    })
                }
                disabled={loading}
            />
        );
    };
    if (status === IpoStatusEnum.CANCELED) return <></>;
    switch (participant.organization) {
        case OrganizationsEnum.Contractor:
            if (participant.sortKey === 0) {
                if (participant.isSigner && status === IpoStatusEnum.PLANNED) {
                    return (
                        <SignatureButtonWithTooltip
                            name={'Complete punch-out'}
                            tooltip={tooltipComplete}
                            onClick={(): Promise<void> =>
                                handleButtonClick(async (): Promise<any> => {
                                    return await complete(participant);
                                })
                            }
                            disabled={loading}
                        />
                    );
                } else if (
                    (participant.isSigner || isUsingAdminRights) &&
                    status === IpoStatusEnum.COMPLETED
                ) {
                    return getUnCompleteAndUpdateParticipantsButtons();
                }
            } else {
                if (
                    (participant.isSigner || isUsingAdminRights) &&
                    participant.signedBy
                ) {
                    return getUnsignButton();
                } else if (
                    participant.isSigner &&
                    status !== IpoStatusEnum.CANCELED
                ) {
                    return getSignButton();
                }
            }
            break;
        case OrganizationsEnum.ConstructionCompany:
            if (participant.sortKey === 1) {
                if (
                    (participant.isSigner || isUsingAdminRights) &&
                    status === IpoStatusEnum.ACCEPTED
                ) {
                    return (
                        <SignatureButton
                            name={'Unaccept punch-out'}
                            onClick={(): Promise<void> =>
                                handleButtonClick(async (): Promise<any> => {
                                    return await unaccept(participant);
                                })
                            }
                            disabled={loading}
                        />
                    );
                } else if (
                    participant.isSigner &&
                    status === IpoStatusEnum.COMPLETED
                ) {
                    return (
                        <SignatureButtonWithTooltip
                            name={'Accept punch-out'}
                            tooltip={tooltipAccept}
                            onClick={(): Promise<void> =>
                                handleButtonClick(async (): Promise<any> => {
                                    return await accept(participant);
                                })
                            }
                            disabled={loading}
                        />
                    );
                }
            } else {
                if (
                    (participant.isSigner || isUsingAdminRights) &&
                    participant.signedBy
                ) {
                    return getUnsignButton();
                } else if (participant.isSigner) {
                    return getSignButton();
                }
            }
            break;
        case OrganizationsEnum.Operation:
        case OrganizationsEnum.TechnicalIntegrity:
        case OrganizationsEnum.Commissioning:
            if (
                (participant.isSigner || isUsingAdminRights) &&
                participant.signedBy
            ) {
                return getUnsignButton();
            } else if (participant.isSigner) {
                return getSignButton();
            }
    }

    return <span>-</span>;
};

export default SignatureButtons;

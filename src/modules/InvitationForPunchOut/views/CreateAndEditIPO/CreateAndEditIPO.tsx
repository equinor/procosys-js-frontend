import {
    Attachment,
    CommPkgRow,
    GeneralInfoDetails,
    McScope,
    Participant,
    RoleParticipant,
    Step,
} from '../../types';
import React, { useEffect, useState } from 'react';

import Attachments from './Attachments/Attachments';
import { Container } from './CreateAndEditIPO.style';
import CreateAndEditIPOHeader from './CreateAndEditIPOHeader';
import GeneralInfo from './GeneralInfo/GeneralInfo';
import Participants from './Participants/Participants';
import SelectScope from './SelectScope/SelectScope';
import Summary from './Summary/Summary';
import { isEmptyObject } from './utils';

const validateGeneralInfo = (
    info: GeneralInfoDetails,
    confirmationChecked?: boolean
): Record<string, string> | null => {
    let errors = {};
    const {
        title,
        description,
        location,
        poType,
        projectName,
        startTime,
        endTime,
    } = info;

    // when function is called with 'confirmationChecked', additional validation is performed
    // that would produce errors on initial state, or interfere when entering info
    if (typeof confirmationChecked === 'boolean') {
        !projectName &&
            (errors = { ...errors, projectName: 'Required field.' });
        !poType && (errors = { ...errors, poType: 'Required field.' });

        !title
            ? (errors = { ...errors, title: 'Required field.' })
            : title.trim().length < 3 &&
              (errors = {
                  ...errors,
                  title: 'Title is too short. Minimum 3 characters.',
              });

        (!startTime || !endTime) &&
            (errors = { ...errors, time: 'Start and end time is required.' });

        !confirmationChecked &&
            (errors = { ...errors, confirmation: 'Confirmation required.' });
    }

    if (title) {
        title.length > 250 &&
            (errors = {
                ...errors,
                title: 'Title is too long. Maximum 250 characters.',
            });
    }
    if (description) {
        description.length > 4096 &&
            (errors = {
                ...errors,
                description:
                    'Description is too long. Maximum 4096 characters.',
            });
    }
    if (location) {
        location.length > 250 &&
            (errors = {
                ...errors,
                location: 'Location is too long. Maximum 250 characters.',
            });
    }
    if (startTime && endTime) {
        startTime >= endTime &&
            (errors = { ...errors, time: 'Start time must precede end time.' });
    }

    if (isEmptyObject(errors)) return null;
    return errors;
};

export enum StepsEnum {
    GeneralInfo = 1,
    Scope = 2,
    Participants = 3,
    UploadAttachments = 4,
    SummaryAndCreate = 5,
}

interface CreateAndEditProps {
    saveIpo: () => void;
    steps: Step[];
    setSteps: React.Dispatch<React.SetStateAction<Step[]>>;
    generalInfo: GeneralInfoDetails;
    setGeneralInfo: React.Dispatch<React.SetStateAction<GeneralInfoDetails>>;
    selectedCommPkgScope: CommPkgRow[];
    setSelectedCommPkgScope: React.Dispatch<React.SetStateAction<CommPkgRow[]>>;
    selectedMcPkgScope: McScope;
    setSelectedMcPkgScope: React.Dispatch<React.SetStateAction<McScope>>;
    participants: Participant[];
    setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>;
    attachments: Attachment[];
    setAttachments: React.Dispatch<React.SetStateAction<Attachment[]>>;
    availableRoles: RoleParticipant[];
    fromMain: boolean;
    confirmationChecked: boolean;
    setConfirmationChecked: React.Dispatch<React.SetStateAction<boolean>>;
    ipoId?: number | null;
    isEditMode?: boolean;
    commPkgNoFromMain?: string | null;
}

const CreateAndEditIPO = ({
    saveIpo,
    steps,
    setSteps,
    generalInfo,
    setGeneralInfo,
    selectedCommPkgScope,
    setSelectedCommPkgScope,
    selectedMcPkgScope,
    setSelectedMcPkgScope,
    participants,
    setParticipants,
    attachments,
    setAttachments,
    availableRoles,
    fromMain,
    confirmationChecked,
    setConfirmationChecked,
    ipoId = null,
    isEditMode = false,
    commPkgNoFromMain = null,
}: CreateAndEditProps): JSX.Element => {
    const [currentStep, setCurrentStep] = useState<number>(
        StepsEnum.GeneralInfo
    );
    const [canCreateOrUpdate, setCanCreateOrUpdate] = useState<boolean>(false);
    const [generalInfoErrors, setGeneralInfoErrors] = useState<Record<
        string,
        string
    > | null>(null);

    const goToNextStep = (): void => {
        if (currentStep === StepsEnum.GeneralInfo) {
            const errors = validateGeneralInfo(
                generalInfo,
                confirmationChecked
            );
            if (errors) {
                setGeneralInfoErrors(errors);
                return;
            }
        }
        if (currentStep > StepsEnum.Participants) {
            changeCompletedStatus(true, currentStep);
            if (currentStep == StepsEnum.UploadAttachments) {
                changeCompletedStatus(true, StepsEnum.SummaryAndCreate);
            }
        }
        setCurrentStep((currentStep) => {
            if (currentStep >= StepsEnum.SummaryAndCreate) {
                return currentStep;
            }
            return currentStep + 1;
        });
    };

    const goToPreviousStep = (): void => {
        setCurrentStep((currentStep) => {
            if (currentStep >= StepsEnum.Scope) {
                return currentStep - 1;
            }
            return currentStep;
        });
    };

    const goToStep = (stepNo: number): void => {
        if (currentStep === StepsEnum.GeneralInfo) {
            const errors = validateGeneralInfo(
                generalInfo,
                confirmationChecked
            );
            if (errors) {
                setGeneralInfoErrors(errors);
                return;
            }
        }
        if (steps[stepNo >= 2 ? stepNo - 2 : 0].isCompleted) {
            if (stepNo > StepsEnum.Participants) {
                changeCompletedStatus(true, stepNo);
            }
            setCurrentStep(stepNo);
        }
    };

    const changeCompletedStatus = (isValid: boolean, step: number): void => {
        setSteps((currentSteps) => {
            const updatedSteps = [...currentSteps];
            updatedSteps[step - 1].isCompleted = isValid;
            return updatedSteps;
        });
    };

    useEffect(() => {
        const errors = validateGeneralInfo(generalInfo);
        if (!errors) {
            changeCompletedStatus(true, StepsEnum.GeneralInfo);
        } else {
            changeCompletedStatus(false, StepsEnum.GeneralInfo);
        }
        setGeneralInfoErrors(errors);
    }, [generalInfo, confirmationChecked]);

    useEffect(() => {
        if (
            selectedCommPkgScope.length > 0 ||
            selectedMcPkgScope.selected.length > 0
        ) {
            changeCompletedStatus(true, StepsEnum.Scope);
        } else {
            changeCompletedStatus(false, StepsEnum.Scope);
        }
    }, [selectedCommPkgScope, selectedMcPkgScope]);

    useEffect(() => {
        let canBeCreatedOrSaved = true;
        steps.forEach((step) => {
            if (!step.isCompleted) {
                canBeCreatedOrSaved = false;
            }
        });
        setCanCreateOrUpdate(canBeCreatedOrSaved);
    }, [steps]);

    const clearScope = (): void => {
        setSelectedMcPkgScope({
            system: null,
            multipleDisciplines: false,
            selected: [],
        });
        setSelectedCommPkgScope([]);
    };

    useEffect(() => {
        const incompleteParticipantRows = participants.filter(
            (p) => !p.organization || (!p.role && !p.person && !p.externalEmail)
        );
        if (incompleteParticipantRows.length > 0) {
            changeCompletedStatus(false, StepsEnum.Participants);
        } else {
            changeCompletedStatus(true, StepsEnum.Participants);
        }
    }, [participants]);

    return (
        <Container>
            <CreateAndEditIPOHeader
                ipoId={ipoId}
                title={generalInfo.title}
                steps={steps}
                currentStep={currentStep}
                canBeCreatedOrUpdated={canCreateOrUpdate}
                saveIpo={saveIpo}
                next={goToNextStep}
                previous={goToPreviousStep}
                goTo={goToStep}
            />
            {currentStep == StepsEnum.GeneralInfo && (
                <GeneralInfo
                    generalInfo={generalInfo}
                    setGeneralInfo={setGeneralInfo}
                    fromMain={fromMain}
                    isEditMode={isEditMode}
                    clearScope={clearScope}
                    confirmationChecked={confirmationChecked}
                    setConfirmationChecked={setConfirmationChecked}
                    errors={generalInfoErrors}
                />
            )}
            {currentStep == StepsEnum.Scope &&
                generalInfo.poType != null &&
                generalInfo.projectName != null && (
                    <SelectScope
                        type={generalInfo.poType.value}
                        commPkgNo={commPkgNoFromMain ? commPkgNoFromMain : null}
                        selectedCommPkgScope={selectedCommPkgScope}
                        setSelectedCommPkgScope={setSelectedCommPkgScope}
                        selectedMcPkgScope={selectedMcPkgScope}
                        setSelectedMcPkgScope={setSelectedMcPkgScope}
                        projectName={generalInfo.projectName}
                    />
                )}
            {currentStep == StepsEnum.Participants && (
                <Participants
                    participants={participants}
                    setParticipants={setParticipants}
                    availableRoles={availableRoles ? availableRoles : []}
                />
            )}
            {currentStep == StepsEnum.UploadAttachments && (
                <Attachments
                    attachments={attachments}
                    setAttachments={setAttachments}
                />
            )}
            {currentStep == StepsEnum.SummaryAndCreate && (
                <Summary
                    generalInfo={generalInfo}
                    mcPkgScope={selectedMcPkgScope.selected.map((mcPkg) => {
                        return {
                            mcPkgNo: mcPkg.mcPkgNo,
                            description: mcPkg.description,
                            commPkgNo: mcPkg.commPkgNo ? mcPkg.commPkgNo : '',
                            system: mcPkg.system,
                        };
                    })}
                    commPkgScope={selectedCommPkgScope}
                    participants={participants}
                    attachments={attachments}
                />
            )}
        </Container>
    );
};

export default CreateAndEditIPO;

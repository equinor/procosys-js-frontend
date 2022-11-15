import {
    ConfirmationTextContainer,
    DateTimeContainer,
    DropdownItem,
    ErrorContainer,
    FieldContainer,
    FormContainer,
    LocationContainer,
    PoTypeContainer,
    TextContainer,
} from './GeneralInfo.style';
import {
    GeneralInfoDetails,
    ProjectDetails,
} from '@procosys/modules/InvitationForPunchOut/types';
import React, { ChangeEvent, useEffect, useState } from 'react';
import SelectInput, { SelectItem } from '../../../../../components/Select';
import { TextField, Typography } from '@equinor/eds-core-react';
import { isValidDate } from '@procosys/core/services/DateService';

import { Canceler } from '@procosys/http/HttpClient';
import Checkbox from '@procosys/components/Checkbox';
import { TextField as DateTimeField } from '@mui/material';
import Dropdown from '../../../../../components/Dropdown';
import EdsIcon from '@procosys/components/EdsIcon';
import Spinner from '@procosys/components/Spinner';
import { getEndTime } from '../utils';
import { set } from 'date-fns';
import { tokens } from '@equinor/eds-tokens';
import { useInvitationForPunchOutContext } from '../../../context/InvitationForPunchOutContext';
import { Label } from '@equinor/eds-core-react';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';

export const poTypes: SelectItem[] = [
    { text: 'DP (Discipline Punch)', value: 'DP' },
    { text: 'MDP (Multi Discipline Punch)', value: 'MDP' },
];

interface GeneralInfoProps {
    generalInfo: GeneralInfoDetails;
    setGeneralInfo: React.Dispatch<React.SetStateAction<GeneralInfoDetails>>;
    fromMain: boolean;
    isEditMode: boolean;
    clearScope: () => void;
    confirmationChecked: boolean;
    setConfirmationChecked: React.Dispatch<React.SetStateAction<boolean>>;
    errors: Record<string, string> | null;
    isDisabled: boolean;
}

const GeneralInfo = ({
    generalInfo,
    setGeneralInfo,
    fromMain,
    isEditMode,
    clearScope,
    confirmationChecked,
    setConfirmationChecked,
    errors,
    isDisabled,
}: GeneralInfoProps): JSX.Element => {
    const { availableProjects } = useInvitationForPunchOutContext();
    const [filteredProjects, setFilteredProjects] =
        useState<ProjectDetails[]>(availableProjects);
    const [filterForProjects, setFilterForProjects] = useState<string>('');
    const [date, setDate] = useState<Date | undefined>(generalInfo.startTime);
    const [startTime, setStartTime] = useState<string | null>(
        generalInfo.startTime ? generalInfo.startTime.toString() : null
    );
    const [endTime, setEndTime] = useState<string | null>(
        generalInfo.endTime ? generalInfo.endTime.toString() : null
    );

    useEffect(() => {
        if (filterForProjects.length <= 0) {
            setFilteredProjects(availableProjects);
            return;
        }

        setFilteredProjects(
            availableProjects.filter((p: ProjectDetails) => {
                return (
                    p.name
                        .toLowerCase()
                        .indexOf(filterForProjects.toLowerCase()) > -1 ||
                    p.description
                        .toLowerCase()
                        .indexOf(filterForProjects.toLowerCase()) > -1
                );
            })
        );
    }, [filterForProjects]);

    const setPoTypeForm = (value: string): void => {
        clearScope();
        const newPoType = poTypes.find((p: SelectItem) => p.value === value);
        if (newPoType) {
            setGeneralInfo((gi) => {
                return { ...gi, poType: newPoType };
            });
        }
    };

    const setProjectForm = (event: React.MouseEvent, index: number): void => {
        event.preventDefault();
        if (generalInfo.projectName !== filteredProjects[index].name)
            clearScope();
        setGeneralInfo((gi) => {
            return { ...gi, projectName: filteredProjects[index].name };
        });
    };

    const handleSetDate = (date: Date | null): void => {
        console.log('handle set date');
        setDate(date ? date : undefined);
        if (date == null || !isValidDate(date)) {
            setGeneralInfo((gi) => {
                return { ...gi, startTime: undefined, endTime: undefined };
            });
        } else {
            const newStart = set(
                generalInfo.startTime ? generalInfo.startTime : new Date(),
                {
                    year: date.getFullYear(),
                    month: date.getMonth(),
                    date: date.getDate(),
                }
            );
            const newEnd = set(
                generalInfo.endTime ? generalInfo.endTime : new Date(),
                {
                    year: date.getFullYear(),
                    month: date.getMonth(),
                    date: date.getDate(),
                }
            );
            setGeneralInfo((gi) => {
                return { ...gi, startTime: newStart, endTime: newEnd };
            });
        }
    };

    const handleSetStartTime = (time: Date | null): void => {
        setStartTime(time ? time.toString() : null);
        if (time == null || !isValidDate(time)) {
            setGeneralInfo((gi) => {
                return { ...gi, startTime: undefined };
            });
        } else {
            const newStart = set(
                generalInfo.startTime ? generalInfo.startTime : new Date(),
                {
                    hours: time.getHours(),
                    minutes: time.getMinutes(),
                }
            );
            const newEndTime = generalInfo.endTime
                ? newStart > generalInfo.endTime
                    ? getEndTime(newStart)
                    : set(new Date(), {
                          hours: generalInfo.endTime.getHours(),
                          minutes: generalInfo.endTime.getMinutes(),
                      })
                : getEndTime(newStart);
            setGeneralInfo((gi) => {
                return { ...gi, startTime: newStart, endTime: newEndTime };
            });
        }
    };

    const handleSetEndTime = (time: Date | null): void => {
        setEndTime(time ? time.toString() : null);
        if (time == null || !isValidDate(time)) {
            setGeneralInfo((gi) => {
                return { ...gi, endTime: undefined };
            });
        } else {
            const newEnd = set(
                generalInfo.endTime ? generalInfo.endTime : new Date(),
                {
                    hours: time.getHours(),
                    minutes: time.getMinutes(),
                }
            );
            setGeneralInfo((gi) => {
                return { ...gi, endTime: newEnd };
            });
        }
    };

    return (
        <FormContainer>
            <FieldContainer>
                <Dropdown
                    label={'Project'}
                    maxHeight="300px"
                    variant="form"
                    text={generalInfo.projectName || 'Select'}
                    onFilter={setFilterForProjects}
                    disabled={fromMain || isEditMode || isDisabled}
                >
                    {filteredProjects &&
                        filteredProjects.map((projectItem, index) => {
                            return (
                                <DropdownItem
                                    key={index}
                                    onClick={(event: React.MouseEvent): void =>
                                        setProjectForm(event, index)
                                    }
                                >
                                    <div>{projectItem.description}</div>
                                    <div style={{ fontSize: '12px' }}>
                                        {projectItem.name}
                                    </div>
                                </DropdownItem>
                            );
                        })}
                </Dropdown>
                {errors && errors['projectName'] && (
                    <ErrorContainer>
                        <EdsIcon
                            name="error_filled"
                            size={16}
                            color={tokens.colors.interactive.danger__text.rgba}
                        />
                        <Typography
                            variant="caption"
                            color={tokens.colors.interactive.danger__text.rgba}
                        >
                            {errors['projectName']}
                        </Typography>
                    </ErrorContainer>
                )}
            </FieldContainer>
            <FieldContainer>
                <PoTypeContainer id="po-type-select">
                    <SelectInput
                        onChange={setPoTypeForm}
                        data={poTypes}
                        label={'Type of punch round'}
                        disabled={isDisabled}
                    >
                        {(generalInfo.poType && generalInfo.poType.text) ||
                            'Select'}
                    </SelectInput>
                </PoTypeContainer>
                {errors && errors['poType'] && (
                    <ErrorContainer>
                        <EdsIcon
                            name="error_filled"
                            size={16}
                            color={tokens.colors.interactive.danger__text.rgba}
                        />
                        <Typography
                            variant="caption"
                            color={tokens.colors.interactive.danger__text.rgba}
                        >
                            {errors['poType']}
                        </Typography>
                    </ErrorContainer>
                )}
            </FieldContainer>
            <FieldContainer>
                <TextField
                    data-testid="title"
                    id={'title'}
                    label="Title"
                    placeholder="Write here"
                    defaultValue={generalInfo.title}
                    onChange={(
                        e: React.ChangeEvent<HTMLInputElement>
                    ): void => {
                        setGeneralInfo((gi) => {
                            return { ...gi, title: e.target.value };
                        });
                    }}
                    disabled={isDisabled}
                />
                {errors && errors['title'] && (
                    <ErrorContainer>
                        <EdsIcon
                            name="error_filled"
                            size={16}
                            color={tokens.colors.interactive.danger__text.rgba}
                        />
                        <Typography
                            variant="caption"
                            color={tokens.colors.interactive.danger__text.rgba}
                        >
                            {errors['title']}
                        </Typography>
                    </ErrorContainer>
                )}
            </FieldContainer>
            <FieldContainer>
                <TextField
                    id="description"
                    placeholder="Write here"
                    label="Description"
                    meta="Optional"
                    defaultValue={generalInfo.description}
                    multiline
                    onChange={(
                        e: React.ChangeEvent<HTMLInputElement>
                    ): void => {
                        setGeneralInfo((gi) => {
                            return { ...gi, description: e.target.value };
                        });
                    }}
                    disabled={isDisabled}
                />
                {errors && errors['description'] && (
                    <ErrorContainer>
                        <EdsIcon
                            name="error_filled"
                            size={16}
                            color={tokens.colors.interactive.danger__text.rgba}
                        />
                        <Typography
                            variant="caption"
                            color={tokens.colors.interactive.danger__text.rgba}
                        >
                            {errors['description']}
                        </Typography>
                    </ErrorContainer>
                )}
            </FieldContainer>
            <Typography constiant="h5">
                Date and time for punch round
            </Typography>
            <DateTimeContainer>
                <div>
                    <Label label={'Date'} />
                    <DatePicker
                        renderInput={(props): JSX.Element => (
                            <DateTimeField {...props} />
                        )}
                        value={date}
                        onChange={handleSetDate}
                        disabled={isDisabled}
                    />
                </div>
                <div>
                    <Label label={'Start'} />
                    <TimePicker
                        renderInput={(props): JSX.Element => (
                            <DateTimeField {...props} />
                        )}
                        value={startTime}
                        onChange={handleSetStartTime}
                        disabled={isDisabled}
                    />
                </div>
                <div>
                    <Label label={'End'} />
                    <TimePicker
                        renderInput={(props): JSX.Element => (
                            <DateTimeField {...props} />
                        )}
                        value={endTime}
                        onChange={handleSetEndTime}
                        disabled={isDisabled}
                    />
                </div>
                {errors && errors['time'] && (
                    <ErrorContainer>
                        <EdsIcon
                            name="error_filled"
                            size={16}
                            color={tokens.colors.interactive.danger__text.rgba}
                        />
                        <Typography
                            variant="caption"
                            color={tokens.colors.interactive.danger__text.rgba}
                        >
                            {errors['time']}
                        </Typography>
                    </ErrorContainer>
                )}
            </DateTimeContainer>

            <FieldContainer>
                <LocationContainer>
                    <TextField
                        data-testid="location"
                        id="location"
                        placeholder="Write here"
                        label="Location"
                        meta="Optional"
                        defaultValue={generalInfo.location}
                        onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                        ): void => {
                            setGeneralInfo((gi) => {
                                return { ...gi, location: e.target.value };
                            });
                        }}
                        disabled={isDisabled}
                    />
                </LocationContainer>
                {errors && errors['location'] && (
                    <ErrorContainer>
                        <EdsIcon
                            name="error_filled"
                            size={16}
                            color={tokens.colors.interactive.danger__text.rgba}
                        />
                        <Typography
                            variant="caption"
                            color={tokens.colors.interactive.danger__text.rgba}
                        >
                            {errors['location']}
                        </Typography>
                    </ErrorContainer>
                )}
            </FieldContainer>
            <FieldContainer>
                <ConfirmationTextContainer>
                    {isEditMode ? (
                        <Checkbox disabled checked />
                    ) : (
                        <Checkbox
                            checked={confirmationChecked}
                            onChange={(): void =>
                                setConfirmationChecked(
                                    (confirmed) => !confirmed
                                )
                            }
                        />
                    )}
                    <TextContainer>
                        <Typography variant="body_short" fontWeight={400}>
                            I hereby confirm that prior to common punch-out all
                            relevant MCCR shall be signed and all punch items
                            registered.
                        </Typography>
                        <br />
                        <Typography variant="body_short" fontWeight={400}>
                            Mechanical Completion means that the installation is
                            built in accordance with relevant drawings and
                            specifications. All specified tests and inspections
                            are carried out and documented in a uniform way.
                        </Typography>
                    </TextContainer>
                </ConfirmationTextContainer>
                {errors && errors['confirmation'] && (
                    <ErrorContainer>
                        <EdsIcon
                            name="error_filled"
                            size={16}
                            color={tokens.colors.interactive.danger__text.rgba}
                        />
                        <Typography
                            variant="caption"
                            color={tokens.colors.interactive.danger__text.rgba}
                        >
                            {errors['confirmation']}
                        </Typography>
                    </ErrorContainer>
                )}
            </FieldContainer>
        </FormContainer>
    );
};

export default GeneralInfo;

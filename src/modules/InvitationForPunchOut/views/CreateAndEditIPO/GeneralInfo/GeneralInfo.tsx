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
    Column,
} from './GeneralInfo.style';
import {
    GeneralInfoDetails,
    ProjectDetails,
} from '@procosys/modules/InvitationForPunchOut/types';
import React, { useEffect, useState } from 'react';
import SelectInput, { SelectItem } from '../../../../../components/Select';
import { TextField, Typography } from '@equinor/eds-core-react';
import { isValidDate } from '@procosys/core/services/DateService';

import Checkbox from '@procosys/components/Checkbox';
import { TextField as DateTimeField } from '@mui/material';
import Dropdown from '../../../../../components/Dropdown';
import EdsIcon from '@procosys/components/EdsIcon';
import { set } from 'date-fns';
import { tokens } from '@equinor/eds-tokens';
import { useInvitationForPunchOutContext } from '../../../context/InvitationForPunchOutContext';
import { Label } from '@equinor/eds-core-react';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { Tooltip } from '@equinor/eds-core-react';

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
    const [date, setDate] = useState<Date | null>(
        generalInfo.date ? generalInfo.date : null
    );
    const [startTime, setStartTime] = useState<string | null>(
        generalInfo.startTime ? generalInfo.startTime.toString() : null
    );
    const [endTime, setEndTime] = useState<string | null>(
        generalInfo.endTime ? generalInfo.endTime.toString() : null
    );
    const [isOnline, setIsOnline] = useState<boolean>(
        generalInfo.isOnline ? generalInfo.isOnline : false
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
        setDate(date ? date : null);
        if (date == null || !isValidDate(date)) {
            setGeneralInfo((gi) => {
                return { ...gi, date: undefined };
            });
        } else {
            setGeneralInfo((gi) => {
                return { ...gi, date: date };
            });
        }
    };

    const getNewTime = (time: Date | null): Date | undefined => {
        if (time == null || !isValidDate(time)) {
            return undefined;
        } else {
            const newTime = set(new Date(), {
                hours: time.getHours(),
                minutes: time.getMinutes(),
            });
            return newTime;
        }
    };

    const handleSetStartTime = (time: Date | null): void => {
        setStartTime(time ? time.toString() : null);
        const newStart = getNewTime(time);
        setGeneralInfo((gi) => {
            return { ...gi, startTime: newStart };
        });
    };

    const handleSetEndTime = (time: Date | null): void => {
        setEndTime(time ? time.toString() : null);
        const newEnd = getNewTime(time);
        setGeneralInfo((gi) => {
            return { ...gi, endTime: newEnd };
        });
    };

    return (
        <FormContainer>
            <Column>
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
                                        onClick={(
                                            event: React.MouseEvent
                                        ): void => setProjectForm(event, index)}
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
                                color={
                                    tokens.colors.interactive.danger__text.rgba
                                }
                            />
                            <Typography
                                variant="caption"
                                color={
                                    tokens.colors.interactive.danger__text.rgba
                                }
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
                                color={
                                    tokens.colors.interactive.danger__text.rgba
                                }
                            />
                            <Typography
                                variant="caption"
                                color={
                                    tokens.colors.interactive.danger__text.rgba
                                }
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
                                color={
                                    tokens.colors.interactive.danger__text.rgba
                                }
                            />
                            <Typography
                                variant="caption"
                                color={
                                    tokens.colors.interactive.danger__text.rgba
                                }
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
                                color={
                                    tokens.colors.interactive.danger__text.rgba
                                }
                            />
                            <Typography
                                variant="caption"
                                color={
                                    tokens.colors.interactive.danger__text.rgba
                                }
                            >
                                {errors['description']}
                            </Typography>
                        </ErrorContainer>
                    )}
                </FieldContainer>
            </Column>
            <Column>
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
                </DateTimeContainer>
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
                        {isEditMode ? (
                            <Checkbox disabled checked={isOnline}>
                                Make Teams meeting
                            </Checkbox>
                        ) : (
                            <Tooltip
                                title="Can't be changed later"
                                placement="bottom"
                            >
                                <span>
                                    <Checkbox
                                        checked={isOnline}
                                        onChange={(): void => {
                                            setIsOnline(!isOnline);
                                            setGeneralInfo((gi) => {
                                                return {
                                                    ...gi,
                                                    isOnline: !isOnline,
                                                };
                                            });
                                        }}
                                    >
                                        Make Teams meeting
                                    </Checkbox>
                                </span>
                            </Tooltip>
                        )}
                    </LocationContainer>
                    {errors && errors['location'] && (
                        <ErrorContainer>
                            <EdsIcon
                                name="error_filled"
                                size={16}
                                color={
                                    tokens.colors.interactive.danger__text.rgba
                                }
                            />
                            <Typography
                                variant="caption"
                                color={
                                    tokens.colors.interactive.danger__text.rgba
                                }
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
                                I hereby confirm that prior to common punch-out
                                all relevant MCCR shall be signed and all punch
                                items registered.
                            </Typography>
                            <br />
                            <Typography variant="body_short" fontWeight={400}>
                                Mechanical Completion means that the
                                installation is built in accordance with
                                relevant drawings and specifications. All
                                specified tests and inspections are carried out
                                and documented in a uniform way.
                            </Typography>
                        </TextContainer>
                    </ConfirmationTextContainer>
                    {errors && errors['confirmation'] && (
                        <ErrorContainer>
                            <EdsIcon
                                name="error_filled"
                                size={16}
                                color={
                                    tokens.colors.interactive.danger__text.rgba
                                }
                            />
                            <Typography
                                variant="caption"
                                color={
                                    tokens.colors.interactive.danger__text.rgba
                                }
                            >
                                {errors['confirmation']}
                            </Typography>
                        </ErrorContainer>
                    )}
                </FieldContainer>
            </Column>
        </FormContainer>
    );
};

export default GeneralInfo;

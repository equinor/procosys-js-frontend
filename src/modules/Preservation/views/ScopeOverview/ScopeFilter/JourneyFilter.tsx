import React, { useState, useEffect } from 'react';
import { Collapse, CollapseInfo, Section } from './ScopeFilter.style';
import { Typography } from '@equinor/eds-core-react';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { TagListFilter } from '../types';
import { showSnackbarNotification } from '../../../../../core/services/NotificationService';
import { Canceler } from '../../../../../http/HttpClient';
import { usePreservationContext } from '../../../context/PreservationContext';
import Checkbox from '../../../../../components/Checkbox';

interface JourneyFilterValue {
    id: number;
    title: string;
}

interface JourneyFilterProps {
    tagListFilter: TagListFilter;
    setTagListFilter: (filter: TagListFilter) => void;
}

const JourneyFilter = ({
    tagListFilter,
    setTagListFilter
}: JourneyFilterProps): JSX.Element => {

    const [journeyIsExpanded, setJourneyIsExpanded] = useState<boolean>(false);
    const [journeys, setJourneys] = useState<JourneyFilterValue[]>([]);
    const [journeysChecked, setJourneysChecked] = useState<number[]>(tagListFilter.journeyIds || []);

    const {
        project,
        apiClient,
    } = usePreservationContext();

    useEffect(() => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            try {
                const journeys = await apiClient.getJourneyFilters(project.name, (cancel: Canceler) => requestCancellor = cancel);
                console.log('joruneyL: ', journeys);
                setJourneys(journeys);

            } catch (error) {
                console.error('Get journeys failed: ', error.messsage, error.data);
                showSnackbarNotification(error.message, 5000);
            }
        })();

        return (): void => {
            requestCancellor && requestCancellor();
        };
    }, []);

    const updateFilter = (journeyId: number, checked: boolean): void => {
        if (checked && journeysChecked.indexOf(journeyId) === -1) {
            setJourneysChecked([...journeysChecked, journeyId]);
        } else if (!checked && journeysChecked.indexOf(journeyId) !== -1) {
            setJourneysChecked(journeysChecked.filter(item => item != journeyId));
        }
        tagListFilter.journeyIds = journeysChecked;
        setTagListFilter({ ...tagListFilter });
        console.log('joruneys checked: ', journeysChecked);
        console.log('tagList filter: ', tagListFilter.journeyIds);

    };

    const checkboxSection = (journey: JourneyFilterValue): JSX.Element => {
        return (
            <Section>
                <Checkbox
                    checked={journeysChecked.some(journeyId => journey.id === journeyId)}
                    onChange={(checked: boolean): void => {
                        updateFilter(journey.id, checked);
                    }}
                >
                    <Typography variant='body_long'>{journey.title}</Typography>
                </Checkbox>
            </Section>
        );

    };

    return (
        <>
            <Collapse isExpanded={journeyIsExpanded} onClick={(): void => setJourneyIsExpanded(!journeyIsExpanded)}>
                <CollapseInfo>
                    Preservation Journey
                </CollapseInfo>
                {
                    journeyIsExpanded
                        ? <KeyboardArrowUpIcon />
                        : <KeyboardArrowDownIcon />
                }
            </Collapse>
            {
                journeyIsExpanded && (
                    <>
                        {
                            journeys?.map(journey => checkboxSection(journey))
                        }
                    </>
                )
            }
        </>
    );
};

export default JourneyFilter;
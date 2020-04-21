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
    setTagListFilter,
}: JourneyFilterProps): JSX.Element => {

    const [journeyIsExpanded, setJourneyIsExpanded] = useState<boolean>(false);
    const [journeys, setJourneys] = useState<JourneyFilterValue[]>([]);

    const {
        project,
        apiClient,
    } = usePreservationContext();

    useEffect(() => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            try {
                const journeys = await apiClient.getJourneyFilters(project.name, (cancel: Canceler) => requestCancellor = cancel);
                setJourneys(journeys);
            } catch (error) {
                showSnackbarNotification(error.message, 5000);
            }
        })();

        return (): void => {
            requestCancellor && requestCancellor();
        };
    }, []);

    const updateFilter = (journeyId: number, checked: boolean): void => {
        const newTagListFilter: TagListFilter = { ...tagListFilter };
        if (checked) {
            newTagListFilter.journeyIds = [...tagListFilter.journeyIds, journeyId];
        } else {
            newTagListFilter.journeyIds = [...tagListFilter.journeyIds.filter(item => item != journeyId)];
        }
        setTagListFilter(newTagListFilter);

    };

    const createCheckbox = (journey: JourneyFilterValue): JSX.Element => {
        return (
            <Section key={journey.id}>
                <Checkbox
                    // eslint-disable-next-line react/prop-types
                    checked={tagListFilter.journeyIds.some(journeyId => {
                        return journey.id === journeyId;
                    })}
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
                            journeys?.map(journey => createCheckbox(journey))
                        }
                    </>
                )
            }
        </>
    );
};


export default JourneyFilter;
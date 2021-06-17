import { AccordionContent, FiltersContainer, FiltersTypes, FlexDiv, Header, SearchFilters, StyledAccordionHeader, StyledAccordionPanel } from './style';

import { Accordion } from '@equinor/eds-core-react';
import { Button } from '@equinor/eds-core-react';
import Checkbox from '@procosys/components/Checkbox';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';
import { Typography } from '@equinor/eds-core-react';
import EdsIcon from '@procosys/components/EdsIcon';

export interface QuickSearchFiltersProps {
    plantFilterExpanded: boolean;
    setShowFilter: React.Dispatch<React.SetStateAction<boolean>>;
    clearFilters: React.Dispatch<void>;
    setPlantFilterExpanded: React.Dispatch<React.SetStateAction<boolean>>;
    filterPlants: string[];
    selectedPlants: string[];
    onCheckboxPlantFilterChange: (plant: string, checked: boolean) => void;
    typeFilterExpanded: boolean;
    setTypeFilterExpanded: React.Dispatch<React.SetStateAction<boolean>>;
    filterTypes: string[];
    selectedTypes: string[];
    onCheckboxTypeFilterChange: (type: string, checked: boolean) => void;
}

const QuickSearchFilters = ({
    plantFilterExpanded,
    setShowFilter,
    setPlantFilterExpanded,
    filterPlants,
    selectedPlants,
    onCheckboxPlantFilterChange,
    typeFilterExpanded,
    setTypeFilterExpanded,
    filterTypes,
    selectedTypes,
    clearFilters,
    onCheckboxTypeFilterChange
}: QuickSearchFiltersProps): JSX.Element => {

    const getFilterType = (type: string): string => {
        switch (type) {
            case 'C':
                return 'Comm pkg';
            case 'MC':
                return 'MC pkg';
            case 'T':
                return 'Tag';
            case 'PI':
                return "Punch List Item";
            case 'OTHER':
                return 'Other';
            default:
                return 'Other'
        }
    }

    return (
        <FiltersContainer>
            <SearchFilters>
                <Header filterActive={true}>
                    <Typography variant="h1">Filters</Typography>
                    <FlexDiv>
                        <Button variant='ghost' title='Close' onClick={(): void => setShowFilter(false)}>
                            <CloseIcon />
                        </Button>
                    </FlexDiv>                   
                </Header>
                <div style={{display:'flex', justifyContent:'flex-end'}}>
                <Button onClick={clearFilters} variant="ghost">Reset filter</Button>
                </div>
                <FiltersTypes>
                    <Accordion chevronPosition="right" headerLevel="h2">
                        <Accordion.Item isExpanded={plantFilterExpanded} onClick={(): void => setPlantFilterExpanded(prevState => !prevState)}>
                            <StyledAccordionHeader>Plant</StyledAccordionHeader>
                            <StyledAccordionPanel>
                                <AccordionContent>
                                    {
                                        filterPlants.map((plant: string, i: number) => {
                                            return (
                                                <Checkbox
                                                    key={plant}
                                                    checked={selectedPlants.some(elementId => {
                                                        return plant === String(elementId);
                                                    })}
                                                    onChange={(checked: boolean): void => {
                                                        onCheckboxPlantFilterChange(plant, checked);
                                                    }}
                                                >
                                                    <Typography variant='body_long'>{plant}</Typography>
                                                </Checkbox>
                                            )
                                        })
                                    }
                                </AccordionContent>
                            </StyledAccordionPanel>
                        </Accordion.Item>
                        <Accordion.Item isExpanded={typeFilterExpanded} onClick={(): void => setTypeFilterExpanded(prevState => !prevState)}>
                            <StyledAccordionHeader>Type</StyledAccordionHeader>
                            <StyledAccordionPanel>
                                <AccordionContent>
                                    {
                                        filterTypes.map((type: string, i: number) => {
                                            return (
                                                <Checkbox
                                                    key={type}
                                                    checked={selectedTypes.some(elementId => {
                                                        return type === String(elementId);
                                                    })}
                                                    onChange={(checked: boolean): void => {
                                                        onCheckboxTypeFilterChange(type, checked);
                                                    }}
                                                >
                                                    <Typography variant='body_long'>{getFilterType(type)}</Typography>
                                                </Checkbox>
                                            )
                                        })
                                    }
                                </AccordionContent>
                            </StyledAccordionPanel>
                        </Accordion.Item>
                    </Accordion>
                </FiltersTypes>
            </SearchFilters>
        </FiltersContainer>
    );
}

export default QuickSearchFilters;

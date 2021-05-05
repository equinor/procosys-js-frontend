import { Button } from '@equinor/eds-core-react';
import { Typography } from '@equinor/eds-core-react';
import React from 'react';
import { AccordionContent, FiltersContainer, FiltersTypes, Header, SearchFilters, StyledAccordionHeader, StyledAccordionPanel } from './style';
import CloseIcon from '@material-ui/icons/Close';
import { Accordion } from '@equinor/eds-core-react';
import Checkbox from '@procosys/components/Checkbox';

const { AccordionItem } = Accordion;

export interface QuickSearchFiltersProps {
    plantFilterExpanded: boolean;
    setShowFilter: (val: boolean) => void;
    setPlantFilterExpanded: (val: boolean) => void;
    filterPlants: string[];
    selectedPlants: string[];
    onCheckboxPlantFilterChange: (plant: string, checked: boolean) => void;
    typeFilterExpanded: boolean;
    setTypeFilterExpanded: (val: boolean) => void;
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
    onCheckboxTypeFilterChange
}: QuickSearchFiltersProps): JSX.Element => {

    return (
        <FiltersContainer>
            <SearchFilters>
                <Header filterActive={false}>
                    <Typography variant="h1">Filters</Typography>
                    <div style={{ display: 'flex' }}>
                        <Button variant='ghost' title='Close' onClick={(): void => { setShowFilter(false); }}>
                            <CloseIcon />
                        </Button>
                    </div>
                </Header>
                <FiltersTypes>
                    <Accordion chevronPosition="right" headerLevel="h2">
                        <AccordionItem isExpanded={plantFilterExpanded} onClick={(): void => setPlantFilterExpanded(!plantFilterExpanded)}>
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
                        </AccordionItem>
                        <AccordionItem isExpanded={typeFilterExpanded} onClick={(): void => setTypeFilterExpanded(!typeFilterExpanded)}>
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
                                                    <Typography variant='body_long'>{type === 'C' ? 'Comm pkg' : 'MC pkg'}</Typography>
                                                </Checkbox>
                                            )
                                        })
                                    }
                                </AccordionContent>
                            </StyledAccordionPanel>
                        </AccordionItem>
                    </Accordion>
                </FiltersTypes>
            </SearchFilters>
        </FiltersContainer>
    );
}

export default QuickSearchFilters;
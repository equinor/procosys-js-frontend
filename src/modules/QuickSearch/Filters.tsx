import { Button } from '@equinor/eds-core-react';
import { Typography } from '@equinor/eds-core-react';
import React from 'react';
import { AccordionContent, FiltersContainer, FiltersTypes, FlexDiv, Header, SearchFilters, StyledAccordionHeader, StyledAccordionPanel } from './style';
import CloseIcon from '@material-ui/icons/Close';
import { Accordion } from '@equinor/eds-core-react';
import Checkbox from '@procosys/components/Checkbox';

const { AccordionItem } = Accordion;

export interface QuickSearchFiltersProps {
    plantFilterExpanded: boolean;
    setShowFilter: React.Dispatch<React.SetStateAction<boolean>>;
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
    onCheckboxTypeFilterChange
}: QuickSearchFiltersProps): JSX.Element => {

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
                <FiltersTypes>
                    <Accordion chevronPosition="right" headerLevel="h2">
                        <AccordionItem isExpanded={plantFilterExpanded} onClick={(): void => setPlantFilterExpanded(prevState => !prevState)}>
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
                        <AccordionItem isExpanded={typeFilterExpanded} onClick={(): void => setTypeFilterExpanded(prevState => !prevState)}>
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
                                                    <Typography variant='body_long'>{type === 'C' ? 'Comm pkg' : type === 'MC' ? 'MC pkg' : 'Tag'}</Typography>
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

import { Autocomplete } from '@equinor/eds-core-react';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import EdsIcon from '@procosys/components/EdsIcon';
import React, { useEffect, useState } from 'react';
import { Collapse, CollapseInfo } from '../ScopeFilter.style';
import {
    FilterContainer,
    Item,
    SelectedItem,
    SelectedItemsContainer,
} from './MultiSelectFilter.style';

interface Item {
    title: string;
    id: string;
}

type MultiSelectProps = {
    items: Item[];
    headerLabel: string;
    inputLabel: string;
    inputPlaceholder: string;
    selectedItems: string[] | null;
    onChange: (selectedItems: Item[]) => void;
    icon: JSX.Element;
};

const MultiSelectFilter = ({
    items,
    headerLabel,
    inputLabel,
    inputPlaceholder,
    selectedItems,
    onChange,
    icon,
}: MultiSelectProps): JSX.Element => {
    const [selectedItemsState, setSelectedItemsState] = useState<Item[]>([]);
    const [filter, setFilter] = useState<string>('');
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const selectedIds = selectedItems || [];
        const selected: Item[] = selectedIds
            .map((id) => items.find((item) => String(item.id) === String(id)))
            .filter((item): item is Item => !!item);

        setSelectedItemsState(selected);
    }, [selectedItems, items]);

    const onDeselect = (item: Item): void => {
        const newSelectedItems = selectedItemsState.filter(
            (selectedItem) => selectedItem.id !== item.id
        );
        setSelectedItemsState(newSelectedItems);
        onChange(newSelectedItems);
    };

    const onSelectionChanged = ({ selectedItems }: any): void => {
        setSelectedItemsState(selectedItems);
        onChange(selectedItems);
    };

    const selectableItems = items.filter(
        (itm) =>
            filter === '' ||
            itm.title.toLowerCase().includes(filter.toLowerCase())
    );

    const selectedItemsComponents = selectedItemsState.map((item) => (
        <SelectedItem key={item.id} onClick={() => onDeselect(item)}>
            <EdsIcon name="close" size={16} /> {item.title}
        </SelectedItem>
    ));

    return (
        <>
            <Collapse
                isExpanded={isExpanded}
                onClick={(): void => setIsExpanded(!isExpanded)}
                data-testid="MultiSelectHeader"
                filterActive={selectedItemsState.length > 0}
            >
                {icon}
                <CollapseInfo>{headerLabel}</CollapseInfo>
                {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </Collapse>
            {isExpanded && (
                <FilterContainer>
                    <Autocomplete
                        label={inputLabel}
                        options={selectableItems}
                        optionLabel={(option: Item): string => option.title}
                        selectedOptions={selectedItemsState}
                        onOptionsChange={onSelectionChanged}
                        multiple
                    ></Autocomplete>
                    <SelectedItemsContainer>
                        {selectedItemsComponents}
                    </SelectedItemsContainer>
                </FilterContainer>
            )}
        </>
    );
};

export default MultiSelectFilter;

import React, { useEffect, useState } from 'react';
import Dropdown from '@procosys/components/Dropdown';
import { Collapse, CollapseInfo } from '../ScopeFilter.style';
import {
    SelectedItemsContainer,
    Item,
    SelectedItem,
    FilterContainer,
} from './MultiSelectFilter.style';
import EdsIcon from '@procosys/components/EdsIcon';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';

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

    const onSelect = (item: Item): void => {
        if (
            !selectedItemsState.find(
                (selectedItem) => selectedItem.id === item.id
            )
        ) {
            const newSelectedItems = [...selectedItemsState, item];
            setSelectedItemsState(newSelectedItems);
            onChange(newSelectedItems);
        }
    };

    const onDeselect = (item: Item): void => {
        const newSelectedItems = selectedItemsState.filter(
            (selectedItem) => selectedItem.id !== item.id
        );
        setSelectedItemsState(newSelectedItems);
        onChange(newSelectedItems);
    };

    const selectableItems = items
        .filter(
            (itm) =>
                filter === '' ||
                itm.title.toLowerCase().includes(filter.toLowerCase())
        )
        .map((itm) => {
            const isSelected = selectedItemsState.some(
                (selectedItem) => selectedItem.id === itm.id
            );
            return (
                <Item key={itm.id} onClick={() => onSelect(itm)}>
                    {isSelected ? (
                        <EdsIcon name="checkbox" />
                    ) : (
                        <EdsIcon name="checkbox_outline" />
                    )}
                    {itm.title}
                </Item>
            );
        });

    const selectedItemsComponents = selectedItemsState.map((item) => (
        <SelectedItem key={item.id} onClick={() => onDeselect(item)}>
            <EdsIcon name="close" size={16} /> {item.title}
        </SelectedItem>
    ));

    return (
        <>
            <Collapse
                isExpanded={isExpanded}
                onClick={() => setIsExpanded(!isExpanded)}
                data-testid="MultiSelectHeader"
                filterActive={selectedItemsState.length > 0}
            >
                {icon}
                <CollapseInfo>{headerLabel}</CollapseInfo>
                {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </Collapse>
            {isExpanded && (
                <FilterContainer>
                    <Dropdown
                        text={inputPlaceholder}
                        onFilter={setFilter}
                        label={inputLabel}
                    >
                        {selectableItems}
                    </Dropdown>
                    <SelectedItemsContainer>
                        {selectedItemsComponents}
                    </SelectedItemsContainer>
                </FilterContainer>
            )}
        </>
    );
};

export default MultiSelectFilter;

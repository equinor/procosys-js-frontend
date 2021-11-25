import React, { useState, useEffect } from 'react';
import Dropdown from '@procosys/components/Dropdown';
import { Collapse, CollapseInfo } from '../ScopeFilter.style';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import {
    SelectedItemsContainer,
    Item,
    SelectedItem,
    FilterContainer,
} from './MultiSelectFilter.style';
import EdsIcon from '@procosys/components/EdsIcon';

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

const MultiSelectFilter = (props: MultiSelectProps): JSX.Element => {
    const [selectedItems, setSeletectedItems] = useState<Item[]>([]);
    const [filter, setFilter] = useState<string | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if (props.items && props.selectedItems) {
            const selected: Item[] = [];
            props.selectedItems.map((id) => {
                const item = props.items.find(
                    (e) => String(e.id) == String(id)
                );
                if (item) {
                    selected.push(item);
                }
            });
            setSeletectedItems(selected);
        }
    }, [props.selectedItems]);

    const onSelect = (item: Item): void => {
        const newItmList = [...new Set([...selectedItems, item])];
        props.onChange(newItmList);
    };

    const onDeselect = (item: Item): void => {
        const newItmList = selectedItems.filter(
            (itm) => String(itm.id) != String(item.id)
        );
        props.onChange(newItmList);
    };

    const selectableItems = props.items.map((itm) => {
        if (filter && !itm.title.toLowerCase().startsWith(filter.toLowerCase()))
            return;
        const isSelected =
            selectedItems.findIndex(
                (selectedItem) => String(selectedItem.id) === String(itm.id)
            ) > -1;
        return (
            <Item onClick={(): void => onSelect(itm)} key={String(itm.id)}>
                {isSelected ? (
                    <EdsIcon name="checkbox" />
                ) : (
                    <EdsIcon name="checkbox_outline" />
                )}
                {itm.title}
            </Item>
        );
    });

    const selectedItemsComponents = selectedItems.map((e) => {
        return (
            <SelectedItem key={e.id} onClick={(): void => onDeselect(e)}>
                <EdsIcon name="close" size={16} /> {e.title}
            </SelectedItem>
        );
    });

    return (
        <>
            <Collapse
                isExpanded={isExpanded}
                onClick={(): void => setIsExpanded((isExpanded) => !isExpanded)}
                data-testid="MultiSelectHeader"
                filterActive={selectedItems.length > 0}
            >
                {props.icon}
                <CollapseInfo>{props.headerLabel}</CollapseInfo>
                {isExpanded ? (
                    <KeyboardArrowUpIcon />
                ) : (
                    <KeyboardArrowDownIcon />
                )}
            </Collapse>
            {isExpanded && (
                <FilterContainer>
                    <Dropdown
                        text={props.inputPlaceholder}
                        onFilter={setFilter}
                        label={props.inputLabel}
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

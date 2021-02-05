import { Collapse, CollapseInfo } from '../index.style';
import { FilterContainer, Item, SelectedItem, SelectedItemsContainer } from './index.style';
import React, { useEffect, useState } from 'react';

import Dropdown from '@procosys/components/Dropdown';
import EdsIcon from '@procosys/components/EdsIcon';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

interface Item {
    title: string;
    id: string;
}

type SelectProps = {
    items: Item[];
    headerLabel: string;
    inputLabel: string;
    inputPlaceholder: string;
    selectedItem: string | null;
    onChange: (selectedItems: Item) => void;
    icon: JSX.Element;
}

const SelectFilter = (props: SelectProps): JSX.Element => {

    const [selectedItem, setSeletectedItem] = useState<string>();
    const [filter, setFilter] = useState<string | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if (props.items && props.selectedItem) {
            // let selected: Item;
            // props.selectedItem.map((id) => {
            //     const item = props.items.find((e) => String(e.id) == String(id));
            //     if (item) {
            //         selected.push(item);
            //     }
            // });
            setSeletectedItem(props.selectedItem);
        }
    }, [props.selectedItem]);

    const onSelect = (item: Item): void => {
        // const newItmList = [...new Set([...selectedItems, item])];
        props.onChange(item);
    };

    const onDeselect = (item: string): void => {
        // const newItmList = selectedItems.filter(itm => String(itm.id) != String(item.id));
        // props.onChange(undefined);
    };

    const selectableItems = props.items.map(itm => {
        if (filter && !itm.title.toLowerCase().startsWith(filter.toLowerCase())) return;
        // const isSelected = selectedItems.findIndex(selectedItem => String(selectedItem.id) === String(itm.id)) > -1;
        const isSelected = selectedItem && selectedItem === itm.id;
        return (<Item onClick={(): void => onSelect(itm)} key={String(itm.id)}>
            {isSelected ? <EdsIcon name="checkbox" /> : <EdsIcon name="checkbox_outline" />}
            {itm.title}
        </Item>);
    });

    // const selectedItemsComponents = selectedItems.map(e => {
    //     return (<SelectedItem key={e.id} onClick={(): void => onDeselect(e)}><EdsIcon name="close" size={16} /> {e.title}</SelectedItem>);
    // });
    const selectedItemsComponent = (): JSX.Element | undefined => {return selectedItem ? (<SelectedItem key={selectedItem} onClick={(): void => onDeselect(selectedItem)}><EdsIcon name="close" size={16} /> {selectedItem}</SelectedItem>) : undefined;};

    return (
        <>
            <Collapse isExpanded={isExpanded} onClick={(): void => setIsExpanded((isExpanded) => !isExpanded)} data-testid="MultiSelectHeader" filterActive={!!selectedItem} >
                {props.icon}
                <CollapseInfo>
                    {props.headerLabel}
                </CollapseInfo>
                {
                    isExpanded
                        ? <KeyboardArrowUpIcon />
                        : <KeyboardArrowDownIcon />
                }
            </Collapse>
            {
                isExpanded && (
                    <FilterContainer>
                        <Dropdown text={props.inputPlaceholder} onFilter={setFilter} label={props.inputLabel}>
                            {selectableItems}
                        </Dropdown>
                        <SelectedItemsContainer>
                            {selectedItemsComponent}
                        </SelectedItemsContainer>
                    </FilterContainer>
                )
            }

        </>
    );
};


export default SelectFilter;

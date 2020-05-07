import React, {useState} from 'react';
import Dropdown from '@procosys/components/Dropdown';
import { Collapse, CollapseInfo } from '../ScopeFilter.style';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import {SelectedItemsContainer, Item, SelectedItem, FilterContainer} from './MultiSelectFilter.style';
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
    onChange: (selectedItems: Item[]) => void;
}

const MultiSelectFilter = (props: MultiSelectProps): JSX.Element => {

    const [selectedItems, setSeletectedItems] = useState<Item[]>([]);
    const [filter, setFilter] = useState<string|null>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const onSelect = (item: Item): void => {
        setSeletectedItems(
            (itms: Item[]) => {
                const newItmList = [...new Set([...itms, item])];
                props.onChange(newItmList);
                return newItmList;
            });
    };

    const onDeselect = (item: Item): void => {
        setSeletectedItems(itms => {
            const newItmList = itms.filter(itm => itm.id != item.id);
            props.onChange(newItmList);
            return newItmList;
        });
    };

    const selectableItems = props.items.map(itm => {
        if (filter && !itm.title.startsWith(filter)) return;
        const isSelected = selectedItems.findIndex(selectedItem => selectedItem.id === itm.id) > -1;
        return (<Item onClick={(): void => onSelect(itm)} key={itm.id}>
            {isSelected ? <EdsIcon name="checkbox" /> : <EdsIcon name="checkbox_outline" />}
            {itm.title}
        </Item>);
    });

    const selectedItemsComponents = selectedItems.map(e => {
        return (<SelectedItem key={e.id} onClick={(): void => onDeselect(e)}><EdsIcon name="close" size={16} /> {e.title}</SelectedItem>);
    });

    return (
        <>
            <Collapse isExpanded={isExpanded} onClick={(): void => setIsExpanded((isExpanded) => !isExpanded)} data-testid="MultiSelectHeader">
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
                            {selectedItemsComponents}
                        </SelectedItemsContainer>
                    </FilterContainer>
                )
            }

        </>
    );
};


export default MultiSelectFilter;

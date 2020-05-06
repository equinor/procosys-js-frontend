import React, {useState} from 'react';
import Dropdown from '@procosys/components/Dropdown';

interface Item {
    title: string;
    id: string;
}

type MultiSelectProps = {
    items: Item[];
    onChange: (selectedItems: Item[]) => void;
}

const MultiSelectFilter = (props: MultiSelectProps): JSX.Element => {

    const [selectedItems, setSeletectedItems] = useState<Item[]>([]);
    const [filter, setFilter] = useState<string|null>(null);

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
        return <div onClick={(): void => onSelect(itm)} key={itm.id}>{itm.title}</div>;
    });
    return (
        <>
            <Dropdown text="Select" onFilter={setFilter}>
                {selectableItems}
            </Dropdown>
            <div>
                {selectedItems.map(e => {
                    return (<span key={e.id} onClick={(): void => onDeselect(e)}>{e.title}</span>);
                })}
            </div>
        </>
    );
};


export default MultiSelectFilter;

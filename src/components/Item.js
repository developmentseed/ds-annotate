import { useContext } from "react";

import { BsTrash } from "react-icons/bs";
import { MainContext } from "./../contexts/MainContext";
import { storeItems } from "./../store/indexedDB";

const Item = ({ item }) => {
  const { items, dispatchSetItems, dispatchSetHighlightedItem } =
    useContext(MainContext);

  const deleteItem = (item) => {
    const newItems = items.filter((i) => {
      return i.id_ !== item.id_;
    });
    dispatchSetItems({
      type: "SET_ITEMS",
      payload: newItems,
    });
    // Delete from DB
    const id = `${item.values_.id}${item.values_.class}`;
    storeItems.deleteData(id);
  };

  const zoomToItem = (item) => {
    dispatchSetHighlightedItem({
      type: "SET_HIGHLIGHTED_ITEM",
      payload: item,
    });
  };

  return (
    <div
      className="inline-flex justify-center items-center pr-1 pl-1 ml-1 text-xs font-medium rounded-full cursor-pointer"
      style={{ background: `${item.values_.color}` }}
      onMouseEnter={() => {
        zoomToItem(item);
      }}
      onMouseLeave={() => {
        zoomToItem(null);
      }}
    >
      <BsTrash
        className="fill-current w-3 h-3 mr-1 cursor-pointer"
        onClick={() => {
          deleteItem(item);
          zoomToItem(null);
        }}
        title="Delete item"
      ></BsTrash>
      <span>{item.values_.id}</span>
    </div>
  );
};

export default Item;

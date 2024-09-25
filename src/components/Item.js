import { useContext, useEffect } from "react";
import { BsTrash } from "react-icons/bs";
import { MainContext } from "./../contexts/MainContext";
import { storeItems } from "./../store/indexedDB";
import { olFeatures2Features } from "../utils/convert";

const Item = ({ item, index }) => {
  console.log(item)
  const { items, dispatchSetItems, dispatchSetHighlightedItem } =
    useContext(MainContext);

  const deleteItem = (item) => {
    const newItems = items.filter((i) => {
      return i.values_.id !== item.values_.id;
    });
    dispatchSetItems({
      type: "SET_ITEMS",
      payload: newItems,
    });
    // Delete from DB
    console.log(item.values_.id)
    storeItems.deleteData(item.values_.id);
  };

  const zoomToItem = (item) => {
    dispatchSetHighlightedItem({
      type: "SET_HIGHLIGHTED_ITEM",
      payload: item,
    });
  };

  // useEffect(() => {
  //   console.log('%cItem.js line:30 items', 'color: #007acc;', items);
  //   storeItems.addListData(olFeatures2Features(items)).then(data=>{
  //     console.log('%cItem.js line:33 save', 'color: #007acc;', data);
  //   })
  // }, [items]);

  return (
    <div
      className="inline-flex justify-center items-center pr-1 pl-1 ml-1 text-xs text-slate-900 font-medium rounded-full cursor-pointer"
      style={{ background: `${item.values_.color}` }}
      onMouseEnter={() => {
        zoomToItem(item);
      }}
      onMouseLeave={() => {
        zoomToItem({});
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
      <span>{index}</span>
    </div>
  );
};

export default Item;

import { useContext } from "react";
import { MainContext } from "../contexts/MainContext";
import { EncodeItem } from "./EncodeItem";
export const MenuEncodeItems = () => {
  const { encodeItems } = useContext(MainContext);
  return (
    <div className="mt-8">
      <div
        className="absolute bg-white bg-opacity-70 p-1 mt-2 mr-1 right-0 top-0 scroll-smooth hover:scroll-auto overflow-auto overscroll-y-contain"
        style={{ maxHeight: `calc(100% - 30px)`, height: `auto` }}
      >
        {encodeItems.length > 0 ? (
          <h1 className="text-xs font-bold text-center text-back mb-2">
            Encode Areas
          </h1>
        ) : (
          <></>
        )}
        <div className="w-100">
          {encodeItems.map((encodeItem, index) => (
            <EncodeItem key={index} encodeItem={encodeItem} />
          ))}
        </div>
      </div>
    </div>
  );
};

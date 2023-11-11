import React, { useContext, useCallback } from "react";
import { MainContext } from "../contexts/MainContext";

export const DecodeType = ({ setRequestMultipoint }) => {
  const {
    pointsSelector,
    dispatchSetPointsSelector,
    decoderType,
    dispatchDecoderType,
  } = useContext(MainContext);

  const setDecodeType = (decodeType) => {
    dispatchDecoderType({
      type: "SET_DECODER_TYPE",
      payload: decodeType,
    });

    if (decodeType == "single_point" && pointsSelector.length > 0) {
      dispatchSetPointsSelector({
        type: "SET_SINGLE_POINT",
        payload: pointsSelector[pointsSelector.length - 1],
      });
    }
  };

  return (
    <div className="flex flex-row mt-3">
      {decoderType == "single_point" ? (
        <>
          <button
            className={`custom_button w-full bg-orange-ds text-white`}
            onClick={() => setDecodeType("multi_point")}
          >
            {`Active Multi point`}
          </button>
        </>
      ) : (
        <button
          className={`custom_button w-full bg-orange-ds text-white`}
          onClick={() => setDecodeType("single_point")}
        >
          {`Active Single point`}
        </button>
      )}

      <button
        className={`custom_button w-full`}
        onClick={() => setRequestMultipoint(true)}
      >
        {`Request SAM `}
      </button>
    </div>
  );
};

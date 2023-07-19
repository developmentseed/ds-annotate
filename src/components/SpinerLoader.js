import React, { useContext } from "react";
import { ScaleLoader } from "react-spinners";
import { MainContext } from "../contexts/MainContext";

export const SpinerLoader = () => {
  const { spinnerLoading } = useContext(MainContext);
  return (
    <>
      {spinnerLoading ? (
        <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center z-10">
          <ScaleLoader
            width={5}
            height={70}
            color={"#EF4444"}
            loading={spinnerLoading}
          />
        </div>
      ) : null}
    </>
  );
};

import { ScaleLoader } from "react-spinners";

export const SpinerLoader = ({ spinnerLoading }) => {
  return (
    <div className="child absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center z-10">
      <ScaleLoader size={200} color={"#EF4444"} loading={spinnerLoading} />
    </div>
  );
};

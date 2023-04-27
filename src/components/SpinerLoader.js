import { ScaleLoader } from 'react-spinners';
export const SpinerLoader = ({ loading }) => {
  return (
    <div className="child absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center">
      <ScaleLoader
        size={200}
        loading={loading}
      />
    </div>
  );
};

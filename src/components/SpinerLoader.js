import { ScaleLoader } from 'react-spinners';
export const SpinerLoader = ({ loading }) => {
  return (
    <div className="flex items-center justify-center h-screen absolute top-0 left-0 right-0 bottom-0">
      <ScaleLoader
        size={200}
        loading={loading}
      />
    </div>
  );
};

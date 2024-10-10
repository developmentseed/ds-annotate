import React, { useContext, useState, useEffect } from "react";
import { MainContext } from "../contexts/MainContext";
import { getRequest } from "../utils/requests";

export const ApiService = () => {
  const {
    map,
    pointsSelector,
    activeProject,
    activeClass,
    dispatchSetItems,
    items,
    encodeItems,
    dispatchEncodeItems,
    activeEncodeImageItem,
    dispatchActiveEncodeImageItem,
    setSpinnerLoading,
  } = useContext(MainContext);
  
  const [apiDetails, setApiDetails] = useState({
    gpu: { gpu: false },
    cpu: { cpu_percent: 0 },
    memory: { memory_percent: 0 },
  });

  useEffect(() => {
    const requestApiServiceDetails = async () => {
      try {
        const result = await getRequest("");
        result && setApiDetails(result);
      } catch (error) {
        console.error("Error fetching API details:", error);
      }
    };
    requestApiServiceDetails();
  }, [
    map,
    pointsSelector,
    activeProject,
    activeClass,
    dispatchSetItems,
    items,
    encodeItems,
    dispatchEncodeItems,
    activeEncodeImageItem,
    dispatchActiveEncodeImageItem,
    setSpinnerLoading,
  ]);

  return (
    <div className="flex space-x-4 mt-2">
      <span
        className={`inline-flex justify-center items-center text-[10px] font-medium rounded pr-4 pl-4 ${
          apiDetails.gpu.gpu ? "text-green-800 bg-green-200" : "text-yellow-800 bg-yellow-200"
        }`}
      >
        {apiDetails.gpu.gpu ? "GPU Active" : "CPU Mode"}
        {apiDetails.gpu.gpu && (
          <>
            {` | Device: ${apiDetails.gpu.device_name}`}
            {` | GPUs: ${apiDetails.gpu.num_gpus}`}
            {` | GPU Memory Total: ${apiDetails.gpu.gpu_memory_total}`}
            {` | GPU Memory Allocated: ${apiDetails.gpu.gpu_memory_allocated}`}
            {` | GPU Memory Cached: ${apiDetails.gpu.gpu_memory_cached}`}
            {` | GPU Memory Free: ${apiDetails.gpu.gpu_memory_free}`}
          </>
        )}
        {` | CPU Usage: ${apiDetails.cpu.cpu_percent}%`}
        {` | CPU Cores: ${apiDetails.cpu.cpu_cores}`}
        {` | Logical CPU Cores: ${apiDetails.cpu.cpu_logical_cores}`}
        {` | Memory Usage: ${apiDetails.memory.memory_percent}%`}
        {` | Total Memory: ${apiDetails.memory.total_memory}`}
        {` | Used Memory: ${apiDetails.memory.used_memory}`}
        {` | Free Memory: ${apiDetails.memory.free_memory}`}
      </span>
    </div>
  );
};
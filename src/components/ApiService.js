import React, { useContext, useState, useEffect } from "react";
import { MainContext } from "../contexts/MainContext";
import { getRequest } from "../utils/requests";

export const ApiService = () => {
  const {
    map,
    pointsSelector: ps,
    activeProject: ap,
    activeClass: ac,
    dispatchSetItems: dsi,
    items,
    encodeItems: ei,
    dispatchEncodeItems: dei,
    activeEncodeImageItem: aei,
    dispatchActiveEncodeImageItem: daei,
    setSpinnerLoading: ssl,
  } = useContext(MainContext);

  const [apiDetails, setApiDetails] = useState({
    device: "",
    gpu: {
      device_name: "",
      num_gpus: 0,
      gpu_memory_total: "",
      gpu_memory_allocated: "",
      gpu_memory_cached: "",
      gpu_memory_free: "",
    },
    cpu: {
      cpu_percent: 0,
      cpu_cores: 0,
      cpu_logical_cores: 0,
    },
    memory: {
      total_memory: "",
      used_memory: "",
      free_memory: "",
      memory_percent: 0,
    },
  });

  useEffect(() => {
    const fetchApiDetails = async () => {
      try {
        const result = await getRequest("");
        result && setApiDetails(result);
      } catch (err) {
        console.error("Error:", err);
      }
    };
    fetchApiDetails();
  }, [map, ps, ap, ac, dsi, items, ei, dei, aei, daei, ssl]);

  return (
    <div className="flex space-x-4">
      <span
        className={`inline-flex justify-center items-center text-[10px] font-medium  p-2 ${
          apiDetails.device === "cuda"
            ? "text-green-800 bg-green-200"
            : "text-yellow-800 bg-yellow-200"
        }`}
      >
        {apiDetails.device === "cuda" ? "GPU Active" : "CPU Mode"}
        {apiDetails.device === "cuda" && (
          <>
            {` | Dev: ${apiDetails.gpu.device_name}`}
            {` | GPUs: ${apiDetails.gpu.num_gpus}`}
            {` | Total Mem: ${apiDetails.gpu.gpu_memory_total}`}
            {` | Alloc Mem: ${apiDetails.gpu.gpu_memory_allocated}`}
            {` | Cached Mem: ${apiDetails.gpu.gpu_memory_cached}`}
            {` | Free Mem: ${apiDetails.gpu.gpu_memory_free}`}
          </>
        )}
        {` | CPU: ${apiDetails.cpu.cpu_percent}%`}
        {` | Cores: ${apiDetails.cpu.cpu_cores}`}
        {` | Log Cores: ${apiDetails.cpu.cpu_logical_cores}`}
        {` | Mem Use: ${apiDetails.memory.memory_percent}%`}
        {` | Total: ${apiDetails.memory.total_memory}`}
        {` | Used: ${apiDetails.memory.used_memory}`}
        {` | Free: ${apiDetails.memory.free_memory}`}
      </span>
    </div>
  );
};

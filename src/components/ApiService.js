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
    }, [map,
        pointsSelector,
        activeProject,
        activeClass,
        dispatchSetItems,
        items,
        encodeItems,
        dispatchEncodeItems,
        activeEncodeImageItem,
        dispatchActiveEncodeImageItem,
        setSpinnerLoading]);

    return (
        <div className="flex space-x-4">
            <span className={`inline-flex justify-center items-center text-[10px] font-medium rounded pr-4 pl-4 ${apiDetails.gpu.gpu ? "text-green-800 bg-green-400" : "text-gray-800 bg-gray-200"}`}>
                {`GPU: ${apiDetails.gpu && apiDetails.gpu.gpu ? `${apiDetails.gpu.device}` : "Desactive"}`}
                {apiDetails.gpu && apiDetails.gpu.gpu? `, CPU: ${apiDetails.cpu.cpu_percent}%, Memory: ${apiDetails.memory.memory_percent}%`:""}
            </span>
        </div>
    );
};
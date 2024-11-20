import React, { useState, useEffect, useRef } from "react";
import { ChromePicker } from "react-color";
import { FaPalette } from "react-icons/fa";

export const CreateProjectModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: "",
        imagery_type: "tms",
        imagery_url: "",
        project_bbox: "",
    });

    const [classes, setClasses] = useState([{ name: "", color: "#00FFFF" }]);
    const [activeColorPicker, setActiveColorPicker] = useState(null);

    const colorPickerRef = useRef(null);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                colorPickerRef.current &&
                !colorPickerRef.current.contains(event.target)
            ) {
                setActiveColorPicker(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleClassChange = (index, key, value) => {
        const updatedClasses = [...classes];
        updatedClasses[index][key] = value;
        setClasses(updatedClasses);
    };

    const addNewClass = () => {
        setClasses([...classes, { name: "", color: "#FF00FF" }]);
    };

    const removeClass = (index) => {
        const updatedClasses = classes.filter((_, i) => i !== index);
        setClasses(updatedClasses);
    };

    const handleSubmit = (e) => {
        e.preventDefault();


        const classesParam = classes
            .filter((cls) => cls.name.trim() !== "")
            .map((cls) => `${cls.name.trim()},${cls.color.replace("#", "")}`)
            .join("|");


        const updatedFormData = {
            ...formData,
            project_bbox: formData.project_bbox || "-180,-90,180,90",
        };


        const url = `http://devseed.com/ds-annotate?classes=${classesParam}&project=${encodeURIComponent(
            updatedFormData.name
        )}&imagery_type=${updatedFormData.imagery_type}&imagery_url=${encodeURIComponent(
            updatedFormData.imagery_url
        )}&project_bbox=${updatedFormData.project_bbox}`;


        console.log("Generated URL:", url);


        window.open(url, "_blank");


        setFormData({
            name: "",
            imagery_type: "tms",
            imagery_url: "",
            project_bbox: "",
        });
        setClasses([{ name: "", color: "#00FFFF" }]);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white p-6 rounded-lg shadow-lg w-1/2 h-3/4 overflow-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold mb-4">Create New Project</h2>
                <form onSubmit={handleSubmit}>
                    {/* Name Field */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Project Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Farms Mapping"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            required
                        />
                    </div>

                    {/* Classes Section */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Classes
                        </label>
                        {classes.map((cls, index) => (
                            <div key={index} className="flex items-center gap-4 mb-4">
                                {/* Class Name */}
                                <input
                                    type="text"
                                    value={cls.name}
                                    onChange={(e) =>
                                        handleClassChange(index, "name", e.target.value)
                                    }
                                    placeholder="Class name (e.g., farm)"
                                    className="mt-1 block w-1/2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    style={{
                                        backgroundColor: cls.color,
                                        color: "#fff",
                                    }}
                                />
                                {/* Color Picker Icon */}
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setActiveColorPicker(
                                                activeColorPicker === index ? null : index
                                            )
                                        }
                                        className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                                    >
                                        <FaPalette className="text-xl text-gray-700" />
                                    </button>
                                    {activeColorPicker === index && (
                                        <div
                                            ref={colorPickerRef}
                                            className="absolute z-50 mt-2"
                                        >
                                            <ChromePicker
                                                color={cls.color}
                                                onChangeComplete={(color) =>
                                                    handleClassChange(index, "color", color.hex)
                                                }
                                            />
                                        </div>
                                    )}
                                </div>
                                {/* Remove Class Button */}
                                {index > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => removeClass(index)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                        {/* Add Class Button */}
                        <button
                            type="button"
                            onClick={addNewClass}
                            className="mt-2 text-red-600 hover:text-indigo-800"
                        >
                            + Add New Class
                        </button>
                    </div>

                    {/* Imagery Type Field */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Imagery Type
                        </label>
                        <select
                            name="imagery_type"
                            value={formData.imagery_type}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            <option value="tms">TMS (Tile Map Service)</option>
                            <option value="wms">WMS (Web Map Service)</option>
                        </select>
                    </div>

                    {/* Imagery URL Field */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Imagery URL
                        </label>
                        <input
                            type="url"
                            name="imagery_url"
                            value={formData.imagery_url}
                            onChange={handleInputChange}
                            placeholder="https://example.com/tiles/{z}/{x}/{y}.png"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    {/* Project BBox Field */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Project BBox
                        </label>
                        <input
                            type="text"
                            name="project_bbox"
                            value={formData.project_bbox}
                            onChange={handleInputChange}
                            placeholder="-90.319317,38.482965,-90.247220,38.507418"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    {/* Modal Buttons */}
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 rounded-md text-gray-700 mr-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 custom_button bg-orange-ds text-white rounded-md hover:bg-indigo-700"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
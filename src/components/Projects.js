import React, { useContext, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { MainContext } from "../contexts/MainContext";
import { getClassLayers } from "../utils/convert";
import { getProjectTemplate } from "../utils/utils";
import { CreateProjectModal } from "./CreateProjectModal";

import { MenuTemplate } from "./MenuTemplate";
import { BsFolder2 } from "react-icons/bs";

export const Projects = () => {
  const {
    projects,
    dispatchSetActiveProject,
    dispatchSetActiveClass,
    dispatchActiveEncodeImageItem,
  } = useContext(MainContext);
  const [projectName, setProjectName] = useState("Projects");
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newProjectName, setNewProjectName] = useState(""); // State for new project name

  const setProject = useCallback(
    (project) => {
      // Set active project
      dispatchSetActiveProject({
        type: "SET_ACTIVE_PROJECT",
        payload: project,
      });

      // Set Active class the first in the list
      const classLayers = getClassLayers(project);
      dispatchSetActiveClass({
        type: "SET_ACTIVE_CLASS",
        payload: classLayers[0],
      });

      setProjectName(project.properties.name);

      // Set active encode image to null
      dispatchActiveEncodeImageItem({
        type: "SET_ACTIVE_ENCODE_IMAGE",
        payload: null,
      });
    },
    [dispatchSetActiveClass, dispatchSetActiveProject]
  );

  // Load project from query
  const [searchParams] = useSearchParams();

  useEffect(() => {
    let projectFeature = getProjectTemplate(searchParams);
    if (!projectFeature) {
      // If the project was not set in the URL, find the projects by slug on the existing list,
      const projectSlug = searchParams.get("project");
      if (projectSlug) {
        const listProjectFound = projects.features.filter((p) => {
          return p.properties.slug === projectSlug;
        });
        if (listProjectFound.length > 0) {
          projectFeature = listProjectFound[0];
        }
      }
    }
    if (projectFeature) {
      setProject(projectFeature);
    }
  }, [searchParams]);

  // Function to handle creating a new project
  const handleCreateNewProject = () => {
    if (!newProjectName.trim()) return alert("Project name cannot be empty!");

    // Example: Add a new project to the list
    const newProject = {
      properties: {
        name: newProjectName,
        slug: newProjectName.toLowerCase().replace(/\s+/g, "-"),
      },
    };

    // Update the projects list in MainContext (this is an example; adjust based on your context logic)
    const updatedProjects = {
      ...projects,
      features: [...projects.features, newProject],
    };

    // Assuming there is a function to update projects in the context
    dispatchSetActiveProject({
      type: "UPDATE_PROJECTS",
      payload: updatedProjects,
    });

    // Reset the input field
    setNewProjectName("");

    // Optionally set the new project as active
    setProject(newProject);
  };

  return (
    <MenuTemplate
      title={projectName}
      badge={""}
      icon={<BsFolder2 />}
      openMenu={isOpen}
      setOpenMenu={setIsOpen}
    >
      <div>
        <ul className="pt-1">
          {projects.features.map((feature) => (
            <Link
              key={feature.properties.slug}
              className={`subMenuHeader hoverAnimation ${
                projectName === feature.properties.name
                  ? "bg-slate-300"
                  : "bg-white"
              }`}
              onClick={() => {
                setProject(feature);
                setIsOpen(false);
              }}
              to={`?project=${feature.properties.slug}`}
            >
              {feature.properties.name}
            </Link>
          ))}
        </ul>
        {/* Add New Project Section */}
        <div>
      <div className="mt-4">
        {/* Button to open the modal */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="custom_button w-full"
        >
          Create New Project
        </button>
      </div>

      {/* Modal Component */}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        // onSubmit={handleFormSubmit}
        // formData={formData}
        // setFormData={setFormData}
      />
    </div>
      </div>
    </MenuTemplate>
  );
};
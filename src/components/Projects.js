import React, { useContext, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { MainContext } from "../contexts/MainContext";
import { getClassLayers } from "../utils/convert";
import { getProjectTemplate } from "../utils/utils";
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
  const [openMenu, setOpenMenu] = useState(false);

  const setProject = useCallback(
    (project) => {
      //Set active project
      dispatchSetActiveProject({
        type: "SET_ACTIVE_PROJECT",
        payload: project,
      });

      //Set Active class the first in the list
      const classLayers = getClassLayers(project);
      dispatchSetActiveClass({
        type: "SET_ACTIVE_CLASS",
        payload: classLayers[0],
      });

      setProjectName(project.properties.name);

      //Set active encode image to null
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
      //If the project was not set in the URL, find the projects by slug on the existing list,
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

  return (
    <MenuTemplate
      title={projectName}
      badge={""}
      icon={<BsFolder2 />}
      openMenu={openMenu}
      setOpenMenu={setOpenMenu}
    >
      <div>
        <ul className="pt-1">
          {projects.features.map((feature) => (
            <Link
              key={feature.properties.slug}
              className="subMenuHeader hoverAnimation"
              onClick={() => {
                setProject(feature);
                setOpenMenu(false);
              }}
              to={`?project=${feature.properties.slug}`}
            >
              {feature.properties.name}
            </Link>
          ))}
        </ul>
      </div>
    </MenuTemplate>
  );
};

import React, { useContext, useState, useEffect, useCallback } from "react";
import { BsChevronDown, BsViewList } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useParams, useSearchParams } from "react-router-dom";

import { MainContext } from "../contexts/MainContext";
import { getClassLayers } from "../utils/convert";
import { getProjectTemplate } from "../utils/utils";
import { MenuTemplate } from "./MenuTemplate";

export const Projects = () => {
  const {
    projects,
    dispatchSetActiveProject,
    dispatchSetActiveClass,
    dispatchActiveEncodeImageItem,
  } = useContext(MainContext);
  const [projectName, setProjectName] = useState("Projects");

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

  let { slug } = useParams();

  useEffect(() => {
    const filtered = projects.features.filter(
      (p) => p.properties.slug === slug
    );
    if (filtered.length) setProject(filtered[0]);
  }, [slug, projects.features, setProject]);

  // Load project from query
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const projectFeature = getProjectTemplate(searchParams);
    if (projectFeature) {
      setProject(projectFeature);
    }
  }, [searchParams]);

  return (
    <MenuTemplate title={projectName} badge={""}>
      <div>
        <ul className="pt-1">
          {projects.features.map((feature) => (
            <Link
              key={feature.properties.slug}
              className="subMenuHeader hoverAnimation"
              onClick={() => {
                setProject(feature);
              }}
              to={`/project/${feature.properties.slug}`}
            >
              {feature.properties.name}
              {/* <Link to={`/project/${feature.properties.slug}`} className="w-full">
                
              </Link> */}
            </Link>
          ))}
        </ul>
      </div>
    </MenuTemplate>
  );
};

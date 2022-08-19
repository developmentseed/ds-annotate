import React, { useContext, useState, useEffect, useCallback } from 'react';
import { BsChevronDown, BsViewList } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { useParams, useSearchParams } from 'react-router-dom';

import { MainContext } from './../contexts/MainContext';
import { getClassLayers } from './../utils/featureCollection';
import { getProjectTemplate } from './../utils/utils';

export const MenuProjects = () => {
  const { projects, dispatchSetActiveProject, dispatchSetActiveClass } =
    useContext(MainContext);
  const [openMenu, setOpenMenu] = useState(false);
  const [projectName, setProjectName] = useState('Projects');

  const setProject = useCallback((project) => {
    dispatchSetActiveProject({
      type: 'SET_ACTIVE_PROJECT',
      payload: project,
    });

    const classLayers = getClassLayers(project);
    dispatchSetActiveClass({
      type: 'SET_ACTIVE_CLASS',
      payload: classLayers[0],
    });

    setProjectName(project.properties.name);
  }, [dispatchSetActiveClass, dispatchSetActiveProject]);

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
  }, [searchParams, setProject]);

  return (
    <div>
      <div
        className="menuHeader"
        onClick={() => {
          setOpenMenu(!openMenu);
        }}
      >
        <BsViewList></BsViewList>
        <span className=" text-base font-medium flex-1 duration-200 false">
          {projectName}
        </span>
        <BsChevronDown></BsChevronDown>
      </div>
      {openMenu && (
        <div>
          <ul className="pt-2">
            {projects.features.map((feature, index) => (
              <li
                key={index}
                className="subMenuHeader hoverAnimation"
                onClick={() => {
                  setOpenMenu(!openMenu);
                  setProject(feature);
                }}
              >
                <Link to={`/project/${feature.properties.slug}`}>
                  {feature.properties.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

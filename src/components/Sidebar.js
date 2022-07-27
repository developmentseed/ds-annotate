import React from 'react';
import { useContext, useState, useEffect } from 'react';
import { MainContext } from '../contexts/MainContext';
import { BsChevronDown, BsViewList } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { getClassLayers } from '../utils/featureCollection';
import { Header } from './Header';

import { MenuProjects } from './MenuProjects';
import { MenuClass } from './MenuClass';
import { MenuItems } from './MenuItems';
import { DownloadData } from './DownloadData';
// import { MapWrapper } from './map';

export const Sidebar = () => {
  const { projects, dispatchSetActiveProject, dispatchSetActiveClass } =
    useContext(MainContext);
  const [openMenu, setOpenMenu] = useState(false);
  const [projectName, SetProjectName] = useState('Projects');

  let { slug } = useParams();

  useEffect(() => {
    const filtered = projects.features.filter(
      (p) => p.properties.slug === slug
    );
    if (filtered.length) setProject(filtered[0]);
  }, [slug]);

  const setProject = (project) => {
    dispatchSetActiveProject({
      type: 'SET_ACTIVE_PROJECT',
      payload: project,
    });

    const classLayers = getClassLayers(project);
    dispatchSetActiveClass({
      type: 'SET_ACTIVE_CLASS',
      payload: classLayers[0],
    });

    SetProjectName(project.properties.name);
  };

  return (
    <aside>
      <div className="overflow-y-auto pt-2 pb-2 pl-3">
        <Header></Header>
      </div>
      <div className="overflow-y-auto pr-2 pl-2">
        <MenuProjects></MenuProjects>
        <MenuClass></MenuClass>
        <MenuItems></MenuItems>
        <DownloadData></DownloadData>

        {/* <ul className="space-y-2">
  
        </ul> */}
      </div>
    </aside>
  );
};

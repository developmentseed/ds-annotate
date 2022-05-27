import { useEffect, useState, useReducer } from 'react';
import { useParams } from 'react-router-dom';

import { ProjectContext } from '../contexts/ProjectContext';
import { MapWrapper } from './map';
import projects from '../../static/projects.json';
import { ClassLayers } from './classLayers';

import { activeClassReducer } from '../reducers';

export const Project = ({ dlGeojsonStatus }) => {
  const [project, setProject] = useState();
  const [activeClass, dispatchSetActiveClass] = useReducer(
    activeClassReducer,
    null
  );
  let { slug } = useParams();

  useEffect(() => {
    const filtered = projects.features.filter(
      (p) => p.properties.slug === slug
    );
    if (filtered.length) setProject(filtered[0]);
  }, [slug]);

  return (
    <ProjectContext.Provider
      value={{ project, activeClass, dispatchSetActiveClass }}
    >
      {project && <ClassLayers project={project} activeClass={activeClass} />}
      <MapWrapper project={project} dlGeojsonStatus={dlGeojsonStatus} />
    </ProjectContext.Provider>
  );
};

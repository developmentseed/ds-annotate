import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';

import { ProjectContext } from '../contexts/ProjectContext';
import { MapWrapper } from './map';
import { ClassLayers } from './classLayers';

import { MainContext } from './../contexts/Maincontext';

export const Project = () => {
  const { projects } = useContext(MainContext);

  const [project, setProject] = useState();
  let { slug } = useParams();

  useEffect(() => {
    const filtered = projects.features.filter(
      (p) => p.properties.slug === slug
    );
    if (filtered.length) setProject(filtered[0]);
  }, [slug]);

  return (
    <ProjectContext.Provider value={project}>
      {project && <ClassLayers project={project} />}
      <MapWrapper project={project} />
    </ProjectContext.Provider>
  );
};

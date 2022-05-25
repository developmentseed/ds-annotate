import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { ProjectContext } from '../contexts/ProjectContext';
import { MapWrapper } from './map';
import projects from '../../static/projects.json';
import { ClassLayers } from './classLayers';
export const Project = () => {
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

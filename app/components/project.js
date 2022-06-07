import { useEffect, useState, useReducer, useContext } from 'react';
import { useParams } from 'react-router-dom';

import { ProjectContext } from '../contexts/ProjectContext';
import { MapWrapper } from './map';
// import projects from '../../static/projects.json';
import { ClassLayers } from './classLayers';

// import { activeClassReducer } from '../reducers';
import { MainContext } from './../contexts/Maincontext';

export const Project = () => {
  const { projects } = useContext(MainContext);

  const [project, setProject] = useState();

  let { slug } = useParams();

  useEffect(() => {
    const filtered = projects.filter((p) => p.properties.slug === slug);
    if (filtered.length) setProject(filtered[0]);
  }, [slug]);

  return <div>{project && <MapWrapper project={project} />}</div>;
};

// project={project}
// dlGeojsonStatus={dlGeojsonStatus}
// dispatchDSetDLGeojsonStatus={dispatchDSetDLGeojsonStatus}
// dlInJOSM={dlInJOSM}
// dispatchDLInJOSM={dispatchDLInJOSM}
{
  /* {/* {project && <ClassLayers />} */
}

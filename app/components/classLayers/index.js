import React from 'react';
import styled from 'styled-components';
import { Layer } from './layer';

const LayerBar = styled.section`
  position: absolute;
  z-index: 999;
  display: flex;
  flex-flow: column nowrap;
  width: auto;
  height: auto;
  overflow: hidden;
`;

export function ClassLayers({ project }) {
  const classLayers = Object.entries(project.properties.classes).map((e) => ({
    name: e[0],
    color: e[1]
  }));

  return (
    <LayerBar>
      {classLayers.map((classLayer, index) => {
        return (
          <Layer key={index} name={classLayer.name} color={classLayer.color} />
        );
      })}
    </LayerBar>
  );
}

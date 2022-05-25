import React from 'react';
import styled from 'styled-components';
import { themeVal } from '@devseed-ui/theme-provider';
import { Accordion } from '@devseed-ui/accordion';

import { Layer } from './layer';

const LayerBar = styled.section`
  position: absolute;
  z-index: 999;
  display: flex;
  flex-flow: column nowrap;
  width: auto;
  height: auto;
  overflow: hidden;
  top: 90px;
`;

const sampleLayers = [
  {
    name: 'Layer 1',
    info: 'insert interesting facts about layer 1',
    settings: <span>some layer 1 settings</span>
  },
  {
    name: 'Layer 2',
    info: 'insert interesting facts about layer 2',
    settings: <span>some layer 2 settings</span>
  }
];

export function ClassLayers({ project }) {
  const classLayers = Object.entries(project.properties.classes).map((e) => ({
    name: e[0],
    color: e[1]
  }));

  return (
    <LayerBar>
      <ul>
        {classLayers.map((classLayer, index) => {
          return (
            <li key={index}>
              <Layer name={classLayer.name} color={classLayer.color} />
            </li>
          );
        })}
      </ul>
    </LayerBar>
  );
}

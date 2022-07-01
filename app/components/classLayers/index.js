import T from 'prop-types';
import styled from 'styled-components';
import { Layer } from './layer';
import { Heading } from '@devseed-ui/typography';

const LayerBar = styled.section`
  position: absolute;
  z-index: 999;
  display: flex;
  flex-flow: column nowrap;
  width: auto;
  height: auto;
  overflow: hidden;
  background: #fff;
  bottom: 5px;
  left: 5px;
  padding: 5px;
  text-align: center;
  background: ${({ color }) => color};
`;

const Title = styled(Heading)`
  font-size: 16px;
`;

export function ClassLayers({ project }) {
  const classLayers = Object.entries(project.properties.classes).map((e) => ({
    name: e[0],
    color: e[1]
  }));

  return (
    <LayerBar>
      <Title>Classes</Title>
      {classLayers.map((classLayer) => {
        return (
          <Layer
            key={classLayer.name}
            name={classLayer.name}
            color={classLayer.color}
          />
        );
      })}
    </LayerBar>
  );
}

ClassLayers.propTypes = {
  project: T.object
};

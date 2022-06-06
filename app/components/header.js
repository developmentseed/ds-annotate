import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {
  Toolbar,
  ToolbarGroup,
  ToolbarLabel,
  ToolbarButton,
  ToolbarIconButton
} from '@devseed-ui/toolbar';
import {
  CollecticonBrandDevelopmentSeed,
  CollecticonDownload,
  CollecticonArea
} from '@devseed-ui/collecticons';
import { Dropdown, DropMenu, DropMenuItem } from '@devseed-ui/dropdown';

import projects from '../../static/projects.json';

const Container = styled.div`
  height: 60px;
  padding: 10px;
`;

export const Header = ({ dispatchDSetDLGeojsonStatus, dispatchDLInJOSM }) => {
  const setDownloadGeojson = (status) => {
    dispatchDSetDLGeojsonStatus({
      type: 'DOWNLOAD_GEOJSON',
      payload: { status }
    });
  };

  const setDownloadInJOSM = (status) => {
    dispatchDLInJOSM({
      type: 'DOWNLOAD_IN_JOSM',
      payload: { status }
    });
  };

  return (
    <Container>
      <Toolbar style={{ display: 'inline-block' }}>
        <ToolbarGroup>
          <CollecticonBrandDevelopmentSeed
            size='large'
            color='#D04200'
            title='ds-annotate'
            style={{ verticalAlign: 'middle' }}
          />
        </ToolbarGroup>
        <ToolbarGroup>
          <Dropdown
            alignment='left'
            triggerElement={(props) => (
              <ToolbarButton {...props}>Projects</ToolbarButton>
            )}
          >
            <DropMenu>
              {projects.features.map((p) => (
                <DropMenuItem key={p.properties.slug}>
                  <Link to={`/project/${p.properties.slug}`}>
                    {p.properties.name}
                  </Link>
                </DropMenuItem>
              ))}
            </DropMenu>
          </Dropdown>
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarLabel>Classes</ToolbarLabel>
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarIconButton
            onClick={() => {
              setDownloadGeojson(true);
            }}
          >
            <CollecticonDownload meaningful title='Download data' />
          </ToolbarIconButton>
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarIconButton
            onClick={() => {
              setDownloadInJOSM(true);
            }}
          >
            <CollecticonArea meaningful title='Download in JOSM' />
          </ToolbarIconButton>
        </ToolbarGroup>
      </Toolbar>
    </Container>
  );
};

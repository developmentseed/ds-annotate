import { useContext } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {
  Toolbar,
  ToolbarGroup,
  ToolbarButton,
  ToolbarIconButton
} from '@devseed-ui/toolbar';
import {
  CollecticonBrandDevelopmentSeed,
  CollecticonDownload,
  CollecticonGlobe
} from '@devseed-ui/collecticons';
import { Dropdown, DropMenu, DropMenuItem } from '@devseed-ui/dropdown';
import { MainContext } from './../contexts/Maincontext';

const Container = styled.div`
  height: 60px;
  padding: 10px;
`;

export const Header = () => {
  const { projects, dispatchDLGeojson, dispatchDLInJOSM } =
    useContext(MainContext);

  const setDownloadGeojson = (e) => {
    e.preventDefault();

    dispatchDLGeojson({
      type: 'DOWNLOAD_GEOJSON',
      payload: { status: true }
    });
  };

  const setDownloadInJOSM = (e) => {
    e.preventDefault();
    dispatchDLInJOSM({
      type: 'DOWNLOAD_IN_JOSM',
      payload: { status: true }
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
          <ToolbarIconButton onClick={setDownloadGeojson}>
            <CollecticonDownload meaningful title='Download data' />
          </ToolbarIconButton>
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarIconButton onClick={setDownloadInJOSM}>
            <CollecticonGlobe meaningful title='Download in JOSM' />
          </ToolbarIconButton>
        </ToolbarGroup>
      </Toolbar>
    </Container>
  );
};

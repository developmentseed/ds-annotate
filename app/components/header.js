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
  CollecticonDownload
} from '@devseed-ui/collecticons';
import { Dropdown, DropMenu, DropMenuItem } from '@devseed-ui/dropdown';

import projects from '../../static/projects.json';

const Container = styled.div`
  height: 60px;
  padding: 10px;
`;

export const Header = () => {
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
          <ToolbarIconButton>
            <CollecticonDownload meaningful title='Download data' />
          </ToolbarIconButton>
        </ToolbarGroup>
      </Toolbar>
    </Container>
  );
};

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Toolbar, ToolbarIconButton } from '@devseed-ui/toolbar';
import { glsp, truncated, themeVal } from '@devseed-ui/theme-provider';
import { AccordionFold } from '@devseed-ui/accordion';

import { Heading } from '@devseed-ui/typography';

const LayerHeader = styled.header`
  position: relative;
  z-index: 2;
  display: grid;
  grid-auto-columns: 1fr min-content;
  padding: ${glsp(0.25, 0.5)};
  grid-gap: ${glsp(0.5)};
  background-color: ${themeVal('color.surface')};
  box-shadow: inset 0 -${themeVal('layout.border')} 0 0 ${themeVal('color.shadow')};
`;

const LayerHeadline = styled.div`
  grid-row: 1;
  min-width: 0px;
`;

const LayerTitle = styled(Heading).attrs({ size: 'small' })`
  ${truncated()};
`;

const LayerHeadToolbar = styled(Toolbar)`
  grid-row: 1;
  align-items: center;
`;

export function Layer({ name, color }) {
  return (
    <LayerHeader>
      <LayerHeadline>
        <LayerTitle style={{ color: color }}>{name}</LayerTitle>
      </LayerHeadline>
      {/* <LayerHeadToolbar size='small'>
        <ToolbarIconButton title='Toggle layer on/off' useIcon={'eye'}>
          visible
        </ToolbarIconButton>
      </LayerHeadToolbar> */}
    </LayerHeader>
  );
}

Layer.propTypes = {
  name: PropTypes.string,
  color: PropTypes.string
};

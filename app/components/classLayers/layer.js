import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Toolbar, ToolbarIconButton } from '@devseed-ui/toolbar';
import { glsp, truncated, themeVal } from '@devseed-ui/theme-provider';
import { CollecticonPencil } from '@devseed-ui/collecticons';

import { Heading } from '@devseed-ui/typography';

import { MainContext } from './../../contexts/MainContext';

const LayerHeader = styled.header`
  position: relative;
  z-index: 2;
  display: grid;
  grid-auto-columns: 1fr min-content;
  padding: ${glsp(0.25, 0.5)};
  grid-gap: ${glsp(0.5)};
  background-color: ${themeVal('color.surface')};
  box-shadow: inset 0 -${themeVal('layout.border')} 0 0 ${themeVal('color.shadow')};
  background: ${({ color }) => color};
  cursor: pointer;
`;

const LayerHeadline = styled.div`
  grid-row: 1;
  min-width: 0px;
`;

const LayerTitle = styled(Heading).attrs({ size: 'small' })`
  // ${truncated()};
  font-size: 14px;
`;

const LayerHeadToolbar = styled(Toolbar)`
  grid-row: 1;
  align-items: center;
`;

export function Layer({ name, color }) {

  const { activeClass, dispatchSetActiveClass } = useContext(MainContext);
  const SetActiveClass = (activeClassName) => {
    dispatchSetActiveClass({
      type: 'SET_ACTIVE_CLASS',
      payload: { activeClassName }
    });
  };

  return (
    <LayerHeader
      onClick={() => { 
        SetActiveClass(name);
      }}
      color={activeClass == name ? color : '#fff'}
    >
      <LayerHeadline>
        <LayerTitle>{name}</LayerTitle>
      </LayerHeadline>
      {activeClass == name ? (
        <LayerHeadToolbar size='small'>
          <ToolbarIconButton>
            <CollecticonPencil meaningful title='Editing...' />
          </ToolbarIconButton>
        </LayerHeadToolbar>
      ) : (
        <LayerHeadToolbar size='small'>
          <ToolbarIconButton>
            <div>{null}</div>
          </ToolbarIconButton>
        </LayerHeadToolbar>
      )}
    </LayerHeader>
  );
}

Layer.propTypes = {
  name: PropTypes.string,
  color: PropTypes.string
};

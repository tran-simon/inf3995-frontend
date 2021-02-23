import React, { useContext } from 'react';
import {
  Box,
  Drawer,
  DrawerProps,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import { Controls } from './Controls';
import CFContext from '../../context/CFContext';

export const CFDrawer = ({ children, ...props }: DrawerProps & {}) => {
  const { cfList } = useContext(CFContext);
  return (
    <Drawer variant="permanent" anchor="left" {...props}>
      {children}
      <Box flexGrow={1}>
        <List>
          {cfList.map((crazyflie, i) => (
            <ListItem button key={i}>
              <ListItemText>{crazyflie}</ListItemText>
            </ListItem>
          ))}
        </List>
      </Box>
      <Controls />
    </Drawer>
  );
};

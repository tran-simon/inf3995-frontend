import React, { useContext } from 'react';
import {
  Box,
  Drawer,
  DrawerProps,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import { Controls } from './Controls';
import CFContext from '../../context/CFContext';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export const CFDrawer = ({ children, ...props }: DrawerProps) => {
  const { cfList } = useContext(CFContext);

  return (
    <Drawer variant="permanent" anchor="left" {...props}>
      {children}
      <Box flexGrow={1}>
        <List>
          {cfList.map((crazyflie, i) => {
            const batteryPer = crazyflie.battery ?? 0;
            return (
              <ListItem button key={i}>
                <ListItemIcon style={{ width: '1rem', marginRight: '1rem' }}>
                  <CircularProgressbar
                    value={batteryPer}
                    text={`${batteryPer.toFixed(2)} %`}
                  />
                </ListItemIcon>
                <ListItemText>{crazyflie.droneId}</ListItemText>
              </ListItem>
            );
          })}
        </List>
      </Box>
      <Controls />
    </Drawer>
  );
};

import React, { ReactElement, useContext } from 'react';
import {
  Box,
  Drawer,
  DrawerProps,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Tooltip,
} from '@material-ui/core';
import { Controls } from './Controls';
import CFContext from '../../context/CFContext';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import StandbyIcon from '@material-ui/icons/HourglassEmpty';
import InMissionIcon from '@material-ui/icons/AirplanemodeActive';
import CrashedIcon from '@material-ui/icons/AirplanemodeInactive';
import { State } from '../../model/Crazyflie';

export const CFDrawer = ({ children, ...props }: DrawerProps) => {
  const { cfList } = useContext(CFContext);

  return (
    <Drawer variant="permanent" anchor="left" {...props}>
      {children}
      <Box flexGrow={1}>
        <List>
          {cfList.map((crazyflie, i) => {
            const batteryPer = crazyflie.battery ?? 0;
            let stateIcon: ReactElement | null = null;
            switch (crazyflie.state) {
              case State.standby:
                stateIcon = <StandbyIcon />;
                break;
              case State.inMission:
                stateIcon = <InMissionIcon />;
                break;
              case State.crashed:
                stateIcon = <CrashedIcon />;
                break;
            }
            return (
              <ListItem button key={i}>
                <ListItemIcon style={{ width: '1rem', marginRight: '1rem' }}>
                  <CircularProgressbar
                    circleRatio={15}
                    value={batteryPer}
                    text={`${batteryPer.toFixed(2)} %`}
                  />
                </ListItemIcon>
                <ListItemText
                  secondary={`Vitesse: ${crazyflie.speed?.toFixed(2) || ''}`}
                >
                  {crazyflie.droneId}
                </ListItemText>
                {stateIcon && (
                  <ListItemSecondaryAction>
                    <Tooltip title={crazyflie.state ?? ''}>{stateIcon}</Tooltip>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            );
          })}
        </List>
      </Box>
      <Controls />
    </Drawer>
  );
};

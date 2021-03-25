import React, { ReactElement, useContext, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Drawer,
  DrawerProps,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@material-ui/core';
import CFContext from '../../context/CFContext';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import StandbyIcon from '@material-ui/icons/HourglassEmpty';
import InMissionIcon from '@material-ui/icons/AirplanemodeActive';
import CrashedIcon from '@material-ui/icons/AirplanemodeInactive';
import Crazyflie, { State } from '../../model/Crazyflie';
import { Controls } from './Controls';

const StateIcon = ({ crazyflie }: { crazyflie: Crazyflie }) => {
  let stateIcon: ReactElement | null;
  let stateText = '';
  switch (crazyflie.state) {
    case State.inMission:
      stateText = 'En Mission';
      stateIcon = <InMissionIcon />;
      break;
    case State.crashed:
      stateText = 'Écrasé';
      stateIcon = <CrashedIcon />;
      break;
    default:
      stateText = 'En Attente';
      stateIcon = <StandbyIcon />;
      break;
  }

  return stateIcon && <Tooltip title={stateText}>{stateIcon}</Tooltip>;
};

export const CFDrawer = ({ children, ...props }: DrawerProps) => {
  const { cfList } = useContext(CFContext);
  const [openCfId, setOpenCfId] = useState<string | null>(null);
  const { palette } = useTheme();

  return (
    <Drawer variant="permanent" anchor="left" {...props}>
      {children}
      <Box flexGrow={1}>
        <List>
          {Object.keys(cfList).map((droneId, i) => {
            const crazyflie = cfList[droneId];
            if (!crazyflie) {
              return null;
            }
            const batteryPer = crazyflie.battery ?? 0;

            return (
              <Tooltip
                key={i}
                title={
                  !crazyflie.initialPosition
                    ? `Erreur: La position initiale n\'a pas été spécifiée pour ${droneId}`
                    : droneId
                }
              >
                <ListItem button onClick={() => setOpenCfId(droneId)}>
                  <ListItemIcon
                    style={{
                      width: '40px',
                      minWidth: 'unset',
                      marginRight: '1rem',
                    }}
                  >
                    <CircularProgressbar
                      value={batteryPer}
                      text={`${batteryPer.toFixed(2)} %`}
                      background
                      styles={
                        !crazyflie.initialPosition
                          ? buildStyles({
                              backgroundColor: palette.error.main,
                              textColor: palette.error.contrastText,
                              trailColor: palette.error.light,
                              pathColor: palette.error.dark,
                            })
                          : undefined
                      }
                    />
                  </ListItemIcon>
                  <ListItemText
                    secondary={`Vitesse: ${crazyflie.speed?.toFixed(2) || ''}`}
                    color={
                      !crazyflie.initialPosition
                        ? palette.error.main
                        : undefined
                    }
                  >
                    <Typography
                      color={!crazyflie.initialPosition ? 'error' : undefined}
                    >
                      {droneId}
                    </Typography>
                  </ListItemText>
                  <ListItemIcon style={{ justifyContent: 'flex-end' }}>
                    <StateIcon crazyflie={crazyflie} />
                  </ListItemIcon>
                </ListItem>
              </Tooltip>
            );
          })}
        </List>
      </Box>
      {openCfId && (
        <CFDialog
          droneId={openCfId}
          close={() => setOpenCfId(null)}
          save={(cf) => {}}
        />
      )}
      <Controls />
    </Drawer>
  );
};

const CFDialog = ({
  droneId,
  close,
}: {
  droneId: string;
  close: () => void;
  save: (crazyflie: Crazyflie) => void;
}) => {
  const { cfList, setCfList } = useContext(CFContext);
  const crazyflie = cfList[droneId];
  const [x, setX] = useState<string>(
    String(crazyflie?.initialPosition?.x ?? ''),
  );
  const [y, setY] = useState<string>(
    String(crazyflie?.initialPosition?.y ?? ''),
  );
  if (!crazyflie) {
    return null;
  }
  return (
    <Dialog open={!!crazyflie} onClose={() => close()}>
      <DialogTitle>Crazyflie: {droneId}</DialogTitle>
      <DialogContent>
        <List>
          <ListItem>
            <DialogContentText>
              Batterie: {crazyflie.battery?.toFixed(2)} %
            </DialogContentText>
          </ListItem>
          <ListItem>
            <DialogContentText>Vitesse: {crazyflie.speed}</DialogContentText>
          </ListItem>
          <ListItem>
            <DialogContentText style={{}}>
              État: <StateIcon crazyflie={crazyflie} />
            </DialogContentText>
          </ListItem>
          <Divider />
          <ListItem>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6">Position Initiale</Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="X"
                  value={x}
                  onChange={(e) => {
                    setX(e.target.value.replace(/[^0-9.,-]/, ''));
                  }}
                  onBlur={(e) => {
                    setX(String(+e.target.value));
                  }}
                  type="number"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Y"
                  value={y}
                  onChange={(e) => {
                    setY(e.target.value.replace(/[^0-9.,-]/, ''));
                  }}
                  onBlur={(e) => {
                    setY(String(+e.target.value));
                  }}
                  type="number"
                />
              </Grid>
            </Grid>
          </ListItem>
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => close()}>Annuler</Button>
        <Button
          disabled={x === '' || y === ''}
          onClick={() => {
            const xNum = +x,
              yNum = +y;
            crazyflie.initialPosition = {
              x: xNum,
              y: yNum,
            };
            setCfList({ ...cfList });
            close();
          }}
        >
          Confirmer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

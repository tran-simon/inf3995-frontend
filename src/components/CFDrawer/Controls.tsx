import React, { ReactNode, useContext, useState } from 'react';
import {
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
} from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import CFContext from '../../context/CFContext';
import ConnectedIcon from '@material-ui/icons/WifiTethering';
import DiconnectedIcon from '@material-ui/icons/PortableWifiOff';
import ToggleOffOutlinedIcon from '@material-ui/icons/ToggleOffOutlined';
import ToggleOnOutlinedIcon from '@material-ui/icons/ToggleOnOutlined';

type ControlSectionProps = {
  icon?: ReactNode;
  onClick?: () => Promise<any>;
  children?: ReactNode;
};
const ControlSection = ({
  icon,
  onClick = async () => {},
  children,
}: ControlSectionProps) => {
  const [loading, setLoading] = useState(false);

  return (
    <ListItem
      button
      onClick={() => {
        setLoading(true);
        onClick().finally(() => setLoading(false));
      }}
    >
      <ListItemIcon>
        {!loading ? icon : <CircularProgress size="1rem" />}
      </ListItemIcon>
      <ListItemText>{children}</ListItemText>
    </ListItem>
  );
};

export const Controls = () => {
  const {
    scan,
    backendDisconnected,
    backendUrl,
    setBackendUrl,
    setRefreshRate,
    refreshRate,
    simulation,
    reset,
  } = useContext(CFContext);

  return (
    <List>
      <ControlSection icon={<RefreshIcon />} onClick={scan}>
        Balayer
      </ControlSection>

      <ControlSection
        onClick={async () => {
          setRefreshRate(refreshRate ? 0 : 1000);
        }}
        icon={
          refreshRate ? <ToggleOnOutlinedIcon /> : <ToggleOffOutlinedIcon />
        }
      >
        Rafraîchissement Automatique
      </ControlSection>

      <ControlSection
        icon={simulation ? <ToggleOnOutlinedIcon /> : <ToggleOffOutlinedIcon />}
        onClick={() => reset(!simulation)}
      >
        Mode Simulation
      </ControlSection>

      <Divider />

      <ListItem>
        <ListItemIcon>
          {backendDisconnected ? <DiconnectedIcon /> : <ConnectedIcon />}
        </ListItemIcon>

        <TextField
          label={'URL du serveur'}
          value={backendUrl}
          onChange={(event) => {
            setBackendUrl(event.target.value);
          }}
          error={backendDisconnected}
        />
      </ListItem>
    </List>
  );
};

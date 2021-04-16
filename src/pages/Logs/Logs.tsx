import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  Typography,
} from '@material-ui/core';
import CFContext from '../../context/CFContext';
import RefreshIcon from '@material-ui/icons/Refresh';

const Logs = (props: DialogProps) => {
  const { setShowLogs, refreshLogs } = useContext(CFContext);
  const [logs, setLogs] = useState('');
  const endMessageRef = useRef<any>(null);

  const refresh = useCallback(() => {
    refreshLogs().then((res) => {
      if (typeof res === 'string') {
        setLogs(res);
      }
    });
  }, [refreshLogs, setLogs]);

  useEffect(() => {
    if (props.open) {
      refresh();
    }
  }, [refresh, props.open]);

  useEffect(() => {
    if (endMessageRef.current != null) {
      endMessageRef.current.scrollIntoView({});
    }
  }, []);

  return (
    <Dialog
      onClose={() => setShowLogs(false)}
      fullWidth
      maxWidth="md"
      scroll={'paper'}
      {...props}
    >
      <DialogTitle>Journal des messages</DialogTitle>
      <DialogContent dividers>
        <DialogContentText style={{ whiteSpace: 'pre-line' }}>
          {logs}
          <Typography
            component="span"
            ref={endMessageRef}
            color="textPrimary"
            style={{ textAlign: 'center', margin: '1rem' }}
          >
            -- Fin des messages --
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            refresh();
          }}
        >
          <RefreshIcon />
          Rafraîchir
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default Logs;

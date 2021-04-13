import MapData from '../../model/MapData';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableProps,
  TableRow,
  Tooltip,
} from '@material-ui/core';
import { format, isValid } from 'date-fns';
import { frCA } from 'date-fns/locale';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import {
  FirebaseDatabaseMutation,
  FirebaseDatabaseNode,
} from '@react-firebase/database';
import React, { useEffect, useState } from 'react';
import { ObjectWithKey } from '../../model';
import { useHistory } from 'react-router-dom';
import FlightIcon from '@material-ui/icons/Flight';
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows';

interface MapsTableProps extends TableProps {
  mapsData?: ObjectWithKey<MapData>[];
}

const TypeIcon = ({ simulation }: { simulation?: boolean }) => {
  if (simulation) {
    return (
      <Tooltip title="Simulation">
        <DesktopWindowsIcon />
      </Tooltip>
    );
  }
  return (
    <Tooltip title="Crazyflies">
      <FlightIcon />
    </Tooltip>
  );
};

const MapsTable = ({ mapsData: _mapsData, ...props }: MapsTableProps) => {
  const [deleteMapKey, setDeleteMapKey] = useState<string | null>(null);
  const [mapsData, setMapsData] = useState(_mapsData);
  const history = useHistory();

  useEffect(() => {
    setMapsData(_mapsData);
  }, [setMapsData, _mapsData]);

  return (
    <>
      <Table {...props}>
        <TableHead>
          <TableRow>
            <TableCell>Type</TableCell>
            <TableCell>Nom</TableCell>
            <TableCell>Date de dernière modification</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mapsData &&
            mapsData
              .sort((data1, data2) => data2.date - data1.date)
              .map((map, i) => (
                <TableRow
                  key={i}
                  hover
                  onClick={() => {
                    history.push(`/explore/${map._key}`);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <TableCell>
                    <TypeIcon simulation={map.simulation} />
                  </TableCell>
                  <TableCell>{map.name}</TableCell>
                  <TableCell>
                    {isValid(map.date) &&
                      format(map.date, 'PPPPpp', { locale: frCA })}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={(e) => {
                        setDeleteMapKey(map._key);
                        e.stopPropagation();
                      }}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
      <Dialog open={!!deleteMapKey} onClose={() => setDeleteMapKey(null)}>
        {!!deleteMapKey && (
          <FirebaseDatabaseMutation path={`maps/${deleteMapKey}`} type={'set'}>
            {({ runMutation }) => (
              <>
                <DialogTitle>Êtes-vous certain?</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Cette action est irréversible
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setDeleteMapKey(null)}>Annuler</Button>
                  <Button
                    onClick={() => {
                      runMutation(null).then(() => {
                        setMapsData(
                          (mapsData ?? []).filter(
                            (data) => data._key !== deleteMapKey,
                          ),
                        );
                        setDeleteMapKey(null);
                      });
                    }}
                  >
                    Confirmer
                  </Button>
                </DialogActions>
              </>
            )}
          </FirebaseDatabaseMutation>
        )}
      </Dialog>
    </>
  );
};

const resValueToMapsData = (resValue: any): ObjectWithKey<MapData>[] => {
  return Object.keys(resValue).map((key) => ({
    _key: key,
    ...resValue[key],
  }));
};

export default () => {
  return (
    <FirebaseDatabaseNode path={'/maps'} orderByChild="date">
      {(res) => {
        const mapsData: ObjectWithKey<MapData>[] | undefined =
          (res.isLoading != null &&
            !res.isLoading &&
            res.value &&
            resValueToMapsData(res.value)) ||
          undefined;

        return <MapsTable mapsData={mapsData} />;
      }}
    </FirebaseDatabaseNode>
  );
};

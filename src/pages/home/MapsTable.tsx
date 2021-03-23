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
} from '@material-ui/core';
import { format, isValid } from 'date-fns';
import { frCA } from 'date-fns/locale';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import {
  FirebaseDatabaseMutation,
  FirebaseDatabaseNode,
} from '@react-firebase/database';
import React, { useState } from 'react';
import { ObjectWithKey } from '../../model';
import { useHistory } from 'react-router-dom';

interface MapsTableProps extends TableProps {
  mapsData: ObjectWithKey<MapData>[];
}

const MapsTable = ({ mapsData, ...props }: MapsTableProps) => {
  const [deleteMapKey, setDeleteMapKey] = useState<string | null>(null);
  const history = useHistory();

  return (
    <>
      <Table {...props}>
        <TableHead>
          <TableRow>
            <TableCell>Indice</TableCell>
            <TableCell>Date de dernière modification</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mapsData.map((map, i) => (
            <TableRow
              key={i}
              hover
              onClick={() => {
                history.push(`/explore/${map._key}`);
              }}
            >
              <TableCell>{i}</TableCell>
              <TableCell>
                {isValid(map.date) &&
                  format(map.date, 'PPPP', { locale: frCA })}
              </TableCell>
              <TableCell>
                <IconButton
                  onClick={() => {
                    setDeleteMapKey(map._key);
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
        const mapsData: ObjectWithKey<MapData>[] =
          (res.isLoading != null &&
            !res.isLoading &&
            res.value &&
            resValueToMapsData(res.value)) ||
          [];

        return <MapsTable mapsData={mapsData} />;
      }}
    </FirebaseDatabaseNode>
  );
};

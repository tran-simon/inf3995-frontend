import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import Crazyflie, { CrazyflieDTO } from '../model/Crazyflie';
import { noop } from 'lodash';
import { KeyArray, SetState } from '../utils';
import { BackendREST } from '../backendApi/BackendREST';
import useMockedCf, { MOCK_BACKEND_URL } from './useMockedCf';
import MapData from '../model/MapData';
import firebase from 'firebase/app';
import 'firebase/database';

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL ?? 'http://localhost:5000';

interface ICFContext extends MapData {
  _key: string;
  scan: () => Promise<Response | void>;
  updateStats: () => Promise<Response | void>;

  backendUrl?: string;
  setBackendUrl: SetState<string | undefined>;

  backendDisconnected?: boolean;

  refreshRate?: number;
  setRefreshRate: SetState<number>;

  land: () => Promise<Response | void>;
  takeoff: () => Promise<Response | void>;

  save: () => Promise<void>;
}

const DefaultCfContext: ICFContext = {
  _key: '',
  date: Date.now(),
  cfList: {},
  simulation: false,
  scan: async () => {},
  updateStats: async () => {},
  backendUrl: BACKEND_URL,
  setBackendUrl: noop,
  setRefreshRate: noop,

  land: async () => {},
  takeoff: async () => {},

  save: async () => {},
};

const CFContext = createContext<ICFContext>(DefaultCfContext);

const crazyflieDtoArrToCfList = (crazyflieDtoArr: CrazyflieDTO[]) => {
  const cfList: KeyArray<Crazyflie> = {};
  crazyflieDtoArr.forEach((v) => {
    const { droneId, ...cf } = v;
    if (droneId) {
      cfList[droneId] = {
        ...cf,
        data: cf.data ?? [],
      };
    }
  });

  return cfList;
};

export const CFProvider = ({
  children,
  ...props
}: Partial<ICFContext> & {
  children: ReactNode;
  _key: string;
  date: number;
}) => {
  const [refreshRate, setRefreshRate] = useState<number>(
    props.refreshRate ?? 0,
  );
  const [backendUrl, setBackendUrl] = useState<string | undefined>(
    props.backendUrl ?? BACKEND_URL,
  );
  const [backendDisconnected, setBackendDisconnected] = useState(true);
  const [cfList, setCfList] = useState<KeyArray<Crazyflie>>(props.cfList || {});

  const [simulation, setSimulation] = useState<boolean>(
    props.simulation ?? false,
  );
  const [backendSim, setBackendSim] = useState<boolean | undefined>();

  const { setMockCf } = useMockedCf(cfList);

  const scan = useCallback(async () => {
    if (!backendDisconnected) {
      return BackendREST.scan(backendUrl).then((value) => {
        if (Array.isArray(value)) {
          setCfList(crazyflieDtoArrToCfList(value));
        }
      });
    }
  }, [backendUrl, backendDisconnected, setCfList]);

  const updateStats = useCallback(async () => {
    if (!backendDisconnected) {
      return BackendREST.updateStats(backendUrl).then((val) => {
        if (Array.isArray(val)) {
          setCfList(crazyflieDtoArrToCfList(val));
        }
      });
    }
  }, [backendUrl, backendDisconnected, setCfList]);

  const reset = useCallback(
    async (simulation: boolean) => {
      if (!backendDisconnected) {
        return BackendREST.reset(backendUrl, simulation).then((res) => {
          if (res.ok) {
            setCfList({});
            res.json().then((a) => {
              setSimulation(a);
            });
          } else {
            if (simulation) {
              alert(
                "Erreur: Le backend n'a pas réussi à se connecter à la simulation",
              );
            } else {
              alert("Une erreur s'est produite");
            }
          }
        });
      }
    },
    [setCfList, setSimulation, backendDisconnected, backendUrl],
  );

  useEffect(() => {
    if (backendUrl === MOCK_BACKEND_URL) {
      setMockCf(true);
      setBackendDisconnected(false);
    } else {
      BackendREST.liveCheck(backendUrl)
        .then((response) => {
          setBackendDisconnected(!response.ok);
          response.json().then((v) => {
            if (v.simulation != null) {
              setBackendSim(v.simulation);
            }
          });
        })
        .catch(() => {
          //todo: uncomment after cdr
          // setBackendDisconnected(true);
        });
    }
  }, [backendUrl, setBackendDisconnected, setMockCf]);

  useEffect(() => {
    if (
      !backendDisconnected &&
      backendSim != null &&
      backendSim !== simulation
    ) {
      reset(simulation);
    }
  }, [backendDisconnected, backendSim, simulation, reset, backendUrl]);

  useEffect(() => {
    if (!backendDisconnected && !!refreshRate) {
      const refresh = setInterval(() => {
        updateStats();
      }, refreshRate);
      return () => clearInterval(refresh);
    }
  }, [refreshRate, backendUrl, backendDisconnected, updateStats]);

  const takeoff = async () => {
    if (!backendDisconnected) {
      return BackendREST.takeoff(backendUrl);
    }
  };
  const land = async () => {
    if (!backendDisconnected) {
      return BackendREST.land(backendUrl);
    }
  };

  const save = useCallback(async () => {
    if (props._key) {
      const { name } = props;
      const data: MapData = {
        cfList,
        name,
        date: Date.now(),
        simulation,
      };
      return firebase
        .database()
        .ref(`/maps/${props._key}`)
        .update(MapData.toDto(data));
    }
  }, [props, cfList, simulation]);

  return (
    <CFContext.Provider
      value={{
        ...props,
        backendUrl,
        setBackendUrl,
        backendDisconnected,
        scan,
        updateStats,
        refreshRate,
        setRefreshRate,
        cfList,
        takeoff,
        land,
        simulation,
        save,
      }}
    >
      {children}
    </CFContext.Provider>
  );
};

export default CFContext;

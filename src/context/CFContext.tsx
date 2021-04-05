import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import Crazyflie, { cfDataFromDTO, CrazyflieDTO } from '../model/Crazyflie';
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
  setCfList: SetState<KeyArray<Crazyflie>>;
  _key: string;
  scan: () => Promise<Response | void>;
  updateStats: () => Promise<Response | void>;

  showLogs: boolean;
  setShowLogs: SetState<boolean>;
  refreshLogs: () => Promise<string | void>;

  backendUrl?: string;
  setBackendUrl: SetState<string | undefined>;

  backendDisconnected?: boolean;

  refreshRate?: number;
  setRefreshRate: SetState<number>;

  land: () => Promise<Response | void>;
  takeoff: () => Promise<Response | void>;
  flash: () => Promise<Response | void>;

  save: () => Promise<void>;
}

const DefaultCfContext: ICFContext = {
  setCfList: noop,
  _key: '',
  date: Date.now(),
  cfList: {},
  simulation: false,
  scan: async () => {},
  updateStats: async () => {},
  backendUrl: BACKEND_URL,
  setBackendUrl: noop,
  setRefreshRate: noop,
  showLogs: false,
  setShowLogs: noop,
  refreshLogs: async () => {},

  land: async () => {},
  takeoff: async () => {},
  flash: async () => {},

  save: async () => {},
};

const CFContext = createContext<ICFContext>(DefaultCfContext);

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
  const [showLogs, setShowLogs] = useState(false);

  const { setMockCf } = useMockedCf(cfList);

  const updateCfList = useCallback(
    (val: any) => {
      if (Array.isArray(val)) {
        const newCfList = { ...cfList };
        val.forEach((v: CrazyflieDTO) => {
          const { droneId, battery, speed, state } = v;

          if (droneId) {
            const cf = cfList[droneId];
            const data = cf?.data || [];
            if (v.cfData) {
              data.push(cfDataFromDTO(v.cfData));
            }

            newCfList[droneId] = {
              ...cf,
              battery,
              speed,
              state,
              data: data,
            };
          }
        });
        setCfList(newCfList);
      }
    },
    [cfList, setCfList],
  );

  const scan = useCallback(async () => {
    if (!backendDisconnected) {
      return BackendREST.scan(backendUrl).then(updateCfList);
    }
  }, [backendUrl, backendDisconnected, updateCfList]);

  const updateStats = useCallback(async () => {
    if (!backendDisconnected) {
      return BackendREST.updateStats(backendUrl).then(updateCfList);
    }
  }, [backendUrl, backendDisconnected, updateCfList]);

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

  const flash = useCallback(async () => {
    if (!backendDisconnected) {
      return BackendREST.flash(backendUrl);
    }
  }, [backendUrl, backendDisconnected]);

  const getLogs = useCallback(async () => {
    if (!backendDisconnected) {
      return BackendREST.logs(backendUrl).then((v) => v.text());
    }
  }, [backendUrl, backendDisconnected]);

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
        setCfList,
        takeoff,
        land,
        simulation,
        save,
        flash,
        showLogs,
        setShowLogs,
        refreshLogs: getLogs,
      }}
    >
      {children}
    </CFContext.Provider>
  );
};

export default CFContext;

import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import Crazyflie from '../model/Crazyflie';
import { noop } from 'lodash';
import { SetState } from '../utils';
import { BackendREST } from '../backendApi/BackendREST';
import useMockedCf, { MOCK_BACKEND_URL } from './useMockedCf';
import Wall from '../model/Wall';
import { SENSOR_MAX_RANGE } from '../utils/constants';
import { addPoint, newPoint, scalePoint } from '../utils/Point';

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL ?? 'http://localhost:5000';

interface ICFContext {
  cfList: Crazyflie[];
  walls: Wall[];
  simulation?: boolean;

  scan: () => Promise<Response | void>;
  updateStats: () => Promise<Response | void>;

  backendUrl?: string;
  setBackendUrl: SetState<string | undefined>;

  backendDisconnected?: boolean;

  refreshRate?: number;
  setRefreshRate: SetState<number>;

  land: () => Promise<Response | void>;
  takeoff: () => Promise<Response | void>;

  reset: (simulation: boolean) => Promise<Response | void>;
}

const DefaultCfContext: ICFContext = {
  cfList: [],
  walls: [],
  simulation: false,
  scan: async () => {},
  updateStats: async () => {},
  backendUrl: BACKEND_URL,
  setBackendUrl: noop,
  setRefreshRate: noop,

  land: async () => {},
  takeoff: async () => {},
  reset: async () => {},
};

const CFContext = createContext<ICFContext>(DefaultCfContext);

export const getWalls = (crazyflie: Crazyflie): Wall[] => {
  const res: Wall[] = [];
  const sensors = crazyflie.sensors ?? {};
  const cfPos = crazyflie.position;

  for (let i = 0; i < 4; i++) {
    let v: number | undefined;

    let xScale = 1,
      yScale = 1;
    switch (i) {
      case 0:
        xScale = 0;
        v = sensors.north;
        break;
      case 1:
        yScale = -1;
        xScale = 0;
        v = sensors.south;
        break;
      case 2:
        yScale = 0;
        v = sensors.east;
        break;
      case 3:
        xScale = -1;
        yScale = 0;
        v = sensors.west;
        break;
      default:
        break;
    }

    const notDetected = v == null || v >= SENSOR_MAX_RANGE;
    if (notDetected) {
      v = SENSOR_MAX_RANGE;
    }

    if (cfPos) {
      res.push({
        crazyflie,
        position: addPoint(
          cfPos,
          scalePoint(newPoint(xScale, yScale), v ?? SENSOR_MAX_RANGE),
        ),
        outOfRange: notDetected,
      });
    }
  }

  return res;
};

export const CFProvider = ({
  children,
  ...props
}: Partial<ICFContext> & {
  children: ReactNode;
}) => {
  const [refreshRate, setRefreshRate] = useState<number>(
    props.refreshRate ?? 0,
  );
  const [backendUrl, setBackendUrl] = useState<string | undefined>(
    props.backendUrl ?? BACKEND_URL,
  );
  const [backendDisconnected, setBackendDisconnected] = useState(true);
  const [cfList, setCfList] = useState<Crazyflie[]>(props.cfList || []);

  const [walls, setWalls] = useState<Wall[]>(props.walls || []);

  const [simulation, setSimulation] = useState(false);

  const { setMockCf } = useMockedCf();

  useEffect(() => {
    if (backendUrl === MOCK_BACKEND_URL) {
      setMockCf(true);
    }
  }, [setMockCf, backendUrl]);

  const scan = useCallback(async () => {
    if (!backendDisconnected) {
      return BackendREST.scan(backendUrl).then((value) => {
        if (Array.isArray(value)) {
          setCfList(value);
        }
      });
    }
  }, [backendUrl, backendDisconnected]);

  const updateStats = useCallback(async () => {
    if (!backendDisconnected) {
      return BackendREST.updateStats(backendUrl).then((val) => {
        if (Array.isArray(val)) {
          setCfList(val);
          const newWalls = val.flatMap((cf: Crazyflie) => getWalls(cf));
          setWalls([...walls, ...newWalls]);
        }
      });
    }
  }, [backendUrl, backendDisconnected, walls, setWalls]);

  useEffect(() => {
    BackendREST.liveCheck(backendUrl)
      .then((response) => {
        setBackendDisconnected(!response.ok);
      })
      .catch(() => {
        //todo: uncomment after cdr
        // setBackendDisconnected(true);
      });
  }, [backendUrl, setBackendDisconnected]);

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

  const reset = async (simulation: boolean) => {
    if (!backendDisconnected) {
      return BackendREST.reset(backendUrl, simulation).then((res) => {
        if (res.ok) {
          setCfList([]);
          setWalls([]);
          res.json().then((a) => {
            setSimulation(a);
          });
        }
      });
    }
  };

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
        walls,
        reset,
        simulation,
      }}
    >
      {children}
    </CFContext.Provider>
  );
};

export default CFContext;

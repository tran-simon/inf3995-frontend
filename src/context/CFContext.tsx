import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import Crazyflie from '../model/Crazyflie';
import { noop } from 'lodash';
import { SetState } from '../utils/utils';
import { BackendREST } from '../backendApi/BackendREST';
import useMockedCf, { MOCK_BACKEND_URL } from './useMockedCf';
import Wall from '../model/Wall';

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL ?? 'http://localhost:5000';

interface ICFContext {
  cfList: Crazyflie[];
  walls: Wall[];

  scan: () => Promise<Response | void>;
  updateStats: () => Promise<Response | void>;

  backendUrl?: string;
  setBackendUrl: SetState<string | undefined>;

  backendDisconnected?: boolean;

  refreshRate?: number;
  setRefreshRate: SetState<number>;

  land: () => Promise<Response | void>;
  takeoff: () => Promise<Response | void>;
}

const DefaultCfContext: ICFContext = {
  cfList: [],
  walls: [],
  scan: async () => {},
  updateStats: async () => {},
  backendUrl: BACKEND_URL,
  setBackendUrl: noop,
  setRefreshRate: noop,

  land: async () => {},
  takeoff: async () => {},
};

const CFContext = createContext<ICFContext>(DefaultCfContext);

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

  const { setMockCf } = useMockedCf();

  useEffect(() => {
    if (backendUrl === MOCK_BACKEND_URL) {
      setMockCf(true);
    }
  }, [setMockCf, backendUrl]);

  const getWalls = (crazyflie: Crazyflie): Wall[] => {
    const res: Wall[] = [];
    const sensors = crazyflie.sensors ?? {};
    const cfPos = crazyflie.position;

    Object.keys(sensors).forEach((key) => {
      const v = sensors[key];
      if (v && cfPos) {
        let xScale = 1,
          yScale = 1;
        switch (key) {
          case 'north':
            xScale = 0;
            break;
          case 'south':
            yScale = -1;
            xScale = 0;
            break;
          case 'east':
            yScale = 0;
            break;
          case 'west':
            xScale = -1;
            yScale = 0;
            break;
          default:
            break;
        }

        res.push({
          crazyflie,
          position: {
            x: cfPos.x + v * xScale,
            y: cfPos.y + v * yScale,
          },
        });
      }
    });

    return res;
  };

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

  return (
    <CFContext.Provider
      value={{
        ...DefaultCfContext,
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
      }}
    >
      {children}
    </CFContext.Provider>
  );
};

export default CFContext;

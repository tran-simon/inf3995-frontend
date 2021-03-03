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

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL ?? 'http://localhost:5000';

interface ICFContext {
  cfList: Crazyflie[];

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
  const [backendDisconnected, setBackendDisconnected] = useState(
    props.backendDisconnected ?? !!backendUrl,
  );
  const [cfList, setCfList] = useState<Crazyflie[]>(props.cfList || []);

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
        }
      });
    }
  }, [backendUrl, backendDisconnected]);

  useEffect(() => {
    BackendREST.liveCheck(backendUrl)
      .then((response) => {
        setBackendDisconnected(!response.ok);
      })
      .then(updateStats)
      .catch(() => {
        setBackendDisconnected(true);
      });
  }, [backendUrl, updateStats, setBackendDisconnected]);

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
      }}
    >
      {children}
    </CFContext.Provider>
  );
};

export default CFContext;

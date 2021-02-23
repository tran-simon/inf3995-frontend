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

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

interface ICFContext {
  cfList: Crazyflie[];
  scan: () => Promise<Crazyflie[] | void>;
  backendUrl?: string;
  setBackendUrl: SetState<string | undefined>;

  backendDisconnected?: boolean;
}

const DefaultCfContext: ICFContext = {
  cfList: [],
  scan: async () => [],
  backendUrl: BACKEND_URL,
  setBackendUrl: noop,
};

const CFContext = createContext<ICFContext>(DefaultCfContext);

export const CFProvider = ({
  children,
  ...props
}: Partial<ICFContext> & {
  children: ReactNode;
}) => {
  const [backendUrl, setBackendUrl] = useState(props.backendUrl ?? BACKEND_URL);
  const [backendDisconnected, setBackendDisconnected] = useState(
    props.backendDisconnected ?? false,
  );
  const [cfList, setCfList] = useState<Crazyflie[]>(props.cfList || []);

  const scan = useCallback(async () => {
    if (!backendDisconnected) {
      return fetch(`${backendUrl}/scan`).then((res) => {
        if (res.ok) {
          res.json().then((value) => {
            if (Array.isArray(value)) {
              setCfList(value);
            }
          });
        }
      });
    }
  }, [backendUrl, backendDisconnected]);

  useEffect(() => {
    fetch(`${backendUrl}/liveCheck`)
      .then((response) => {
        setBackendDisconnected(!response.ok);
      })
      .then(scan)

      .catch(() => {
        setBackendDisconnected(true);
      });
  }, [backendUrl, scan]);

  return (
    <CFContext.Provider
      value={{
        ...DefaultCfContext,
        ...props,
        backendUrl,
        setBackendUrl,
        backendDisconnected,
        scan,
        cfList,
      }}
    >
      {children}
    </CFContext.Provider>
  );
};

export default CFContext;

/* eslint-disable */
import { useCallback, useEffect, useRef, useState } from 'react';
import Crazyflie, { CrazyflieDTO, Sensors, State } from '../model/Crazyflie';
import Point from '../utils/Point';
import { KeyArray } from '../utils';

export const MOCK_BACKEND_URL = 'MOCK';

//todo: Remove after CDR
const useMockedCf = (cfList: KeyArray<Crazyflie>) => {
  const [mockCf, setMockCf] = useState<boolean>(false);
  const started = useRef(false);

  const mockCfList = useRef<KeyArray<Crazyflie>>({
    MOCKED_0: { data: [] },
    MOCKED_1: { data: [] },
    MOCKED_2: { data: [] },
    ...cfList,
  });

  useEffect(() => {
    mockCfList.current = {
      MOCKED_0: { data: [] },
      MOCKED_1: { data: [] },
      MOCKED_2: { data: [] },
      ...mockCfList.current,
      ...cfList,
    };
  }, [cfList]);

  const moveCfBy = (cf: Crazyflie, delta: Point, sensors: Sensors) => {
    const { x, y } = cf.data?.length
      ? cf.data[cf.data.length - 1]
      : cf.initialPosition || {};
    if (x != null && y != null) {
      cf.data.push({
        x: x + delta.x,
        y: y + delta.y,
        ...sensors,
      });
    }
  };

  const updateCf = useCallback(
    (cf?: Crazyflie, index?: number) => {
      if (cf == null || index == null) {
        return;
      }

      cf.battery = (cf.battery || 100) - 0.001;
      if (!started.current) {
        cf.state = State.standby;
        return;
      }

      cf.state = State.inMission;

      const { x, y } = cf.data?.length
        ? cf.data[cf.data.length - 1]
        : cf.initialPosition || {};
      if (x == null || y == null) {
        return;
      }
      switch (index) {
        case 0:
          if (x < 5) {
            moveCfBy(
              cf,
              { x: 1, y: 0 },
              {
                east: 10 - x,
              },
            );
          } else {
            moveCfBy(
              cf,
              { x: 0, y: 1 },
              {
                east: 11 - x,
              },
            );
          }
          cf.speed = 1;
          break;
        case 1:
          if (y < 10) {
            moveCfBy(
              cf,
              { x: 0, y: 1 },
              {
                west: y > 6 ? 20 : undefined,
                east: y < 4 ? 10 : undefined,
              },
            );
            cf.speed = 1;
          } else {
            cf.state = State.crashed;
          }

          break;
        case 2:
          if (x > -25) {
            moveCfBy(
              cf,
              { x: -1, y: -1 },
              {
                west: 4,
              },
            );
            cf.speed = Math.sqrt(2);
          } else {
            moveCfBy(
              cf,
              { x: 0, y: -1 },
              {
                west: 30 - y,
              },
            );
            cf.speed = 1;
          }
          break;
      }
    },
    [started.current],
  );

  const mockUpdateStats = useCallback(() => {
    Object.values(mockCfList.current).forEach(updateCf);

    const cfsDto: CrazyflieDTO[] = Object.keys(mockCfList.current).map(
      (droneId) => {
        const cf = mockCfList.current[droneId] as Crazyflie;
        const data = cf.data[cf.data.length - 1];
        const point = [String(data.x), String(data.y)];
        const sensors = [
          String(data.north),
          String(data.south),
          String(data.east),
          String(data.west),
        ];
        return {
          droneId,
          state: cf.state,
          speed: cf.speed,
          battery: cf.battery,
          cfData: [point, sensors],
        };
      },
    );

    return JSON.stringify(cfsDto);
  }, [mockCfList.current, updateCf]);

  useEffect(() => {
    // based on https://stackoverflow.com/a/53448336/6592293
    if (mockCf) {
      const constantMock = window.fetch;
      window.fetch = function () {
        return new Promise((resolve, reject) => {
          constantMock
            // @ts-ignore
            .apply(this, arguments as any)
            .then(async (response) => {
              const { url = '' } = response;

              let body: string | undefined;

              if (url.endsWith('liveCheck')) {
                body = JSON.stringify({ simulation: false });
              } else if (url.endsWith('scan')) {
                body = mockUpdateStats();
              } else if (url.endsWith('updateStats')) {
                body = mockUpdateStats();
              } else if (url.endsWith('takeOff')) {
                started.current = true;
              } else if (url.endsWith('land')) {
                started.current = false;
              }

              if (body) {
                resolve(
                  new Response(body, {
                    status: response.status,
                    statusText: response.statusText,
                    headers: response.headers,
                  }),
                );
              } else {
                resolve(response);
              }
            })
            .catch((e) => {
              reject(e);
            });
        });
      };
    }
  }, [mockCf, mockUpdateStats]);

  return {
    mockCf,
    setMockCf,
  };
};
export default useMockedCf;

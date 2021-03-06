/* eslint-disable */
import { useEffect, useState } from 'react';
import Crazyflie from '../model/Crazyflie';
import Point from '../utils/Point';

export const MOCK_BACKEND_URL = 'MOCK';

const mockCfList: Crazyflie[] = [];

const initialMockCfs: Crazyflie[] = [
  {
    position: {
      x: 0,
      y: 50,
    },
  },
  {
    position: {
      x: 50,
      y: 0,
    },
  },
  {
    position: {
      x: -20,
      y: 30,
    },
  },
];

//todo: Remove after CDR
const useMockedCf = () => {
  const [mockCf, setMockCf] = useState<boolean>(false);
  const mockCfCount = 3;

  const moveCfBy = (cf: Crazyflie, delta: Point) => {
    if (cf.position) {
      cf.position.x += delta.x;
      cf.position.y += delta.y;
    }
  };

  const updateCf = (cf: Crazyflie, index: number) => {
    if (cf.position) {
      const { x, y } = cf.position;
      switch (index) {
        case 0:
          if (x < 5) {
            moveCfBy(cf, { x: 1, y: 0 });
            cf.sensors = {
              east: 10 - x,
            };
          } else {
            moveCfBy(cf, { x: 0, y: 1 });
            cf.sensors = {
              east: 11 - x,
            };
          }
          break;
        case 1:
          moveCfBy(cf, { x: 0, y: 1 });

          cf.sensors = {
            west: y > 6 ? 20 : undefined,
            east: y < 4 ? 10 : undefined,
          };
          break;
        case 2:
          if (x > -25) {
            moveCfBy(cf, { x: -1, y: -1 });
            cf.sensors = {
              west: 4,
            };
          } else {
            moveCfBy(cf, { x: 0, y: -1 });
            cf.sensors = {
              west: 30 - y,
            };
          }
          break;
      }
    }
    cf.battery = (cf.battery || 100) - 0.001;
  };

  const mockScan = () => {
    mockCfList.length = 0;
    for (let i = 0; i < mockCfCount; i++) {
      mockCfList.push({
        droneId: `MOCKED_${i}`,
        ...initialMockCfs[i],
      });
    }

    return mockUpdateStats();
  };

  const mockUpdateStats = () => {
    mockCfList.forEach(updateCf);
    return JSON.stringify(mockCfList);
  };

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
                body = 'OK';
              } else if (url.endsWith('scan')) {
                body = mockScan();
              } else if (url.endsWith('updateStats')) {
                body = mockUpdateStats();
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
  }, [mockCf]);

  return {
    mockCf,
    setMockCf,
  };
};
export default useMockedCf;

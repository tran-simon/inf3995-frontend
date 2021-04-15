import Point from '../utils/Point';

const options: RequestInit = { cache: 'no-store' };
export class BackendREST {
  static scan = async (backendUrl?: string) => {
    return fetch(`${backendUrl}/scan`, options).then((res) => {
      if (res.ok) {
        return res.json();
      }
    });
  };

  static updateStats = async (backendUrl?: string) => {
    return fetch(`${backendUrl}/updateStats`, options).then((res) => {
      if (res.ok) {
        return res.json();
      }
    });
  };

  static land = async (backendUrl?: string, returnToBase?: boolean) => {
    return fetch(`${backendUrl}/land?return=${returnToBase}`, options);
  };

  static takeoff = async (
    backendUrl = '',
    droneInitialPositions: Point[] = [],
  ) => {
    return fetch(`${backendUrl}/takeOff`, {
      ...options,
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(droneInitialPositions.map((pos) => [pos.x, pos.y])),
    });
  };

  static liveCheck = async (backendUrl?: string) => {
    return fetch(`${backendUrl}/liveCheck`, options);
  };

  static reset = async (backendUrl?: string, simulation?: boolean) => {
    return fetch(`${backendUrl}/reset?simulation=${!!simulation}`, options);
  };

  static flash = async (backendUrl?: string) => {
    return fetch(`${backendUrl}/flash`, options);
  };

  static logs = async (backendUrl?: string) => {
    return fetch(`${backendUrl}/logs`, options);
  };
}

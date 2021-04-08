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

  static land = async (backendUrl?: string) => {
    return fetch(`${backendUrl}/land`, options);
  };

  static takeoff = async (backendUrl?: string) => {
    return fetch(`${backendUrl}/takeOff`, options);
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

export class BackendREST {
  static scan = async (backendUrl?: string) => {
    return fetch(`${backendUrl}/scan`).then((res) => {
      if (res.ok) {
        return res.json();
      }
    });
  };

  static updateStats = async (backendUrl?: string) => {
    return fetch(`${backendUrl}/updateStats`).then((res) => {
      if (res.ok) {
        return res.json();
      }
    });
  };

  static land = async (backendUrl?: string) => {
    return fetch(`${backendUrl}/land`);
  };

  static takeoff = async (backendUrl?: string) => {
    return fetch(`${backendUrl}/takeOff`);
  };

  static liveCheck = async (backendUrl?: string) => {
    return fetch(`${backendUrl}/liveCheck`);
  };

  static connect = async (backendUrl?: string) => {
    return fetch(`${backendUrl}/connect`);
  };
}
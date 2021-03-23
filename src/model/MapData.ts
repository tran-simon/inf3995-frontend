export default class MapData {
  date: number;

  constructor(date?: number) {
    this.date = date ?? Date.now();
  }
}

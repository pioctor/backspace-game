export class CharacterView {
  name: string;
  data: string;
  scale: number = 1;
  constructor(name: string, data: string) {
    this.name = name;
    this.data = data;
  }
  getView(x: number, y: number) {
    return `<path class="${this.name}" transform="translate(${x},${y})scale(0.006,0.006)" d="${this.data}"></path>`;
  }
}

export const space = new CharacterView(" ", "");

export const characters: { [index: string]: CharacterView } = {
  B: new CharacterView(
    "B",
    "M 2 ,8  c 36 ,0  29 ,108  18 ,219 M 20 ,24  c 26 ,-23  75 ,-32  85 ,-4  7 ,21  5 ,45  -57 ,72  86 ,-25  98 ,36  76 ,81  -16 ,32  -52 ,51  -88 ,47"
  ),
  A: new CharacterView("A", "M 1 ,212  86 ,12  156 ,223 M 38 ,121  h 85"),
  C: new CharacterView(
    "C",
    "M 146 ,71  C 147 ,18  18 ,-23  5 ,111  -6 ,237  135 ,220  144 ,171 "
  ),
  K: new CharacterView("K", "M 3 ,0  9 ,230 M 123 ,12  10 ,112  133 ,219")
};

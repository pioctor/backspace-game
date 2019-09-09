import Menu from "./Menu";

new Menu();

export const volume = { volume: 0.1 };

let onVolumeChanged = (event: Event) => {
  let target = event.currentTarget;
  if (target instanceof HTMLInputElement) {
    if (Number(target.value) < -99) {
      volume.volume = 0;
    }
    volume.volume = 0.1 * Math.pow(1.03, Number(target.value));
  }
};
document.getElementById("volume")!.addEventListener("input", onVolumeChanged);

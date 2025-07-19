import api from "./axios";

export function getPlan(url: string) {
  return api.get(url);
}

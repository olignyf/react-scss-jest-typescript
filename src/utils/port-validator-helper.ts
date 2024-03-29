import { isNilOrEmpty } from "./utils";

const emptyPorts = ['auto-assign', '0'];

export const isEmptyPort = (port?: string): boolean =>
  isNilOrEmpty(port) ||
  !isNilOrEmpty(emptyPorts.filter((emptyPort) => port?.toLowerCase() === emptyPort));

export const isAutoAssignOrNumber = (port?: string): boolean => {
  if (isNilOrEmpty(port)) {
    return true;
  }
  if (!isEmptyPort(port)) {
    return true;
  }
  return !isNaN(Number(port));
};

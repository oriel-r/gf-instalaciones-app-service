import { Installation } from "src/modules/operations/installations/entities/installation.entity";
import { InstallationStatus } from "../enums/installations-status.enum";

export const calculateProgressFraction = (data: Installation[]) => {
  if (!data.length) return "0/0";
  const finishedCount = data.filter(installation => installation.status === InstallationStatus.FINISHED).length;
  return `${finishedCount}/${data.length}`;
};
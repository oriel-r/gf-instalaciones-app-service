import { Installation } from "src/modules/operations/installations/entities/installation.entity";
import { InstallationStatus } from "../enums/installations-status.enum";

export const calculateProgress = (data: Installation[]) => {
  if (data.length === 0) return 0

  const finishedCount = data.filter(inst => inst.status === InstallationStatus.FINISHED).length;

  const percentage = (finishedCount / data.length) * 100;

  return parseFloat(percentage.toFixed(2));
}

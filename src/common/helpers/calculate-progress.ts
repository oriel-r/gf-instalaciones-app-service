import { Instalation } from "src/modules/operations/instalations/entities/instalation.entity";
import { InstalationStatus } from "../enums/instalations-status.enum";

export const calculateProgress = (data: Instalation[]) => {
  if (data.length === 0) return 0

  const finishedCount = data.filter(inst => inst.status === InstalationStatus.FINISHED).length;

  const percentage = (finishedCount / data.length) * 100;

  return parseFloat(percentage.toFixed(2));
}

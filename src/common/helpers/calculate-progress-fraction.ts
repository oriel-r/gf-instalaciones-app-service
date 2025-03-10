import { Instalation } from "src/modules/operations/instalations/entities/instalation.entity";
import { InstalationStatus } from "../enums/instalations-status.enum";

export const calculateProgressFraction = (data: Instalation[]) => {
  if (!data.length) return "0/0";
  const finishedCount = data.filter(instalation => instalation.status === InstalationStatus.FINISHED).length;
  return `${finishedCount}/${data.length}`;
};
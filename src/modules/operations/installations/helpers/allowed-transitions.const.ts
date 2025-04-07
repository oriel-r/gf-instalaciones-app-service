import { InstallationStatus } from "src/common/enums/installations-status.enum";

export const allowedTransitions = {
    [InstallationStatus.PENDING]: [InstallationStatus.IN_PROCESS, InstallationStatus.CANCEL],
    [InstallationStatus.IN_PROCESS]: [InstallationStatus.POSTPONED, InstallationStatus.CANCEL],
    [InstallationStatus.POSTPONED]: [InstallationStatus.PENDING, InstallationStatus.CANCEL],
    [InstallationStatus.TO_REVIEW]: [InstallationStatus.FINISHED, InstallationStatus.CANCEL],

  }
  
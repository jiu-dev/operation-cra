export type ActivityImputation = {
  activityKey: string;
  imputationArray: number[];
};

export class CraUtil {
  static createImputationArray(
    data: { dayKey: string; imputationTime: string }[],
  ) {
    return data.map((entry) => parseInt(entry.imputationTime, 10));
  }

  static validateEffort(
    activities: ActivityImputation[],
    maxEffort: number = 2,
  ): Record<string, number[]> {
    const numIndexes = activities[0]?.imputationArray.length || 0;
    const totals = Array(numIndexes).fill(0);
    const invalidActivities: Record<string, number[]> = {};

    activities.forEach((activity) => {
      activity.imputationArray.forEach((value, index) => {
        totals[index] += value;

        if (value >= maxEffort && totals[index] >= maxEffort) {
          invalidActivities[activity.activityKey] ??= [];
          if (!invalidActivities[activity.activityKey].includes(index)) {
            invalidActivities[activity.activityKey].push(index);
          }
        }
      });
    });

    return invalidActivities;
  }

  static validateMaxEffortByDay(
    activities: ActivityImputation[],
    maxEffort: number = 2,
  ): Record<string, number[]> {
    const numIndexes = activities[0]?.imputationArray.length || 0;
    const totals = Array(numIndexes).fill(0);
    const invalidActivities: Record<string, number[]> = {};

    activities.forEach((activity) => {
      activity.imputationArray.forEach((value, index) => {
        if (value >= maxEffort && totals[index] >= maxEffort) {
          invalidActivities[activity.activityKey] ??= [];
          if (!invalidActivities[activity.activityKey].includes(index)) {
            invalidActivities[activity.activityKey].push(index);
          }
        }
      });
    });

    return invalidActivities;
  }

  static validateRestDays(
    activities: ActivityImputation[],
    restDayKey: string,
  ) {
    const restDayActivity = activities.find(
      (activity) => activity.activityKey === restDayKey,
    );
    if (!restDayActivity) {
      return {};
    }

    const restDayArray = restDayActivity.imputationArray;
    const numIndexes = restDayArray.length;
    const invalidActivities: Record<string, number[]> = {};

    // Parcourir tous les indexes et vérifier les violations des jours de repos
    for (let i = 0; i < numIndexes; i++) {
      if (restDayArray[i] === 1) {
        for (const activity of activities) {
          if (
            activity.activityKey !== restDayKey && // Ne pas comparer le tableau restDay avec lui-même
            activity.imputationArray[i] !== 0 // Vérifier que l'index est bien égal à 0
          ) {
            if (!invalidActivities[activity.activityKey]) {
              invalidActivities[activity.activityKey] = [];
            }
            invalidActivities[activity.activityKey].push(i);
          }
        }
      }
    }

    return invalidActivities;
  }
}

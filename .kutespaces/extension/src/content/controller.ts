import * as vscode from 'vscode';
import { Mission } from "../model/mission";
import { completeMission } from "../model/mission-slice";
import { Store } from "../model/store";
import { showInformationMessage } from '../util';

export type TaskHandler = { [key: string]: {
  start: (store: Store) => void,
  tearDown: () => void,
}; }

export default function(store: Store, mission: Mission, taskHandlers: TaskHandler) {
  let savedCurrentMission: number | undefined = store.getState().mission.currentMission;
  let savedNextTaskID: string | undefined = undefined;
  store.subscribe(() => {
    const state = store.getState().mission;
    const currentMission = state.currentMission;
    let nextTaskID: string | undefined = undefined;
    if(typeof currentMission !== 'undefined' && currentMission == mission.id) {
      nextTaskID = state.missions[currentMission].tasks.find(t => !t.completed)?.id;
    }

    if(nextTaskID !== savedNextTaskID) {
      const lastTask = mission.tasks.find(task => task.id === savedNextTaskID)
      if(typeof lastTask !== 'undefined') {
        taskHandlers[lastTask.id]?.tearDown();
      }

      const nextTask = mission.tasks.find(task => task.id === nextTaskID)
      if(typeof nextTask !== 'undefined') {
        taskHandlers[nextTask.id]?.start(store);
      }
    }

    if(typeof currentMission !== 'undefined' &&
       typeof state.missions[currentMission].tasks.find(t => !t.completed) === 'undefined') {
      showInformationMessage(
        `You just finished all the tasks in the '${mission.description}' mission, congratulations! 🎉`,
        'Complete Mission'
      ).then(btn => {
        if(btn === 'Complete Mission') {
          store.dispatch(completeMission());
        }
      });
    }

    savedCurrentMission = currentMission;
    savedNextTaskID = nextTaskID;
  })
}

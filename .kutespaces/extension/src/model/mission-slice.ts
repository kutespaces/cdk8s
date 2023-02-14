import * as vscode from 'vscode';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { metadata as Mission1 } from '../content/mission1';
import { metadata as Mission2 } from '../content/mission2';
import { Mission } from './mission';
import { showInformationMessage } from '../util';
import { logger } from '../log';

export interface MissionState {
  currentMission: number | undefined
  missions: { [key: number]: Mission; }
}

export interface TaskCompletion {
  missionID: number,
  taskID: string,
}

const initialState: MissionState = {
  currentMission: undefined,
  missions: {
    1: Mission1,
    2: Mission2,
  },
};

export const missionSlice = createSlice({
  name: 'mission',
  initialState,
  reducers: {
    startNextMission: (state) => {
      let nextMissionID: number | undefined = undefined;
      for(const id in state.missions) {
        const hasUncompletedTasks = typeof state.missions[id].tasks.find(t => !t.completed) !== 'undefined'
        if(hasUncompletedTasks) {
          nextMissionID = Number(id);
          break;
        }
      }
      if(typeof nextMissionID === 'undefined') {
        showInformationMessage('Your assignments are finished, there are no more missions to complete!');
        return;
      }
      logger.info('Mission Start', { eventName: 'mission:start', missionID: nextMissionID });
      state.currentMission = nextMissionID;
    },
    completeTask: (state, action: PayloadAction<TaskCompletion>) => {
      state.missions[action.payload.missionID].tasks.forEach((task, i) => {
        if(task.id === action.payload.taskID) {
          state.missions[action.payload.missionID].tasks[i].completed = true
        }
      })
    },
    completeMission: (state) => {
      if(typeof state.currentMission !== 'undefined') {
        const hasUncompletedTasks = typeof state.missions[state.currentMission].tasks.find(t => !t.completed) !== 'undefined'
        if(hasUncompletedTasks) {
          showInformationMessage('You did not complete all the tasks, yet.');
          return;
        }
      }
      logger.info('Mission Complete', { eventName: 'mission:complete', missionID: state.currentMission });
      state.currentMission = undefined;
    },
    abortMission: (state) => {
      state.currentMission = undefined;
    }
  },
});

// Action creators are generated for each case reducer function
export const {
  startNextMission,
  completeTask,
  completeMission,
  abortMission,
} = missionSlice.actions;

export default missionSlice.reducer;

import { State } from "../types/state.types";

export const selectBoards = (state: State) => state.desk.boards;

export const selectBoard = (state: State) => state.desk.selectedBoard;

export const selectIsLoading = (state: State) => state.desk.isLoading;

export const selectError = (state: State) => state.desk.error;

export const selectTask = (state: State) => state.desk.task;

export const selectIsModalOpen = (state: State) => state.modal.isOpen;

export const selectLogs = (state: State) => state.log.logs;

export const selectTaskLogs = (state: State) => state.log.taskLogs;

export const selectIsLogsOpen = (state: State) => state.log.isOpen;

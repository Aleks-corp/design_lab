import { GetBoard } from "../types/board.types";

export const listIdFinder = (
  selectedBoard: GetBoard | null,
  taskId: string | undefined
): string | null => {
  if (taskId === undefined || !selectedBoard) {
    return null;
  }
  let listId = null;
  const list = selectedBoard.lists.find((i) => {
    return i.tasks.some((i) => i.id === taskId);
  });
  if (list) listId = list.id;

  return listId;
};

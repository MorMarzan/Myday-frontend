import { boardService } from "../../services/board.service"
// import { boardService } from "../../services/board.service.local"

export const SET_BOARDS = 'SET_BOARDS'
export const REMOVE_BOARD = 'REMOVE_BOARD'
export const ADD_BOARD = 'ADD_BOARD'
export const SET_CURR_BOARD = 'SET_CURR_BOARD'
export const SET_FILTERED_BOARD = 'SET_FILTERED_BOARD'
export const SET_ACTIVE_TASK = 'SET_ACTIVE_TASK'
export const UPDATE_BOARD = 'UPDATE_BOARD'
export const UPDATE_TASK = 'UPDATE_TASK'
export const UNDO_REMOVE_BOARD = 'UNDO_REMOVE_BOARD'
export const SET_BOARD_ACTIVITIES = 'SET_BOARD_ACTIVITIES'
export const SET_FILTER_BY = 'SET_FILTER_BY'
export const SET_SORT_BY = 'SET_SORT_BY'
export const SET_IS_HEADER_COLLAPSED = 'SET_IS_HEADER_COLLAPSED'

const initialState = {
    boards: [],
    lastRemovedBoard: null,
    currBoard: null,
    filteredBoard: null,
    activeTask: null,
    filterBy: boardService.getDefaultFilter(),
    sortBy: boardService.getDefaultSort(),
    isHeaderCollapsed: false,
    activities: []
}

export function boardReducer(state = initialState, action) {
    var newState = state
    var boards
    var board
    switch (action.type) {
        case SET_BOARDS:
            newState = { ...state, boards: action.boards }
            break

        case SET_CURR_BOARD:
            newState = { ...state, currBoard: action.board }
            break

        case SET_FILTERED_BOARD:
            newState = { ...state, filteredBoard: action.board }
            break

        case ADD_BOARD:
            newState = { ...state, boards: [...state.boards, action.board] }
            break

        case UPDATE_BOARD:
            boards = state.boards.map(board => (board._id === action.board._id) ? action.board : board)
            newState = { ...state, boards }
            break

        case UPDATE_TASK:
            const newGroups = state.currBoard.groups.map(group => {
                const updatedTasks = group.tasks.map(task => {
                    if (task.id !== action.taskId) return task
                    const updatedMsgs = task.msgs ? [action.msg, ...task.msgs] : [action.msg]
                    return { ...task, msgs: updatedMsgs }
                })
                return { ...group, tasks: updatedTasks }
            })
            newState = { ...state, currBoard: { ...state.currBoard, groups: newGroups } }
            break

        case REMOVE_BOARD:
            const lastRemovedBoard = state.boards.find(board => board._id === action.boardId)
            boards = state.boards.filter(board => board._id !== action.boardId)
            newState = { ...state, boards, lastRemovedBoard }
            break

        case UNDO_REMOVE_BOARD:
            if (state.lastRemovedBoard) {
                newState = { ...state, boards: [...state.boards, state.lastRemovedBoard], lastRemovedBoard: null }
            }
            break

        case SET_BOARD_ACTIVITIES:
            newState = { ...state, activities: action.activities }
            break

        case SET_ACTIVE_TASK:
            newState = { ...state, activeTask: action.taskId }
            break

        case SET_FILTER_BY:
            newState = { ...state, filterBy: { ...state.filterBy, ...action.filterBy } }
            break

        case SET_SORT_BY:
            newState = { ...state, sortBy: { ...state.sortBy, ...action.sortBy } }
            break

        case SET_IS_HEADER_COLLAPSED:
            newState = { ...state, isHeaderCollapsed: action.isCollapsed }
            break

        default:
            return state
    }
    return newState
}

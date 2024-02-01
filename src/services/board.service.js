
import { store } from '../store/store.js'
import { activityService } from './activity.service.js'
import { getDefaultBoard } from './boards.service.js'
import { httpService } from './http.service.js'
import { userService } from './user.service.js'
import { utilService } from './util.service.js'

const BASE_URL = 'board/'
const BOARDS_URL = 'boards/'

export const boardService = {
    query,
    getById,
    save,
    remove,
    saveBoards,
    getBoardColors,
    getDefaultFilter,
    getDefaultSort,
    addGroup,
    removeGroup,
    updateGroup,
    findGroupIdByTaskId,
    addTask,
    removeTask,
    updateTask,
    getTaskById,
    getNewUpdate,
    getDefaultBoardsFilter,
    getDefaultLabel
}
window.boardService = boardService

const gColors = [
    '#ffcb00',
    '#007038',
    '#469e9b',
    '#579bfc',
    '#9aadbd',
    '#bba5e8',
    '#8050ab',
    '#4f3a65',
    '#92334c',
    '#bb3354',
    '#ff7575',
]

async function query() {
    try {
        return await httpService.get(BASE_URL)
    } catch (err) {
        throw new Error(err.message || 'An err occurred during getting boards')
    }
}

async function getById(boardId) {
    try {
        const returnedBoard = await httpService.get(BASE_URL + boardId)
        return returnedBoard
    } catch (err) {
        throw new Error(err.message || 'An err occurred during getting board')
    }
}

async function remove(boardId) {
    try {
        return await httpService.delete(BASE_URL + boardId)
    } catch (err) {
        throw new Error(err.message || 'An err occurred during removing board')
    }
}

async function save(board) {
    try {
        if (board) {
            return await httpService.put(BASE_URL, board)
        } else {
            const defaultBoard = getDefaultBoard()
            return await httpService.post(BASE_URL, defaultBoard)
        }
    } catch (err) {
        throw new Error(err.message || 'An err occurred during saving board')
    }
}

async function saveBoards(boards) {
    try {
        return await httpService.post(BOARDS_URL + 'reorder', boards)
    } catch (err) {
        throw new Error(err.message || 'An err occurred during saving board')
    }
}

function getBoardColors() {
    return gColors
}

function getDefaultFilter() {
    return { txt: '', includedCols: [], member: '' }
}

function getDefaultSort() {
    return { type: '', dir: 1 }
}

function getDefaultBoardsFilter() {
    return { title: '' }
}

//group

async function addGroup(boardId) {
    try {
        const board = await getById(boardId)
        const newGroup = _getDefaultGroup()
        board.groups.push(newGroup)

        const savedBoard = await save(board)

        const activity = {
            type: 'create',
            entity: 'group',
            boardId,
            group: {
                id: newGroup.id,
                title: 'Group Title'
            }
        }
        activityService.save(activity)

        return savedBoard
    } catch (err) {
        throw new Error(err.message || 'An err occurred during adding group')
    }
}

async function removeGroup(boardId, groupId) {
    try {
        const board = await getById(boardId)
        if (board.groups.length === 1) throw new Error('Board has to have at least one group')

        const idx = board.groups.findIndex(group => group.id === groupId)
        if (idx < 0) throw new Error(`Remove failed, cannot find group with id: ${groupId} in: ${board.title}`)

        const activity = {
            type: 'remove',
            entity: 'group',
            boardId,
            group: {
                id: board.groups[idx].id,
                title: board.groups[idx].title
            }
        }

        board.groups.splice(idx, 1)
        const savedBoard = await save(board)

        activityService.save(activity)
        return savedBoard
    } catch (err) {
        throw new Error(err.message || 'An err occurred during removing group')
    }
}

async function updateGroup(boardId, group, prevState, newState) {
    try {
        const board = await getById(boardId)
        const groupIdx = board.groups.findIndex(currgroup => currgroup.id === group.id)

        const activity = {
            type: prevState.field,
            entity: 'group',
            boardId,
            group: {
                id: board.groups[groupIdx].id,
                title: board.groups[groupIdx].title
            },
            from: prevState.data,
            to: newState.data
        }

        board.groups.splice(groupIdx, 1, group)
        const savedBoard = await save(board)

        if (prevState.data !== newState.data) activityService.save(activity)
        return savedBoard
    } catch (err) {
        throw new Error(err.message || 'An err occurred during removing group')
    }
}


function findGroupIdByTaskId(taskId) {
    const currBoard = store.getState().boardModule.currBoard

    if (currBoard) {
        for (const group of currBoard.groups) {
            const taskIndex = group.tasks.findIndex(task => task.id === taskId)
            if (taskIndex !== -1) {
                return group.id
            }
        }
    }
    return null
}

//tasks

async function addTask(boardId, groupId, taskTitle, unshiftTask = false) {
    try {
        const board = await getById(boardId)
        const groupIdx = board.groups.findIndex(group => group.id === groupId)
        const group = board.groups[groupIdx]

        const taskMethod = unshiftTask ? 'unshift' : 'push'
        const newTask = _getDefaultTask(taskTitle)
        group.tasks[taskMethod](newTask)

        const activity = {
            type: 'create',
            entity: 'task',
            boardId,
            group: {
                id: groupId,
                title: group.title
            },
            task: {
                id: newTask.id,
                title: newTask.title
            }
        }
        const savedBoard = await save(board)

        activityService.save(activity)
        return savedBoard
    } catch (err) {
        throw new Error(err.message || 'An err occurred during adding task')
    }
}

async function removeTask(boardId, groupId, taskId) {
    try {
        const board = await getById(boardId)
        const groupIdx = board.groups.findIndex(group => group.id === groupId)
        let group = board.groups[groupIdx]
        console.log('removeTask ~ group:', group)
        const task = group.tasks.find(task => task.id === taskId)
        const tasks = group.tasks.filter(task => task.id !== taskId)

        group = { ...group, tasks }
        board.groups.splice(groupIdx, 1, group)

        const activity = {
            type: 'remove',
            entity: 'task',
            boardId,
            group: {
                id: groupId,
                title: group.title
            },
            task: {
                id: taskId,
                title: task.txt
            }
        }
        const savedBoard = await save(board)

        activityService.save(activity)
        return savedBoard
    } catch (err) {
        throw new Error(err.message || 'An err occurred during removing task')
    }
}

async function updateTask(boardId, groupId, task, prevState, newState) {
    try {
        const board = await getById(boardId)
        const groupIdx = board.groups.findIndex(group => group.id === groupId)
        let group = board.groups[groupIdx]
        const tasks = group.tasks.map(currTask => currTask.id === task.id ? task : currTask)

        let activityFrom
        let activityTo

        if (newState || prevState) {
            if (prevState.field === 'person' && newState.data.length !== 0) {
                activityFrom = null
                activityTo = newState.data[0]._id
            } else {
                activityFrom = prevState.data
                activityTo = newState.data
            }
        }

        var activity

        if (newState || prevState) {
            activity = {
                type: prevState.field,
                entity: 'task',
                boardId,
                group: {
                    id: board.groups[groupIdx].id,
                    title: board.groups[groupIdx].title
                },
                task: {
                    id: task.id,
                    title: task.title
                },
                from: activityFrom,
                to: activityTo
            }
        }

        group = { ...group, tasks }
        board.groups.splice(groupIdx, 1, group)

        const savedBoard = await save(board)

        if ((newState || prevState) &&
            (activityFrom !== activityTo) &&
            newState.field !== 'link' &&
            newState.field !== 'file' &&
            prevState.field !== 'link' &&
            prevState.field !== 'file'
        ) activityService.save(activity)
        return savedBoard
    } catch (err) {
        throw new Error(err.message || 'An err occurred during removing task')
    }
}

async function getTaskById(boardId, taskId) {
    try {
        const board = await getById(boardId)
        for (const group of board.groups) {
            const taskIdx = group.tasks.findIndex(currTask => currTask.id === taskId)
            if (taskIdx !== -1) {
                return { ...group.tasks[taskIdx] }
            }
        }

        return null
    } catch (error) {
        console.error('Error fetching task:', error)
        throw new Error('Failed to fetch task')
    }
}


// private methods

function _getDefaultGroup() {
    return {
        id: utilService.makeId(),
        title: 'New Group',
        archivedAt: null,
        tasks: [
        ],
        color: gColors[utilService.getRandomIntInclusive(0, gColors.length - 1)],
    }
}

function _getDefaultTask(title) {
    return {
        id: utilService.makeId(),
        title,
        status: 'l100',
        priority: 'l200',
        members: [],
        msgs: [],
    }
}

function getNewUpdate(txt) {
    return {
        createdAt: Date.now(),
        id: utilService.makeId(),
        likes: [],
        memberId: userService.getLoggedinUser() ? userService.getLoggedinUser()._id : null,
        txt,
        msgs: [],
    }
}


function getDefaultLabel() {
    return {
        id: utilService.makeId(),
        title: '',
        color: gColors[utilService.getRandomIntInclusive(0, gColors.length - 1)],
    }
}
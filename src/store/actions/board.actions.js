import { boardService } from '../../services/board.service.js'
// import { boardService } from '../../services/board.service.local.js'
// import { userService } from '../services/user.service.js'
import { store } from '../store.js'
// import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { ADD_BOARD, REMOVE_BOARD, SET_CURR_BOARD, SET_BOARDS, SET_IS_HEADER_COLLAPSED, UPDATE_BOARD, SET_FILTER_BY, SET_ACTIVE_TASK, SET_FILTERED_BOARD, UPDATE_TASK, SET_BOARD_ACTIVITIES, SET_SORT_BY } from '../reducers/board.reducer.js'
import { setIsLoading } from './system.actions.js'
import { utilService } from '../../services/util.service.js'
import { activityService } from '../../services/activity.service.js'


// Store - saveTask (from board.js)
// function storeSaveTask(boardId, groupId, task, activity) {

//     board = boardService.saveTask(boardId, groupId, task, activity)
//     // commit(ACTION) // dispatch(ACTION)
// }

// function updateTask(cmpType, data) {
// Switch by cmpType
// case MEMBERS:
//    task.members = data
//    activity = boardService.getEmptyActivity()
//    activity.txt = `Members changed for task ${}`
//    activity.task = '{mini-task}'
// case STATUS:
//    task.status = data

// dispatch to store: updateTask(task, activity)
// }

/**************** board actions ****************/

export async function loadBoards() {
    try {
        const boards = await boardService.query()
        boards.sort((a, b) => a.order - b.order)
        store.dispatch(getActionSetBoards(boards))
        return boards
    } catch (err) {
        console.log('Cannot load boards', err)
        throw err
    }
}

export async function loadBoard(boardId) {
    try {
        const board = await boardService.getById(boardId)
        setCurrBoard(board)
        return board
    } catch (err) {
        console.log('Had issues in board details', err)
        throw err
    } finally {
        setIsLoading(false)
    }
}

export function loadFilteredBoard() {
    const filterBy = store.getState().boardModule.filterBy
    const sortBy = store.getState().boardModule.sortBy
    const board = JSON.parse(JSON.stringify(store.getState().boardModule.currBoard))
    if (filterBy.txt) {
        const escapedFilter = utilService.escapeRegExp(filterBy.txt)
        const regex = new RegExp(escapedFilter, 'i')

        board.groups = board.groups.filter(group => {
            group.tasks = group.tasks.filter(task => regex.test(task.title))
            // Return groups that have matching title or have at least one matching task title
            return regex.test(group.title) || group.tasks.length > 0
        })
    }
    if (filterBy.member) {
        board.groups = board.groups.map(group => {
            group.tasks = group.tasks.filter(task => {
                return task.members.some(member => filterBy.member === member) //works here with the memeber's id
            })
            return group
        })
    }

    if (sortBy.type === 'date') {
        board.groups = board.groups.map(group => {
            group.tasks.sort((t1, t2) => {
                //if there's no date, treat it as latest
                let date1 = t1.date ? new Date(t1.date) : new Date('9999-12-31')
                let date2 = t2.date ? new Date(t2.date) : new Date('9999-12-31')
                return (date1 - date2) * sortBy.dir
            })
            return group
        })
    } else if (['title', 'status', 'priority'].includes(sortBy.type)) {
        board.groups = board.groups.map(group => {
            group.tasks.sort((t1, t2) => {
                return t1[sortBy.type].localeCompare(t2[sortBy.type]) * sortBy.dir
            })
            return group
        })
    } else if (sortBy.type === 'members') {
        board.groups = board.groups.map(group => {
            group.tasks.sort((t1, t2) => {
                const memberName1 = getMemberName(t1.members[0], board.members)
                const memberName2 = getMemberName(t2.members[0], board.members)
                return memberName1.localeCompare(memberName2) * sortBy.dir
            })
            return group
        })
    }

    setFilteredBoard(board)
    return board
}

function getMemberName(memberId, boardMembers) {
    const member = boardMembers.find(member => member._id === memberId)
    //if there's no member, sort it in the end with high Unicode character
    return member ? member.fullname : '\uffff'
}

export async function saveNewBoards(boards) {
    try {
        const savedBoards = await boardService.saveBoards(boards)
        store.dispatch(getActionSetBoards(savedBoards))
    } catch (err) {
        console.log('Cannot save boards', err)
        throw err
    }
}

export async function removeBoard(boardId) {
    try {
        const boards = store.getState().boardModule.boards
        if (boards.length === 1) throw new Error('Must have at least one board')
        await boardService.remove(boardId)
        store.dispatch(getActionRemoveBoard(boardId))
    } catch (err) {
        console.log('Cannot remove board', err)
        throw new Error(err.message || 'An err occurred during removing board')
    }
}

export function getMembersFromBoard(board, members) {
    return members.map(member => getMemberFromBoard(board, member))
}

export function getMemberFromBoard(board, memberId) {
    return board.members.find(member => member._id === memberId)
}

export async function addBoard(board) {
    try {
        const savedBoard = await boardService.save(board)
        setCurrBoard(board)
        store.dispatch(getActionAddBoard(savedBoard))
        return savedBoard
    } catch (err) {
        console.log('Cannot add board', err)
        throw err
    }
}

export async function updateBoard(board, isCurrBoard = true) {
    try {
        const savedBoard = await boardService.save(board)
        store.dispatch(getActionUpdateBoard(savedBoard))

        if (!isCurrBoard) return savedBoard

        const currBoardId = store.getState().boardModule.currBoard._id
        if (savedBoard._id === currBoardId) {
            setCurrBoard(savedBoard)
        }

        return savedBoard

    } catch (err) {
        console.log('Cannot save board', err)
        throw err
    }
}

export async function updateBoardOrder(filteredBoard) {
    setFilteredBoard(filteredBoard) //save order in filtered board store
    let fullBoard = store.getState().boardModule.currBoard

    // if no filter is applied, skip ordering filtered board vs fullBoard
    const currFilter = store.getState().boardModule.filterBy
    const emptyFilter = boardService.getDefaultFilter()
    if ((utilService.areObjsIdentical(currFilter, emptyFilter))) {
        fullBoard = filteredBoard
    } else {
        //order full according to filtered
        sortFullBoard(fullBoard, filteredBoard)
    }

    try {
        //save full and ordered on db
        const savedFullBoard = await boardService.save(fullBoard)

        store.dispatch(getActionUpdateBoard(savedFullBoard)) //update all boards in store

        const currBoardId = store.getState().boardModule.currBoard._id
        if (savedFullBoard._id === currBoardId) { //redundant?
            //update the full curr board only in store
            store.dispatch({ type: SET_CURR_BOARD, board: savedFullBoard })
        }

        return savedFullBoard
    } catch (err) {
        console.log('Cannot save board', err)
        throw err
    }
}

function sortFullBoard(fullBoard, filteredBoard) {
    // Create a map for quick access to group order in filteredBoard
    const groupOrder = new Map()
    filteredBoard.groups.forEach((group, idx) => {
        groupOrder.set(group.id, { idx, tasks: group.tasks.map(task => task.id) })
    })

    // Create a copy of fullBoard.groups for reference to original order
    const originalGroupOrder = fullBoard.groups.map(group => group.id)

    // Sort groups in fullBoard based on filteredBoard order
    fullBoard.groups.sort((a, b) => {
        const indexA = groupOrder.has(a.id) ? groupOrder.get(a.id).idx : originalGroupOrder.indexOf(a.id)
        const indexB = groupOrder.has(b.id) ? groupOrder.get(b.id).idx : originalGroupOrder.indexOf(b.id)
        return indexA - indexB
    })

    // Sort tasks within each group based on filteredBoard order
    fullBoard.groups.forEach(group => {
        if (groupOrder.has(group.id)) {
            const taskOrder = groupOrder.get(group.id).tasks
            // Create a copy of group's task for reference to original order
            const originalTaskOrder = group.tasks.map(task => task.id)

            group.tasks.sort((a, b) => {
                const indexA = taskOrder.includes(a.id) ? taskOrder.indexOf(a.id) : originalTaskOrder.indexOf(a.id)
                const indexB = taskOrder.includes(b.id) ? taskOrder.indexOf(b.id) : originalTaskOrder.indexOf(b.id)
                return indexA - indexB
            })
        }
    })

    return fullBoard
}

export function setFilterBy(filterBy) {
    store.dispatch({ type: SET_FILTER_BY, filterBy })
}

export function setSortBy(sortBy) {
    store.dispatch({ type: SET_SORT_BY, sortBy })
}

export function setIsHeaderCollapsed(isCollapsed) {
    store.dispatch({ type: SET_IS_HEADER_COLLAPSED, isCollapsed })
}

export function getBoardColors() {
    return boardService.getBoardColors()
}

// Demo for Optimistic Mutation 
// (IOW - Assuming the server call will work, so updating the UI first)
// export function onRemoveBoardOptimistic(boardId) {
//     store.dispatch({
//         type: REMOVE_BOARD,
//         boardId
//     })
//     showSuccessMsg('Board removed')

//     boardService.remove(boardId)
//         .then(() => {
//             console.log('Server Reported - Deleted Succesfully')
//         })
//         .catch(err => {
//             showErrorMsg('Cannot remove board')
//             console.log('Cannot load boards', err)
//             store.dispatch({
//                 type: UNDO_REMOVE_BOARD,
//             })
//         })
// }

export function setCurrBoard(board) {
    store.dispatch({ type: SET_CURR_BOARD, board })
    setFilteredBoard(board)
}

export function setFilteredBoard(board) {
    store.dispatch({ type: SET_FILTERED_BOARD, board })
}

export async function loadBoardActivities(filterBy = {}) {
    try {
        const activities = await activityService.query(filterBy)
        store.dispatch(getActionSetBoardActivities(activities))
        return activities
    } catch (err) {
        console.log('Cannot load boards', err)
        throw err
    }
}

/**************** group actions ****************/

export async function addGroup(boardId) {
    try {
        const board = await boardService.addGroup(boardId)
        setCurrBoard(board)
        store.dispatch(getActionUpdateBoard(board))
    } catch (err) {
        throw new Error(err.message || 'An err occurred during removing task')
    }

}

export async function removeGroup(boardId, groupId) {
    try {
        const board = await boardService.removeGroup(boardId, groupId)
        setCurrBoard(board)
        store.dispatch(getActionUpdateBoard(board))
    } catch (err) {
        throw new Error(err.message || 'An err occurred during removing task')
    }

}

export async function updateGroup(boardId, group, prevState, newState) {
    const board = await boardService.updateGroup(boardId, group, prevState, newState)
    setCurrBoard(board)
    store.dispatch(getActionUpdateBoard(board))
}


/**************** task actions ****************/

export async function addTask(boardId, groupId, taskTitle, unshiftTask = false) {
    try {
        const board = await boardService.addTask(boardId, groupId, taskTitle, unshiftTask)
        setCurrBoard(board)
        store.dispatch(getActionUpdateBoard(board))

        const groupIdx = unshiftTask ? 0 : board.groups.findIndex(group => group.id === groupId)
        const newTaskIdx = unshiftTask ? 0 : board.groups[groupIdx].tasks.length - 1
        const newTaskId = board.groups[groupIdx].tasks[newTaskIdx].id
        setActiveTask(newTaskId)

        return board
    } catch (err) {
        throw new Error(err.message || 'An err occurred during removing task')
    }

}

export async function removeTask(boardId, groupId, taskId) {
    try {
        const board = await boardService.removeTask(boardId, groupId, taskId)
        setCurrBoard(board)
        store.dispatch(getActionUpdateBoard(board))
    } catch (err) {
        throw new Error(err.message || 'An err occurred during removing task')
    }
}

export async function updateTask(boardId, groupId, task, prevState, newState) {
    const board = await boardService.updateTask(boardId, groupId, task, prevState, newState)
    setCurrBoard(board)
    store.dispatch(getActionUpdateBoard(board))
}

export function setActiveTask(taskId) {
    store.dispatch(getActionSetActiveTask(taskId))
}

export async function getTask(boardId, taskId) {
    try {
        return await boardService.getTaskById(boardId, taskId)
    } catch (error) {
        console.error('Error fetching task:', error)
        throw new Error('Failed to fetch task')
    }
}

//dispatching only func for sockets
export function addMgs(taskId, msg) {
    store.dispatch(getActionUpdateTask(taskId, msg)) //updating currBoard
    const currBoard = store.getState().boardModule.currBoard
    const copyCurrBoard = JSON.parse(JSON.stringify(currBoard))
    setFilteredBoard(copyCurrBoard) //updating filterBoard
    store.dispatch(getActionUpdateBoard(copyCurrBoard)) //updating boards
}

/**************** get actions ****************/

export function getActionRemoveBoard(boardId) {
    return {
        type: REMOVE_BOARD,
        boardId
    }
}

export function getActionAddBoard(board) {
    return {
        type: ADD_BOARD,
        board
    }
}

export function getActionUpdateBoard(board) {
    return {
        type: UPDATE_BOARD,
        board
    }
}

export function getActionSetBoards(boards) {
    return {
        type: SET_BOARDS,
        boards
    }
}

export function getActionSetBoardActivities(activities) {
    return {
        type: SET_BOARD_ACTIVITIES,
        activities
    }
}

// export function getActionSetFilteredBoards(boards) {
//     return {
//         type: SET_FILTERED_BOARDS,
//         boards
//     }
// }

export function getActionSetActiveTask(taskId) {
    return {
        type: SET_ACTIVE_TASK,
        taskId
    }
}

export function getActionUpdateTask(taskId, msg) {
    return {
        type: UPDATE_TASK,
        taskId,
        msg
    }
}




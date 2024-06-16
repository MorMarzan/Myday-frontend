import { httpService } from './http.service.js'

const BASE_URL = 'activity/'

export const activityService = {
    query,
    getById,
    save,
    getFieldTitle,
}
window.activityService = activityService

async function query(filterBy = {}) {
    try {
        return await httpService.get(BASE_URL, filterBy)
    } catch (err) {
        throw new Error(err.message || 'An err occurred during getting activities')
    }
}

async function getById(activityId) {
    try {
        const returnedActivity = await httpService.get(BASE_URL + activityId)
        return returnedActivity
    } catch (err) {
        throw new Error(err.message || 'An err occurred during getting activity')
    }
}

async function save(activity) {
    const { type, entity, boardId, group } = activity
    try {
        const newActivity = {
            type,
            entity,
            board: {
                _id: boardId
            },
            group: {
                id: group.id,
                title: group.title,
            },
        }

        if (activity.task) {
            newActivity.task = {
                id: activity.task.id,
                title: activity.task.title,
            }
        }

        if (type === 'title') {
            newActivity.txt = activity.from
        }
        if (type === 'create') {
            newActivity.txt = `${entity} created`
        }
        if (type === 'person') {
            newActivity.txt = 'Person'
            newActivity.from = 'Added'
        }
        if (type === 'status' || type === 'priority' && !activity.from) {
            newActivity.from = '-'
        }

        if (activity.from) {
            newActivity.from = activity.from
        }

        if (activity.to) {
            newActivity.to = activity.to
        }

        return await httpService.post(BASE_URL, newActivity)
    } catch (err) {
        throw new Error(err.message || 'An err occurred during saving activity')
    }
}

function getFieldTitle(board, field, data) {
    switch (field) {
        case 'status':
            const title = board.status.find(status => status.id === data).title
            return title
        case 'priority':
            return board.priority.find(priority => priority.id === data).title
        default:
            return data
    }
}
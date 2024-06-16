import { useSelector } from "react-redux"

import { utilService } from "../../services/util.service"

import {
    ActivityCalendarIcon, ClockIcon, CreateIcon, LinkIcon,
    PersonIcon, TitleIcon, VerticalLogoIcon, PencilIcon, DeleteIcon
} from "../../services/svg.service"

import { UserImg } from "../UserImg"
import { ActivityStatus } from "./ActivityStatus"

export function ActivityPreview({ activity }) {
    const currBoard = useSelector(state => state.boardModule.currBoard)

    const statuses = currBoard.status
    const priorities = currBoard.priority
    const members = currBoard.members
    const activityTitle = activity.task?.title || activity.group?.title || currBoard.title

    const { byMember, createdAt, type, entity } = activity

    function getStatusColor(statusTitle) {
        if (statusTitle === '-') return '#c4c4c4'
        const ActivityStatus = statuses.find(status => status.title === statusTitle)
        if (!ActivityStatus) return null
        return ActivityStatus.color
    }

    function getPriorityColor(priorityTitle) {
        if (priorityTitle === '-') return '#c4c4c4'
        const priority = priorities.find(priority => priority.title === priorityTitle)
        if (!priority) return null
        return priority.color
    }

    function getMemberName(memberId) {
        const member = members.find(member => member._id === memberId)
        if (!member) return null
        return member
    }

    function getTitle(prevTitle) {
        if (type === 'person' && prevTitle !== 'Added') return getMemberName(prevTitle)
        else return prevTitle
    }

    function getColor(type, title) {
        if (type === 'status') return getStatusColor(title)
        else if (type === 'priority') return getPriorityColor(title)
        else return null
    }

    function getTypeIcon(type) {
        switch (type) {
            case 'date':
                return <ActivityCalendarIcon />
            case 'link':
                return <LinkIcon />
            case 'create':
                return <CreateIcon />
            case 'remove':
                return <DeleteIcon />
            case 'person':
                return <PersonIcon />
            case 'title':
                return <TitleIcon />
            case 'status':
                return <VerticalLogoIcon />
            case 'priority':
                return <VerticalLogoIcon />
            case 'group color':
                return <PencilIcon />
        }
    }

    const titleColor = (type === 'group color') ? activity.to : 'unset'
    const dynTitle = (type === 'remove') ? `${entity} Deleted` : type
    return (
        <>
            <div className="created-at flex align-center">
                <ClockIcon />
                <span>{utilService.timeSince(createdAt)}</span>
            </div>

            <div className="created-by">
                <UserImg user={byMember} />
            </div>

            <div className="title" style={{ color: titleColor }}>
                {activity.task?.title || activity.group?.title || currBoard.title}
            </div>

            <div className="activity-type">
                <div className="title grid column align-center">
                    <span className="grid align-center">{getTypeIcon(type)}</span>
                    <span>{utilService.capitalizeFirstLetter(dynTitle)}</span>
                </div>
            </div>

            <div className="action-description grid column">
                <ActivityStatus
                    type={type}
                    fromStatus={{
                        title: activity.from ? getTitle(activity.from) : '-',
                        color: getColor(type, activity.from),
                    }}
                    toStatus={{
                        title: activity.from ? getTitle(activity.to) : '-',
                        color: getColor(type, activity.to),
                    }}
                    activityTitle={activityTitle}
                />
            </div>
        </>
    )
}


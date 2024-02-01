import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { boardService } from "../services/board.service";
import { getTask, loadBoardActivities, updateTask } from "../store/actions/board.actions";

import { DynamicSidePanelHeader } from "../cmps/DynamicSidePanelHeader";
import { DynamicSidePanelRouter } from "../cmps/DynamicSidePanelRouter";

export function TaskDetails() {
    const board = useSelector((storeState) => storeState.boardModule.currBoard)
    const { boardId, taskId } = useParams()
    const [currTask, setCurrTask] = useState(null)
    const [activities, setActivities] = useState(null)
    const [currSubject, setCurrSubject] = useState('Updates')


    useEffect(() => {
        const task = getTaskById()
        _loadTaskActivities(boardId, task.id)
    }, [boardId, taskId, currSubject, board])


    async function _loadTaskActivities(boardId, taskId) {
        try {
            const boardActivities = await loadBoardActivities({ boardId, taskId })
            setActivities(boardActivities)
        } catch (err) {
            console.error('Error loading board:', err)
        }
    }

    function getTaskById() {
        const allBoardTasks = board.groups.flatMap(group => group.tasks)
        const task = allBoardTasks.find(task => task.id === taskId)
        setCurrTask(task)
        return task
    }

    function onSwitchToSubject(subject) {
        setCurrSubject(subject)
    }

    function onAddUpdate(update) {
        const updatedTask = { ...currTask, msgs: [update, ...currTask.msgs] }
        setCurrTask(updatedTask)
        const groupId = boardService.findGroupIdByTaskId(taskId)
        updateTask(boardId, groupId, updatedTask)
    }

    function onAddFile(fileUrl) {
        const updatedTask = { ...currTask, file: fileUrl }
        setCurrTask(updatedTask)
        const groupId = boardService.findGroupIdByTaskId(taskId)
        updateTask(boardId, groupId, updatedTask)
    }

    if (!currTask || !activities) return

    const { title, members, file, msgs } = currTask

    const headerProps = {
        type: 'taskDetails',
        title,
        members,
        file,
        subjects: ['Updates', 'Files', 'Activity Log'],
        onSwitchToSubject,
    }

    const bodyProps = {
        msgs,
        files: [file],
        activities
    }

    return (
        <section className={`task-details`}>
            <DynamicSidePanelHeader boardId={boardId} headerProps={{ ...headerProps }} currSubject={currSubject} />
            <DynamicSidePanelRouter type={currSubject} bodyProps={bodyProps} onAddUpdate={onAddUpdate} onAddFile={onAddFile} />
        </section>
    )
}

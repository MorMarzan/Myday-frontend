import { useState } from "react"
import { useSelector } from "react-redux"

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

import { addTask, setActiveTask, updateBoardOrder } from "../../../../store/actions/board.actions"

import { TaskPreview } from "./TaskPreview"
import { AddTask } from "./AddTask"

export function TaskList({ groupId, groupColor, filterBy }) {
    const board = useSelector((storeState) => storeState.boardModule.filteredBoard)
    const [taskTitle, setTaskTitle] = useState('')

    const groupIdx = board.groups.findIndex(group => group.id === groupId)
    const group = board.groups[groupIdx]

    const handleDragEnd = (result) => {
        if (!result.destination) return

        const newOrderedTasks = group.tasks
        const [removed] = newOrderedTasks.splice(result.source.index, 1)
        newOrderedTasks.splice(result.destination.index, 0, removed)
        saveNewOrder()
    }

    async function saveNewOrder() {
        try {
            await updateBoardOrder(board)
        } catch (err) {
            console.log('Cannot save group:', err)
        }
    }

    function onSetTaskTitle({ target }) {
        const title = target.value
        setTaskTitle(title)
    }

    async function onAddTask() {
        try {
            await addTask(board._id, groupId, taskTitle)
            setTaskTitle('')
        } catch (err) {
            console.error('Error adding task:', err)
            showErrorMsg('Cannot add Task')
        }
    }

    function onSetActiveTask(taskId) {
        setActiveTask(taskId)
    }

    return (
        <ul className="clean-list flex column relative subgrid full-grid-column full-width task-list">
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId={group.id}>
                    {(provided) => (
                        <div className="subgrid full-grid-column tasks-container" {...provided.droppableProps} ref={provided.innerRef}>
                            {
                                group.tasks.map((task, idx) => (
                                    <Draggable key={task.id} draggableId={task.id} index={idx} >
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className={`${snapshot.isDragging && 'dragged-task'}`}
                                            >
                                                <TaskPreview
                                                    key={task.id}
                                                    task={task}
                                                    groupId={groupId}
                                                    groupColor={groupColor}
                                                    onSetActiveTask={onSetActiveTask}
                                                    filterBy={filterBy}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ))
                            }
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <AddTask
                groupId={groupId}
                groupColor={groupColor}
                title={taskTitle}
                onSetTitle={onSetTaskTitle}
                onSetActiveTask={onSetActiveTask}
                addTask={onAddTask}
            />
        </ul >
    )
}
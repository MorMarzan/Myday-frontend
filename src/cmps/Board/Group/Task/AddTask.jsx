import { useState } from "react"
import { useSelector } from "react-redux"

import { showErrorMsg } from "../../../../store/actions/system.actions"

import { EditableTxt } from "../../../EditableTxt"

export function AddTask({ title, onSetTitle, addTask, groupColor, onSetActiveTask, groupId }) {
    const activeTask = useSelector((storeState) => storeState.boardModule.activeTask)
    const isMobile = useSelector((storeState) => storeState.systemModule.isMobile)
    const [isInputFocus, setIsInputFocus] = useState(false)

    function onTitleClick() {
        setIsInputFocus(true)
        onSetActiveTask(groupId)
    }

    async function onAddTask() {
        try {
            setIsInputFocus(false)
            if (activeTask === groupId) onSetActiveTask(null)
            if (title) addTask()
        } catch (err) {
            console.error('Error changing task title:', err)
            showErrorMsg('Cannot add Task')
        }
    }

    const inputExtraBts = isMobile ?
        [
            {
                className: "add-task-btn",
                txt: 'Add Task',
                onMouseDown: onAddTask
            }
        ]
        :
        []

    return (
        <ul className="clean-list subgrid full-grid-column task-preview-container add-task">
            <ul className={`clean-list subgrid full-grid-column ${activeTask === groupId && 'active'} task-preview`}>
                <div className="subgrid full-grid-column task-title-container">
                    <div className="sticky-left flex subgrid full-width add-task-content">
                        <div className="add-task-content-layout flex">
                            <div className="task-row-placeholder"></div>

                            <div style={{ backgroundColor: groupColor }} className={`${isMobile ? 'sticky-left' : 'sticky-left-36'} color-display`}></div>

                            <div className="flex full-width task-edit-container">
                                <li className="task-selection">
                                    <div className="checkbox"></div>
                                </li>

                                <li className="task-title single-task">
                                    <EditableTxt
                                        isEditing={isInputFocus}
                                        txtValue={'+ Add task'}
                                        onTxtClick={onTitleClick}
                                        inputValue={title}
                                        onInputChange={onSetTitle}
                                        onEditClose={onAddTask}
                                        placeholder={'+ Add task'}
                                        extraBtnsEnd={inputExtraBts}
                                    />
                                </li>
                            </div>
                        </div>
                    </div>
                    <li className="subgrid grid-column-table-content line-end"></li>
                </div>
            </ul>
        </ul>
    )
}

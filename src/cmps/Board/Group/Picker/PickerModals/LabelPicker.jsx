import { useSelector } from 'react-redux'
import { useState } from 'react'

import { PencilIcon } from '../../../../../services/svg.service'
import { boardService } from '../../../../../services/board.service'

import { updateBoard } from '../../../../../store/actions/board.actions'
import { showErrorMsg } from '../../../../../store/actions/system.actions'

import { LabelList } from './LabelList'

export function LabelPicker({ onChangeStatus, title }) {
    const board = useSelector((storeState) => storeState.boardModule.filteredBoard)
    const [currLabels, setCurrLabels] = useState(board[title])
    const [isEditing, setIsEditing] = useState(false)

    function handleChange(newStatus) {
        onChangeStatus([title], newStatus)
    }

    function onLabelsChange(label) {
        const newLabels = currLabels.map(currLabel => currLabel.id === label.id ? label : currLabel)
        setCurrLabels(newLabels)
    }

    async function onAddLabel() {
        try {
            const newLabels = [...currLabels, boardService.getDefaultLabel()]
            setCurrLabels(newLabels)
            const newBoard = { ...board, [title]: newLabels }
            await updateBoard(newBoard)
        } catch (err) {
            console.log('err', err)
            showErrorMsg('Cannot add label')
        }
    }

    async function onRemoveLabel(labelId) {
        try {
            const labelIdx = currLabels.findIndex(label => label.id === labelId)
            if (labelIdx === -1) throw new Error('Label not found')

            const newLabels = [...currLabels]
            newLabels.splice(labelIdx, 1)
            setCurrLabels(newLabels)

            const replacementLabel = getReplacementLabel(title)
            let newBoard = { ...board, [title]: currLabels }

            newBoard = updateTasksInBoard(newBoard, title, labelId, replacementLabel)
            await updateBoard(newBoard)
        } catch (err) {
            console.log('err', err)
            showErrorMsg('Cannot remove label')
        }
    }

    function getReplacementLabel(title) {
        return title === 'status'
            ? { id: 'l100', color: '#c4c4c4' }
            : title === 'priority'
                ? { id: 'l200', color: '#c4c4c4' }
                : null
    }

    function updateTasksInBoard(board, title, removedLabelId, replacementLabel) {
        const updatedGroups = board.groups.map(group => ({
            ...group,
            tasks: group.tasks.map(task => ({
                ...task,
                [title]: task[title] === removedLabelId ? replacementLabel.id : task[title],
            })),
        }))

        return { ...board, groups: updatedGroups }
    }


    async function onEditBtnClick() {
        try {
            setIsEditing(prev => !prev)
            if (isEditing) {
                const newBoard = { ...board, [title]: currLabels }
                await updateBoard(newBoard)
            }
        } catch (err) {
            console.log('err', err)
            showErrorMsg('Cannot update labels')
        }
    }

    return (
        <div className="general-modal flex column align-center justify-center status-picker-modal">
            <LabelList
                labels={currLabels}
                handleChange={handleChange}
                isEditing={isEditing}
                onLabelsChange={onLabelsChange}
                onAddLabel={onAddLabel}
                onRemoveLabel={onRemoveLabel}
            />

            <button className='btn flex align-center justify-center edit-btn' onClick={onEditBtnClick}>
                {!isEditing && <PencilIcon />}
                <p>{isEditing ? 'Apply' : 'Edit Labels'}</p>
            </button>

        </div>
    )
}

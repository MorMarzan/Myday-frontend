import { useSelector } from "react-redux"
import { useEffect, useRef, useState } from "react"

import { setDynamicModal, resetDynamicModal } from "../../../../store/actions/system.actions"
import { utilService } from "../../../../services/util.service"

export function LabelPreview({ title, info, onUpdate, taskId, isChangingToDone }) {
    const board = useSelector((storeState) => storeState.boardModule.filteredBoard)
    const { parentId } = useSelector((storeState) => storeState.systemModule.dynamicModal)

    const [animationClass, setAnimationClass] = useState('')
    const previewBtnRef = useRef(null)

    const animations = ['balloon', 'confetti', 'crazy_balls']

    const label = board[title].find(option => option.id === info.chosenOption)
    if (!label) return <li className="status-preview status-col priority-col">Loading...</li>


    useEffect(() => {
        if (isChangingToDone && label.id === 'l101') {
            const randomIndex = utilService.getRandomIntInclusive(0, animations.length - 1)
            setAnimationClass(animations[randomIndex])
        } else {
            setAnimationClass('')
        }
    }, [isChangingToDone, label.id])

    const isCurrPickerOpen = parentId === `${taskId}-${title}Picker`

    function onLabelPreviewClick() {
        if (isCurrPickerOpen) {
            resetDynamicModal()
        } else {
            setDynamicModal({
                isOpen: true,
                parentRefCurrent: previewBtnRef.current,
                type: 'labelPicker',
                data: { selectedStatus: info.chosenOption, title, onUpdate },
                parentId: `${taskId}-${title}Picker`,
                isPosBlock: true,
                isCenter: true,
                hasCaret: true,

            })
        }
    }

    const style = { backgroundColor: label.color }

    return (
        <li
            onClick={onLabelPreviewClick}
            style={style}
            className={`status-preview status-col priority-col ${animationClass}`}
            ref={previewBtnRef}
        >
            <p>{label.title}</p>

            <div className="corner-fold"></div>
        </li >
    )
}

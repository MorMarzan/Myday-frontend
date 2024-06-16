import { useSelector } from "react-redux"
import { useRef } from "react"

import { utilService } from "../../../../services/util.service"
import { CloseIcon, DangerIcon } from "../../../../services/svg.service"

import { setDynamicModal, resetDynamicModal } from "../../../../store/actions/system.actions"

export function DatePreview({ task, onUpdate }) {
    const { parentId } = useSelector((storeState) => storeState.systemModule.dynamicModal)
    const previewBtnRef = useRef(null)

    const isCurrPickerOpen = parentId === `${task.id}-datePicker`
    const selectedDate = task.date
    const hasTimePassed = utilService.hasTimePassed(selectedDate)
    const isTaskDone = task.status === 'l101'

    function onDatePreviewClick() {
        if (isCurrPickerOpen) {
            resetDynamicModal()
        } else {
            setDynamicModal({
                isOpen: true,
                parentRefCurrent: previewBtnRef.current,
                type: 'datePicker',
                data: { selectedDate: selectedDate || Date.now(), onUpdate },
                parentId: `${task.id}-datePicker`,
                isPosBlock: true,
                isCenter: true
            })
        }
    }

    function onRemoveDateClick(ev) {
        ev.stopPropagation()
        onUpdate('date', null)
    }

    return (
        <li
            onClick={onDatePreviewClick}
            className="date-col data-preview-container date-preview"
            ref={previewBtnRef}
        >
            <p className={`${(hasTimePassed && isTaskDone) && 'line-through'} data-preview-content flex align-center justify-center`}>
                {selectedDate && utilService.getFormatDate(selectedDate)}
            </p>


            {selectedDate && <>
                {hasTimePassed && <div className={`${!isTaskDone ? 'red' : 'green'} time-passed-icon`}><DangerIcon /></div>}
                <button className="btn remove-btn" onClick={onRemoveDateClick}><CloseIcon /></button>
            </>}

        </li>
    )
}

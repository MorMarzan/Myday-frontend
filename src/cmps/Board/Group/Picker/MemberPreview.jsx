import { useSelector } from "react-redux"
import { useRef } from "react"

import { resetDynamicModal, setDynamicModal } from "../../../../store/actions/system.actions"
import { MembersDisplay } from "../../MembersDisplay"

export function MemberPreview({ chosenMembers, allMembers, onUpdate, taskId }) {
    const { parentId } = useSelector((storeState) => storeState.systemModule.dynamicModal)
    const previewBtnRef = useRef(null)

    const isCurrPickerOpen = parentId === `${taskId}-memberPicker`

    function onMemberPreviewClick() {
        if (isCurrPickerOpen) {
            resetDynamicModal()
        } else {
            setDynamicModal({
                isOpen: true,
                parentRefCurrent: previewBtnRef.current,
                type: 'memberPicker',
                data: { chosenMembers, allMembers, onChangeMembers: onUpdate },
                parentId: `${taskId}-memberPicker`,
                isPosBlock: true,
                isCenter: true,
                hasCaret: true,
            })
        }
    }

    return (
        <li onClick={onMemberPreviewClick} className="member-preview member-col flex justify-center align-center" ref={previewBtnRef}>
            <MembersDisplay members={chosenMembers} />
        </li >
    )
}

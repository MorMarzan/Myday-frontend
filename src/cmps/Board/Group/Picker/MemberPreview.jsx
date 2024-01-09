import { useSelector } from "react-redux"
import { useRef } from "react"

import { UserImg } from "../../../UserImg"
import { resetDynamicModal, setDynamicModal } from "../../../../store/actions/system.actions"

export function MemberPreview({ chosenMembers, allMembers, onUpdate, taskId }) {
    const previewBtnRef = useRef(null)

    const { fatherId } = useSelector((storeState) => storeState.systemModule.dynamicModal)
    const isPickerOpen = fatherId === `${taskId}-memberPicker`
    const extraMembers = chosenMembers.length - 2

    function onMemberPreviewClick(ev) {
        if (isPickerOpen) {
            resetDynamicModal()
        } else {
            setDynamicModal({
                isOpen: true,
                boundingRect: previewBtnRef.current.getBoundingClientRect(),
                type: 'memberPicker',
                data: { chosenMembers, allMembers, onChangeMembers: onUpdate },
                fatherId: `${taskId}-memberPicker`,
                isPosBlock: true,
                isCenter: true
            })
        }
    }

    return (
        <li onClick={onMemberPreviewClick} className="member-preview member-col flex justify-center align-center" ref={previewBtnRef}>
            {!chosenMembers.length &&
                <img className="user-img"
                    src="https://res.cloudinary.com/dkvliixzt/image/upload/v1704358773/person-empty_zckbtr_wrffbw.svg"
                />
            }

            {!!chosenMembers.length && <div className="member-img-container flex justify-center align-center">
                {chosenMembers.map((member, idx) => {
                    return idx < 2 ? <UserImg key={idx} user={member} /> : ''
                })}
                {extraMembers > 0 && <span className="extra-members-box">+{extraMembers}</span>}
            </div>
            }
        </li >
    )
}

import { useSelector } from "react-redux"
import { resetDynamicDialog } from "../store/actions/system.actions"

export function DynamicDialog() {
    const dialogData = useSelector((storeState) => storeState.systemModule.dynamicDialog)

    const handleClose = () => {
        if (dialogData.onClose) {
            dialogData.onClose()
        } else {
            resetDynamicDialog()
        }
    }

    if (!dialogData.isOpen) return
    return (
        <div className="dynamic-dialog animate__fadeIn animate__animated animate__faster fast-animation">
            <div className="black-screen" onClick={handleClose}></div>

            <div className="dialog-content">
                {dialogData.contentCmp}
            </div>
        </div>
    )
}

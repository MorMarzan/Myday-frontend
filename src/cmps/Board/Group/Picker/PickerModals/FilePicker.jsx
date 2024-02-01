import { useRef, useState } from "react"
import { resetDynamicModal } from "../../../../../store/actions/system.actions"
import { AttachIcon } from "../../../../../services/svg.service"
import { uploadService } from "../../../../../services/upload.service";

export function FilePicker({ chosenFile, changeFile, taskId }) {
    const [newFile, setNewFile] = useState(chosenFile)
    const fileInputRef = useRef(null);

    async function onUploadFile(ev) {
        try {
            const imgData = await uploadService.uploadImg(ev)
            setNewFile(imgData.url)
            changeFile('file', imgData.url, taskId)
            resetDynamicModal()
        } catch (err) {
            console.log('err', err)
        }
    }

    const options = [
        {
            icon: <AttachIcon />,
            title: 'From Computer',
            onOptionClick: () => {
                fileInputRef.current.click();
            }
        },
    ]

    return (
        <div className="general-modal menu-option-modal relative">
            {
                options.map((option, idx) => (
                    <div key={idx} className="btn" onClick={option.onOptionClick}>
                        {option.icon}
                        <p>{option.title}</p>
                    </div>
                ))
            }
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                value={newFile ? `File: ${newFile}` : ''}
                style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: '11px',
                    left: '51px',
                    scale: '1.5',
                    opacity: 0,
                }}
                onChange={onUploadFile}
            />
        </div>
    )
}

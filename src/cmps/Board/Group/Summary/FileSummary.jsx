import { useEffect, useState } from "react"
import { updateTask } from "../../../../store/actions/board.actions"
import { FilePreview } from "../Picker/FilePreview"

export function FileSummary({ group, board }) {
    const [fileSummaries, setFileSummaries] = useState()

    useEffect(() => {
        setFileSummaries(generateFileSummaries())
    }, [group])

    function generateFileSummaries() {
        return group.tasks
            .map(task => ({ file: task.file, taskId: task.id }))
            .filter(fileSummary => fileSummary.file)
    }

    function onFileUpdate(field, receivedData, taskId) {
        const task = group.tasks.find(task => task.id === taskId)
        const updatedTask = { ...task, [field]: receivedData }
        updateTask(board._id, group.id, updatedTask)
    }

    if (!fileSummaries || !fileSummaries.length) return <li className="file-summary flex column"><p>File</p></li>
    return (
        <li className="file-summary flex column">
            <p>File</p>
            <ul className="clean-list flex">
                {fileSummaries.map((fileSummary, idx) => (
                    <FilePreview
                        key={idx}
                        file={fileSummary.file}
                        parentElementId={group.id}
                        onUpdate={onFileUpdate}
                        taskId={fileSummary.taskId}
                    />
                ))}
            </ul>
        </li>
    )
}


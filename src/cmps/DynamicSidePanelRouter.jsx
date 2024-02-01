import { PanelActivity } from "./Panel/PanelActivity"
import { PanelFile } from "./Panel/PanelFile"
import { PanelUpdate } from "./Panel/PanelUpdate"

export function DynamicSidePanelRouter(props) {
    const { type, bodyProps } = props

    switch (type) {
        case 'Updates':
            return (
                <PanelUpdate
                    msgs={bodyProps.msgs}
                    onAddUpdate={props.onAddUpdate}
                />)
        case 'Files':
            return (
                <PanelFile
                    files={bodyProps.files}
                    onAddFile={props.onAddFile}
                />)
        case 'Activity Log':
            return (
                <PanelActivity
                    activities={bodyProps.activities}
                />)
    }
}
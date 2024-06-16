import { FileSummary } from "./Summary/FileSummary"
import { LabelSummary } from "./Summary/LabelSummary"
import { Timeline } from "./Summary/Timeline"

export default function DynamicSummary({ title, group, board }) {
    switch (title) {

        case "member":
        case "link":
            return (
                <li></li>)

        case "status":
        case "priority":
            return (
                <LabelSummary title={title} group={group} board={board} />)

        case "date":
            return (
                <Timeline group={group} board={board} defaultWidth={'174px'} />)

        case "file":
            return (
                <FileSummary group={group} board={board} />)

        default:
            return <li>UNKNOWN {title}</li>
    }
}

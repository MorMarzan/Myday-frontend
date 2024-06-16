import { GroupSummary } from "../Summary/GroupSummary"
import { TaskList } from "./TaskList"

export function TaskTable({ groupColor, titlesOrder, group, filterBy, board }) {
    return (
        <div className="full-width subgrid full-grid-column task-table">

            <TaskList titlesOrder={titlesOrder}
                groupId={group.id}
                filterBy={filterBy}
                groupColor={groupColor} />

            <GroupSummary group={group} titlesOrder={titlesOrder} board={board} />
        </div>
    )
}

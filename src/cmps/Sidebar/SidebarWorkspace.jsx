import { SidebarFilter } from "./SidebarFilter"
import { SidebarWorkspaceNav } from "./SidebarWorkspaceNav"

export function SidebarWorkspace(
    {
        filterBy,
        onSetFilter,
        onAddNewBoard,
    }) {

    return (
        <section className="sidebar-workspace">
            <SidebarWorkspaceNav />
            <SidebarFilter
                filterBy={filterBy}
                onAddNewBoard={onAddNewBoard}
                onSetFilter={onSetFilter}
            />
        </section>
    )
}
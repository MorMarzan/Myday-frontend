import { SidebarFilter } from "./SidebarFilter"
import { SidebarWorkspaceNav } from "./SidebarWorkspaceNav"

export function SidebarWorkspace(
    {
        filterBy,
        onSetFilter,
        onAddNewBoard,
        boardsToDisplay,
        dynFavoriteClass
    }) {

    return (
        <section className="sidebar-workspace">
            <SidebarWorkspaceNav
                boardsToDisplay={boardsToDisplay}
                dynFavoriteClass={dynFavoriteClass}
            />
            <SidebarFilter
                filterBy={filterBy}
                onAddNewBoard={onAddNewBoard}
                onSetFilter={onSetFilter}
            />
        </section>
    )
}
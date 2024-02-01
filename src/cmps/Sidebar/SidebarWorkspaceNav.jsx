import { HomeBlackFillIcon, MenuIcon } from "../../services/svg.service"
import WorkspaceDisplay from "../WorkspaceDisplay"

export function SidebarWorkspaceNav() {
    return (
        <>
            <section className="sidebar-workspace-nav">
                <WorkspaceDisplay />
            </section>
            <button className="btn btn-option-menu svg-inherit-color">
                <MenuIcon />
            </button>
        </>
    )
}
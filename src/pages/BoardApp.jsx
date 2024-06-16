import { Outlet } from "react-router"
import { useSelector } from "react-redux"

import { Sidebar } from "../cmps/Sidebar/Sidebar"
import { DynamicModal } from "../cmps/DynamicModal"
import { BoardAppHeader } from "../cmps/BoardAppHeader"
import { DynamicDialog } from "../cmps/DynamicDialog"

export function BoardApp() {
    const isFullSidebarMobile = useSelector((storeState) => storeState.systemModule.isFullSidebarMobile)

    return (
        <section className="main-layout grid board-app">
            <BoardAppHeader />
            <main className={`content-container  ${isFullSidebarMobile ? 'is-sidebar-full-mobile' : ''}`}>
                <Sidebar />
                <Outlet />
            </main>
            <DynamicModal />
            <DynamicDialog />
        </section>
    )
}

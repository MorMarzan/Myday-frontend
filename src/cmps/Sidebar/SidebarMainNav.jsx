import { useRef } from "react"
import { useSelector } from "react-redux"
import { NavLink } from "react-router-dom"

import { setCurrBoard } from "../../store/actions/board.actions"
import { onTooltipParentEnter, onTooltipParentLeave, setIsFullSidebarMobile } from "../../store/actions/system.actions"

import { HomeIcon, AngleRightIcon, CalendarIcon } from "../../services/svg.service"

export function SidebarMainNav({ isSidebarOpen, onOpenSidebar, changeWidthVariable }) {
    const isMobile = useSelector((storeState) => storeState.systemModule.isMobile)
    const { parentId, type, isOpen } = useSelector((storeState) => storeState.systemModule.dynamicModal)
    const titleRef = useRef(null)

    return (
        <nav className="sidebar-main-nav">
            <NavLink className={`btn btn-nav svg-inherit-color`}
                to="/"
                onClick={() => {
                    changeWidthVariable(250)
                    setCurrBoard(null)
                }}
            >
                <HomeIcon />
                <span>Home</span>
            </NavLink>

            <NavLink className={`btn btn-nav svg-inherit-color`}
                to="/board/workspace"
                title="My Work Button"
                onClick={() => {
                    setCurrBoard(null)
                    setIsFullSidebarMobile(false)
                }}
            >
                <CalendarIcon />
                <span>My work</span>
            </NavLink>


            <button className={`btn svg-inherit-color btn-menu ${isSidebarOpen ? 'open' : ''}`}
                onClick={onOpenSidebar}
                ref={titleRef}
                onMouseEnter={() => onTooltipParentEnter(isMobile, isOpen, type, `${isSidebarOpen ? 'Close' : 'Open'} navigation`, 'collapse-sidebar', titleRef)}
                onMouseLeave={() => onTooltipParentLeave(isMobile, parentId, 'collapse-sidebar')}
            >
                <AngleRightIcon />
            </button>
        </nav>
    )
}
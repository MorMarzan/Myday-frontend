import { useEffect, useRef, useState } from "react"
import { BoardFilter } from "./BoardFilter"
import { BoardEdit } from "./BoardEdit"
import { MenuIcon } from "../../services/svg.service"

export function BoardHeader({ board }) {

    const [isCollapsed, setIsCollapsed] = useState(false)
    const sentinelRef = useRef(null) //since the header is alway sticky, there was a need of static element to detect going outside the viewport

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsCollapsed(!entry.isIntersecting)
            },
            {
                root: null, // null means the viewport
                rootMargin: '0px',
                threshold: 0,
            }
        )

        if (sentinelRef.current) {
            observer.observe(sentinelRef.current)
        }

        return () => {
            if (sentinelRef.current) {
                observer.unobserve(sentinelRef.current)
            }
        }
    }, [])

    function onCollapseHeader() {
        setIsCollapsed(!isCollapsed)
    }

    const dynCollapsedClass = isCollapsed ? 'collapsed' : ''

    return (
        <>
            <div ref={sentinelRef} className="header-sentinel"></div>

            <header className={dynCollapsedClass + ' board-header'}>

                <BoardEdit board={board} />

                <button className="activities btn">
                    <span>Activity</span>
                </button>

                <div className="invite-more-bts flex align-center">
                    <button className="btn invite">
                        <img src="../../public/icons/invite.svg" alt="Add-person-icon" />
                        <span>Invite / 1</span>
                    </button>
                    <button className="btn more" title="Options">
                        <MenuIcon />
                    </button>
                </div>

                <div className="display-opts flex align-center">
                    <button className="btn main-table" title="Main Table">
                        <img src="../../public/icons/Home.svg" alt="Home-icon" />
                        <span>Main Table</span>
                    </button>
                    <button className="btn add-view" title="Add view">
                        <img src="../../public/icons/AddSmallNormalClr.svg" alt="Add-icon" />
                    </button>
                </div>

                <div className="actions flex align-center">
                    <button className="btn automate">
                        <img src="../../public/icons/Robot.svg" alt="Robot-icon" />
                        <span>Automate</span>
                    </button>
                    <button className={dynCollapsedClass + ' btn collapse'} title="Collapse header" onClick={onCollapseHeader}>
                        <img src="../../public/icons/DropdownChevronDown.svg" alt="Dropdown-icon" />
                    </button>
                </div>

                <BoardFilter />
            </header>
        </>
    )
}

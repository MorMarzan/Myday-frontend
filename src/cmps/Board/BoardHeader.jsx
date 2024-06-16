import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router"

import { getUsers } from "../../store/actions/user.actions"
import { loadBoardActivities, removeBoard, setIsHeaderCollapsed } from "../../store/actions/board.actions"
import {
    onTooltipParentEnter, onTooltipParentLeave, resetDynamicDialog,
    resetDynamicModal, setDynamicDialog, setDynamicModal, setSidePanelOpen, showErrorMsg, showSuccessMsg
} from "../../store/actions/system.actions"

import { HomeIcon, InviteIcon, PlusIcon, RobotIcon, MenuIcon, AngleDownIcon, DeleteIcon } from "../../services/svg.service"
import { BoardFilter } from "./BoardFilter"
import { BoardEdit } from "./BoardEdit"
import { InviteModal } from "./InviteModal"
import { AutomationModal } from "./AutomationModal"
import { MembersDisplay } from "./MembersDisplay"

export function BoardHeader({ board, filterBy, onSetFilter }) {
    const { parentId, type, isOpen } = useSelector((storeState) => storeState.systemModule.dynamicModal)
    const isMobile = useSelector((storeState) => storeState.systemModule.isMobile)

    const [isCollapsed, setIsCollapsed] = useState(false)
    const [activityUsers, setActivityUsers] = useState(null)

    const sentinelRef = useRef(null) //since the header is alway sticky, there was a need of static element to detect going outside the viewport
    const mainTableRef = useRef(null)
    const addTableRef = useRef(null)
    const collapseBtneRef = useRef(null)
    const optTopHeaderRef = useRef(null)

    const navigate = useNavigate()

    const isMenuOpen = parentId === 'board-header-menu'

    useEffect(() => {
        loadUsers()
    }, [])

    useEffect(() => {
        _loadBoardActivities(board._id)
    }, [board])

    async function _loadBoardActivities(boardId) {
        try {
            const boardActivities = await loadBoardActivities({ boardId })
            setActivityUsers(getUniqueMembers(boardActivities))
        } catch (err) {
            console.error('Error loading board:', err)
        }
    }

    async function loadUsers() {
        try {
            await getUsers()
        } catch (err) {
            console.error('Error loading Users:', err)
            showErrorMsg('Cannot load Users')
        }
    }


    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                const currIsCollapsed = !entry.isIntersecting
                setIsCollapsed(currIsCollapsed)
                setIsHeaderCollapsed(currIsCollapsed)
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

    function getUniqueMembers(activities) {
        const uniqueMemberIds = new Set()
        const uniqueMembers = []

        activities.forEach(activity => {
            const member = activity.byMember

            // Check if 'byMember' is an object and has '_id' property
            if (member && member._id && !uniqueMemberIds.has(member._id)) {
                uniqueMemberIds.add(member._id)
                uniqueMembers.push(member)
            }
        })

        return uniqueMembers
    }

    function onCollapseHeader() {
        const currIsCollapsed = !isCollapsed
        setIsCollapsed(currIsCollapsed)
        setIsHeaderCollapsed(currIsCollapsed)
    }

    function onInviteClick() {
        setDynamicDialog({
            isOpen: true,
            contentCmp: <InviteModal board={board} onCloseDialog={resetDynamicDialog} />
        })
    }

    function onAutomateClick() {
        setDynamicDialog({
            isOpen: true,
            contentCmp: <AutomationModal />
        })
    }

    function toggleMenu() {
        if (isMenuOpen) {
            resetDynamicModal()
        } else {
            setDynamicModal(
                {
                    isOpen: true,
                    parentRefCurrent: optTopHeaderRef.current,
                    type: 'menuOptions',
                    data: { options: menuOption },
                    parentId: 'board-header-menu',
                    isPosBlock: true,
                })
        }
    }

    async function onRemoveBoard() {
        try {
            await removeBoard(board._id)
            showSuccessMsg('We successfully deleted the board')
            resetDynamicModal()
            navigate('/board/workspace')
        } catch (err) {
            console.log('Error removing board:', err)

            if (err) {
                showErrorMsg(err.message)
            } else {
                showErrorMsg('Cannot delete Board')
            }
        }
    }

    const menuOption = [
        {
            icon: <DeleteIcon />,
            title: 'Delete Board',
            onOptionClick: onRemoveBoard
        },
    ]

    const dynCollapsedClass = isCollapsed ? 'collapsed' : ''
    return (
        <>
            <div ref={sentinelRef} className="header-sentinel"></div>

            <header className={"board-header " + dynCollapsedClass}>

                <BoardEdit board={board} />

                <button className="activities btn"
                    onClick={() => {
                        setSidePanelOpen(true)
                        navigate('activity_log')
                    }}
                >
                    <span>Activity</span>
                    <MembersDisplay members={activityUsers} />
                </button>

                <div className="invite-more-bts flex align-center">
                    <button className="btn invite" onClick={onInviteClick}>
                        <InviteIcon />
                        <span>Invite / 1</span>
                    </button>

                    <button
                        className="btn svg-inherit-color more"
                        ref={optTopHeaderRef}
                        onMouseEnter={() => onTooltipParentEnter(isMobile, isOpen, type, 'Options', 'options-board-header-top-title', optTopHeaderRef)}
                        onMouseLeave={() => onTooltipParentLeave(isMobile, parentId, 'options-board-header-top-title')}
                        onClick={toggleMenu}
                    >
                        <MenuIcon />
                    </button>
                </div>

                <div className="display-opts flex align-center">
                    <button
                        className="btn main-table"
                        ref={mainTableRef}
                        onMouseEnter={() => onTooltipParentEnter(isMobile, isOpen, type, 'Main Table', 'main-table-title', mainTableRef)}
                        onMouseLeave={() => onTooltipParentLeave(isMobile, parentId, 'main-table-title')}
                    >
                        <HomeIcon />
                        <span>Main Table</span>
                    </button>

                    <button
                        className="btn add-view svg-inherit-color"
                        ref={addTableRef}
                        onMouseEnter={() => onTooltipParentEnter(isMobile, isOpen, type, 'Add view', 'add-table-title', addTableRef)}
                        onMouseLeave={() => onTooltipParentLeave(isMobile, parentId, 'add-table-title')}
                    >
                        <PlusIcon />
                    </button>
                </div>

                <div className="actions flex align-center">
                    <button className="btn automate" onClick={onAutomateClick}>
                        <RobotIcon />
                        <span>Automate</span>
                    </button>

                    <button
                        className={dynCollapsedClass + ' btn svg-inherit-color collapse'}
                        onClick={onCollapseHeader}
                        ref={collapseBtneRef}
                        onMouseEnter={() => onTooltipParentEnter(isMobile, isOpen, type, 'Collapse header', 'collapse-header-title', collapseBtneRef)}
                        onMouseLeave={() => onTooltipParentLeave(isMobile, parentId, 'collapse-header-title')}
                    >
                        <AngleDownIcon />
                    </button>
                </div>

                <BoardFilter
                    board={board}
                    filterBy={filterBy}
                    onSetFilter={onSetFilter}
                />
            </header>
        </>
    )
}

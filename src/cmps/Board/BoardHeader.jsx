import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"

import { BoardFilter } from "./BoardFilter"
import { BoardEdit } from "./BoardEdit"
import { HomeIcon, InviteIcon, PlusIcon, RobotIcon, MenuIcon, AngleDownIcon } from "../../services/svg.service"
import { setIsHeaderCollapsed } from "../../store/actions/board.actions"
import { useNavigate } from "react-router"
import { resetDynamicDialog, resetDynamicModal, setDynamicDialog, setDynamicModal, setSidePanelOpen } from "../../store/actions/system.actions"
import { InviteModal } from "./InviteModal"
import { getUsers } from "../../store/actions/user.actions"
import { AutomationModal } from "./AutomationModal"

export function BoardHeader({ board, filterBy, onSetFilter }) {
    const users = useSelector((storeState) => storeState.userModule.users)

    const [isCollapsed, setIsCollapsed] = useState(false)
    const sentinelRef = useRef(null) //since the header is alway sticky, there was a need of static element to detect going outside the viewport
    const navigate = useNavigate()

    const { parentId, type, isOpen } = useSelector((storeState) => storeState.systemModule.dynamicModal)
    const mainTableRef = useRef(null)
    const addTableRef = useRef(null)
    const collapseBtneRef = useRef(null)

    useEffect(() => {
        loadUsers()
    }, [])

    async function loadUsers() {
        try {
            const users = await getUsers()
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

    function onStatEnter(txt, name, ref) {
        if (isOpen && type !== 'tooltip') return

        setDynamicModal(
            {
                isOpen: true,
                parentRefCurrent: ref.current,
                type: 'tooltip',
                data: { txt },
                parentId: `${name}-tooltip`,
                hasCaret: true,
                isCenter: true,
                isPosBlock: true,
                caretClred: true
            })
    }

    function onStatLeave(name) {
        if (parentId === `${name}-tooltip`) resetDynamicModal()
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

    function onIntegrateClick() {
        setDynamicDialog({
            isOpen: true,
            contentCmp: <AutomationModal />
        })
    }

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
                </button>

                <div className="invite-more-bts flex align-center">
                    <button className="btn invite" onClick={onInviteClick}>
                        <InviteIcon />
                        <span>Invite / 1</span>
                    </button>

                    <button className="btn svg-inherit-color more" title="Options">
                        <MenuIcon />
                    </button>
                </div>

                <div className="display-opts flex align-center">
                    <button
                        className="btn main-table"
                        // title="Main Table"
                        ref={mainTableRef}
                        onMouseEnter={() => onStatEnter('Main Table', 'main-table-title', mainTableRef)}
                        onMouseLeave={() => onStatLeave('main-table-title')}
                    >
                        <HomeIcon />
                        <span>Main Table</span>
                    </button>

                    <button
                        className="btn add-view svg-inherit-color"
                        // title="Add view"
                        ref={addTableRef}
                        onMouseEnter={() => onStatEnter('Add view', 'add-table-title', addTableRef)}
                        onMouseLeave={() => onStatLeave('add-table-title')}
                    >
                        <PlusIcon />
                    </button>
                </div>

                <div className="actions flex align-center">
                    <button className="btn automate" onClick={onIntegrateClick}>
                        <RobotIcon />
                        <span>Automate</span>
                    </button>

                    <button
                        className={dynCollapsedClass + ' btn svg-inherit-color collapse'}
                        onClick={onCollapseHeader}
                    // title="Collapse header"
                    // ref={collapseBtneRef}
                    // onMouseEnter={() => onStatEnter('Collapse header', 'collapse-header-title', collapseBtneRef)}
                    // onMouseLeave={() => onStatLeave('collapse-header-title')}
                    >
                        <AngleDownIcon />
                    </button>
                </div>

                <BoardFilter
                    board={board}
                    filterBy={filterBy}
                    onSetFilter={onSetFilter}
                />
                {/* <DynamicDialog dialogContentComponent={<InviteModal board={board} onCloseDialog={() => setIsInviteDialogOpen(false)} />} onCloseDialog={() => setIsInviteDialogOpen(false)} /> */}
            </header>
        </>
    )
}

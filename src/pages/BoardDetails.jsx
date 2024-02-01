import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { Outlet, useNavigate, useParams } from "react-router"
import loader from "/img/board-loader.gif"

import { addGroup, loadBoard, loadFilteredBoard, setFilterBy, getTask, setSortBy } from "../store/actions/board.actions"

import { BoardHeader } from "../cmps/Board/BoardHeader"
import { TaskDetails } from "./TaskDetails"
import { GroupList } from "../cmps/Board/Group/GroupList"
import { boardService } from "../services/board.service"
import { useEffectUpdate } from "../customHooks/useEffectUpdate"
import { activityService } from "../services/activity.service"
import { ActivityLog } from "../cmps/Panel/ActivityLog"
import { resetDynamicModal, setDynamicDialog } from "../store/actions/system.actions"
import { BrowserWarningTxt } from "../cmps/BrowserWarningTxt"

export function BoardDetails() {
    const isIncompatibleBrowser = useSelector((storeState) => storeState.systemModule.isIncompatibleBrowser)
    const board = useSelector((storeState) => storeState.boardModule.filteredBoard)
    const filterBy = useSelector((storeState) => storeState.boardModule.filterBy)
    const sortBy = useSelector((storeState) => storeState.boardModule.sortBy)
    const isLoading = useSelector((storeState) => storeState.systemModule.isLoading)
    const modalData = useSelector((storeState) => storeState.systemModule.dynamicModal)
    const [scrollTop, setScrollTop] = useState(0)
    const navigate = useNavigate()
    // const user = useSelector((storeState) => storeState.userModule.loggedinUser)

    const [isFocusLastGroup, setIsFocusLastGroup] = useState(false)
    const { boardId } = useParams()

    useEffect(() => {
        if (isIncompatibleBrowser) {
            incompatibleBrowserAlert()
        }
    }, [])

    useEffect(() => {
        setTimeout(() => {
            _loadBoard()
        }, 1600)

        setFilterBy(boardService.getDefaultFilter()) // restart filter on nav
        setSortBy(boardService.getDefaultSort()) // restart sort on nav
        // TODO : Emit watch on the user + add a listener for when user changes
        // socketService.emit(SOCKET_EMIT_BOARD_WATCH, boardId)
        // socketService.on(SOCKET_EVENT_BOARD_UPDATED, (board) => {
        //     setBoard(board)
        // })

        // return () => socketService.off(SOCKET_EVENT_BOARD_UPDATED)
    }, [boardId])

    useEffectUpdate(() => {
        if (board) loadFilteredBoard()
    }, [filterBy, sortBy])

    function incompatibleBrowserAlert() {
        setDynamicDialog({
            isOpen: true,
            onClose: () => navigate('/'),
            contentCmp: <BrowserWarningTxt className={'browser-warning-modal'} />
        })
    }

    async function _loadBoard() {
        try {
            await loadBoard(boardId)
            loadFilteredBoard()
        } catch (err) {
            console.error('Error loading board:', err)
        }
    }

    async function onAddGrop() {
        try {
            await addGroup(board._id)
            setIsFocusLastGroup(true)
        } catch (err) {
            console.error("Error adding group:", err)
        }
    }

    function onSetFilter(filterBy) {
        setFilterBy(filterBy)
    }

    function onDetailsScroll(ev) {
        setScrollTop(ev.target.scrollTop)
        resetDynamicModal()
    }

    const { txt } = filterBy

    if (isLoading || !board) return (
        <section className="loader-container grid place-center">
            <img className="myday-loader" src={loader} alt="" />
        </section>
    )
    return (
        <section onScroll={onDetailsScroll} className="board-details">
            <BoardHeader
                board={board}
                filterBy={{ txt }}
                onSetFilter={onSetFilter}
            />

            <GroupList
                scrollTop={scrollTop}
                board={board}
                isFocusLastGroup={isFocusLastGroup}
                onSetIsFocusLastGroup={() => setIsFocusLastGroup(false)}
                onAddGrop={onAddGrop}
            />

            <Outlet
                routes={{
                    'task/:taskId': { element: <TaskDetails /> },
                    'activity_log': { element: <ActivityLog /> },
                }}
            />
            {/* the outlet is to display the nested route- task details */}
            {/* Pass different props to each component using the routes object */}

        </section>
    )
}

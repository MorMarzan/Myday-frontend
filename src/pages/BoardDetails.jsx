import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { useEffectUpdate } from "../customHooks/useEffectUpdate"

import { Outlet, useNavigate, useParams } from "react-router"

import { addGroup, loadBoard, loadFilteredBoard, setFilterBy, setSortBy } from "../store/actions/board.actions"
import { resetDynamicModal, setDynamicDialog } from "../store/actions/system.actions"

import loader from "/img/board-loader.gif"
import { BoardHeader } from "../cmps/Board/BoardHeader"
import { GroupList } from "../cmps/Board/Group/GroupList"
import { boardService } from "../services/board.service"
import { BrowserWarningTxt } from "../cmps/BrowserWarningTxt"

export function BoardDetails() {
    const board = useSelector((storeState) => storeState.boardModule.filteredBoard)
    const filterBy = useSelector((storeState) => storeState.boardModule.filterBy)
    const sortBy = useSelector((storeState) => storeState.boardModule.sortBy)
    const isLoading = useSelector((storeState) => storeState.systemModule.isLoading)

    const [scrollTop, setScrollTop] = useState(0)
    const navigate = useNavigate()

    const [isFocusLastGroup, setIsFocusLastGroup] = useState(false)
    const { boardId } = useParams()

    useEffect(() => {
        setTimeout(() => {
            _loadBoard()
        }, 1600)

        setFilterBy(boardService.getDefaultFilter()) // restart filter on nav
        setSortBy(boardService.getDefaultSort()) // restart sort on nav
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

    async function onAddGroup() {
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
                onAddGroup={onAddGroup}
            />

            <Outlet />
        </section>
    )
}

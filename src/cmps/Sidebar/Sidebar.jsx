import { useSelector } from "react-redux"
import { useCallback, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router"

import { boardService } from "../../services/board.service"
import { utilService } from "../../services/util.service"

import { resetDynamicModal, showErrorMsg, showSuccessMsg } from "../../store/actions/system.actions"
import { addBoard, loadBoards, removeBoard, updateBoard } from "../../store/actions/board.actions"

import { SidebarMainNav } from "./SidebarMainNav"
import { SidebarWorkspace } from "./SidebarWorkspace"
import { SidebarBoardNav } from "./SidebarBoardNav"

export function Sidebar() {
    const boards = useSelector((storeState) => storeState.boardModule.boards)
    const currActiveBoard = useSelector((storeState) => storeState.boardModule.currBoard)
    const isMobile = useSelector((storeState) => storeState.systemModule.isMobile)

    const [filterBy, setFilterBy] = useState(boardService.getDefaultBoardsFilter())
    const [filteredBoards, setFilteredBoards] = useState(boards)

    const [isResizing, setIsResizing] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const [isFavorite, setIsFavorite] = useState(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    const [sidebarWidth, setSidebarWidth] = useState(250)

    const navigate = useNavigate()
    const sidebarRef = useRef(null)

    useEffect(() => {
        _loadDataBoards()
    }, [])

    useEffect(() => {
        filterBoards()
    }, [filterBy, boards])

    async function _loadDataBoards() {
        try {
            const boards = await loadBoards()
            setFilteredBoards(boards)
        } catch (err) {
            console.error('Error loading Boards:', err)
            showErrorMsg('Cannot load Boards')
        }
    }

    function boardsToDisplay(boardsToDisplay) {
        if (boardsToDisplay === 'all') {
            setFilteredBoards(boards)
            setIsFavorite(false)
        } else if (boardsToDisplay === 'favorites') {
            const favoriteBoards = boards.filter(board => board.isStarred)
            setFilteredBoards(favoriteBoards)
            setIsFavorite(true)
        }
        resetDynamicModal()
    }

    function filterBoards() {
        if (filterBy.title) {
            const escapedFilter = utilService.escapeRegExp(filterBy.title)
            const regex = new RegExp(escapedFilter, 'i')
            const newBoards = boards.filter(board => regex.test(board.title))
            setFilteredBoards(newBoards)
        } else {
            setFilteredBoards(boards)
        }
    }

    async function onAddNewBoard() {
        try {
            const newBoard = await addBoard()
            navigate(newBoard._id)
        } catch (err) {
            console.error('Error adding new Board:', err)
            showErrorMsg('Cannot add new Board')
        }
    }

    async function _onRemoveBoard(boardId) {
        try {
            await removeBoard(boardId)
            showSuccessMsg('We successfully deleted the board')
        } catch (err) {
            console.log('Error removing board:', err)

            if (err) {
                showErrorMsg(err.message)
            } else {

                showErrorMsg('Cannot delete Board')
            }
        }
    }

    async function _onUpdateBoard(board, title) {
        try {
            await updateBoard({ ...board, title })
        } catch (err) {
            console.error('Error removing task:', err)
            showErrorMsg('Cannot update Board')
        }
    }

    function onSetFilter(filterBy) {
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
    }

    function onOpenSidebar() {
        if (isSidebarOpen) {
            changeWidthVariable(30)
        }

        else changeWidthVariable(sidebarWidth)
        setIsSidebarOpen(!isSidebarOpen)
    }

    function onUpdateBoard(board, title) {
        _onUpdateBoard(board, title)
    }

    function onRemoveBoard(boardId) {
        _onRemoveBoard(boardId)
    }

    const changeWidthVariable = (newWidth) => {
        document.documentElement.style.setProperty('--sidebar-width', newWidth + 'px')
    }

    const startResizing = useCallback(() => {
        setIsResizing(true)
    }, [])

    const stopResizing = useCallback(() => {
        setIsResizing(false)
    }, [])

    const resize = useCallback(
        (ev) => {
            if (isResizing && !isMobile) {
                let screenWidth = window.innerWidth
                let newWidth = ev.clientX - sidebarRef.current.getBoundingClientRect().left

                if (screenWidth >= 905 && screenWidth <= 1055) {
                    if (newWidth > 250) newWidth = 250
                    if (newWidth < 200) newWidth = 200
                } else if (screenWidth > 1055) {
                    if (newWidth > 400) newWidth = 400
                    if (newWidth < 200) newWidth = 200
                }
                setSidebarWidth(newWidth)
                changeWidthVariable(newWidth)
            }
        },
        [isResizing]
    )

    useEffect(() => {
        window.addEventListener("mousemove", resize)
        window.addEventListener("mouseup", stopResizing)
        return () => {
            window.removeEventListener("mousemove", resize)
            window.removeEventListener("mouseup", stopResizing)
        }
    }, [resize, stopResizing])

    var style = !isHovered && !isSidebarOpen ? style : {
        width: sidebarWidth,
        position: 'absolute',
        zIndex: 35,
    }

    const sidebarClass = `sidebar ${isSidebarOpen ? 'open' : ''}`
    const dynFavoriteClass = isFavorite ? 'favorite' : ''

    return (
        <section className="sidebar-container relative" >
            <article
                ref={sidebarRef}
                style={style}
                onMouseDown={(ev) => ev.preventDefault()}
                className={`${sidebarClass} ${isHovered && !isMobile ? 'hovered' : ''}`}
                onMouseEnter={() => !isResizing && setIsHovered(true)}
                onMouseLeave={() => !isResizing && setIsHovered(false)}
            >
                <SidebarMainNav
                    isSidebarOpen={isSidebarOpen}
                    onOpenSidebar={onOpenSidebar}
                    changeWidthVariable={changeWidthVariable}
                />
                <SidebarWorkspace
                    filterBy={filterBy}
                    onAddNewBoard={onAddNewBoard}
                    onSetFilter={onSetFilter}
                    boardsToDisplay={boardsToDisplay}
                    dynFavoriteClass={dynFavoriteClass}
                />
                <SidebarBoardNav
                    boards={filteredBoards}
                    currActiveBoard={currActiveBoard}
                    removeBoard={onRemoveBoard}
                    updateBoard={onUpdateBoard}
                    filterBy={filterBy}
                />
                <div className="app-sidebar-resizer" onMouseDown={startResizing} />
            </article>
        </section >

    )
}

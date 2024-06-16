import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router"

import { utilService } from "../../services/util.service"

import { resetDynamicModal, setDynamicModal, setIsLoading, setIsFullSidebarMobile } from "../../store/actions/system.actions"
import { setCurrBoard } from "../../store/actions/board.actions"

import { DeleteIcon, BoardIcon, MenuIcon, PencilIcon } from "../../services/svg.service"
import { HighlightText } from "../HighlightText"

export function SidebarBoardLink({ board, boards, currActiveBoard, removeBoard, updateBoard, filterBy }) {
    // const filterBy = useSelector((storeState) => storeState.boardModule.filterBy)
    const { parentId } = useSelector((storeState) => storeState.systemModule.dynamicModal)

    const [isEditing, setIsEditing] = useState(false)
    const [editedTitle, setEditedTitle] = useState(board.title)
    const [lastClickedBoardId, setLastClickedBoardId] = useState(null)

    const menuBtnRef = useRef(null)
    const boardNavBtnRef = useRef(null)
    const editedTitleRef = useRef(editedTitle)
    const { boardId } = useParams()

    const navigate = useNavigate()

    const isMenuOpen = parentId === `${board._id}-sidebar-menu`

    // the ref here is to compensate the closure of editedTitle that maintained by handleClickOutside
    useEffect(() => {
        editedTitleRef.current = editedTitle
    }, [editedTitle])

    useEffect(() => {
        setEditedTitle(board.title)
        editedTitleRef.current = editedTitle
    }, [board.title])

    useEffect(() => {
        if (isEditing) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isEditing])

    function handleClickOutside(ev) {
        if (boardNavBtnRef.current && !boardNavBtnRef.current.contains(ev.target)) {
            updateBoard(board, editedTitleRef.current)
            setIsEditing(false)
        }
    }

    function onRemoveBoard() {
        removeBoard(board._id)
    }

    function onUpdateBoard() {
        updateBoard(board, editedTitle)
        setIsEditing(false)
    }

    function toggleMenu(ev) {
        ev.stopPropagation()
        const newBoardId = ev.currentTarget.getAttribute('data-boardid')
        setLastClickedBoardId(newBoardId)

        if (isMenuOpen) {
            resetDynamicModal()
        } else {
            setDynamicModal({
                isOpen: true,
                parentRefCurrent: menuBtnRef.current,
                parentId: `${board._id}-sidebar-menu`,
                type: 'menuOptions',
                data: { options: menuOptions },
                isPosBlock: true
            })
        }
    }

    const handleInputKeyDown = (ev) => {
        if (ev.key === 'Enter') {
            onUpdateBoard()
        }
    }

    function onLinkClick() {
        setIsFullSidebarMobile(false)
        if (boardId === board._id) return
        setIsLoading(true)
        setCurrBoard(null)
        navigate(`/board/${board._id}`)
    }

    const menuOptions = [
        {
            icon: <DeleteIcon />,
            title: 'Delete',
            onOptionClick: () => {
                onRemoveBoard()
                resetDynamicModal()
            }
        },
        {
            icon: <PencilIcon />,
            title: 'Rename Board',
            onOptionClick: () => {
                onUpdateBoard()
                setIsEditing(!isEditing)
                resetDynamicModal()
            }
        }
    ]

    const style = { position: 'relative' }

    const dynActiveNavClass = currActiveBoard && currActiveBoard._id === board._id ? 'active' : ''
    const dynHoverNavClass = lastClickedBoardId === board._id && isMenuOpen ? 'hovered' : ''
    const dynModalClass = isMenuOpen ? 'active' : ''

    if (!boards && !boards.length) return <div>Loading board...</div>
    return (
        <>
            <div className={`grid btn btn-board-nav ${dynActiveNavClass} ${dynHoverNavClass}`}
                onClick={onLinkClick}
                title={`${board.title} Board`}
                ref={boardNavBtnRef}
            >
                <BoardIcon />
                {isEditing ? (
                    <input
                        type="text"
                        value={editedTitle}
                        onChange={(ev) => setEditedTitle(ev.target.value)}
                        onBlur={onUpdateBoard}
                        onKeyDown={handleInputKeyDown}
                        autoFocus
                    />
                ) : (
                    <>
                        <span><HighlightText text={board.title} query={filterBy.title} /></span>

                        <button
                            className={`btn btn-option-menu svg-inherit-color ${dynModalClass}`}
                            style={style}
                            alt="Board Menu"
                            onClick={toggleMenu}
                            title="Board Menu"
                            data-boardid={board._id}
                            ref={menuBtnRef}
                        >
                            <MenuIcon />
                        </button>
                    </>
                )}
            </div>
        </>
    )
}
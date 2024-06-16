import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { useEffectUpdate } from "../../customHooks/useEffectUpdate"

import { updateBoard } from "../../store/actions/board.actions"
import {
    onTooltipParentEnter, onTooltipParentLeave, setDynamicDialog,
    setDynamicModalData, setIsFullSidebarMobile, showErrorMsg
} from "../../store/actions/system.actions"

import { ArrowLeftIcon, InfoIcon } from "../../services/svg.service"
import { EditableTxt } from "../EditableTxt"
import { InfoModal } from "./InfoModal"
import { Star } from "./Star"

export function BoardEdit({ board }) {
    const { parentId, type, isOpen } = useSelector((storeState) => storeState.systemModule.dynamicModal)
    const isMobile = useSelector((storeState) => storeState.systemModule.isMobile)

    const [boardToEdit, setBoardToEdit] = useState(board)
    const [isEditing, setIsEditing] = useState(false)

    const titleRef = useRef(null)
    const infoRef = useRef(null)

    useEffect(() => {
        setBoardToEdit(board)
    }, [board])

    useEffectUpdate(() => {
        onUpdateBoard()
    }, [boardToEdit.isStarred])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value
                break
            case 'checkbox':
                value = target.checked
                break
            default:
                break
        }
        setBoardToEdit(prevBoard => ({ ...prevBoard, [field]: value }))
    }

    async function onUpdateBoard() {
        try {
            await updateBoard(boardToEdit)
        } catch (err) {
            console.log('Cannot update board', err)
            showErrorMsg('Cannot update Board')
        } finally {
            setIsEditing(false)
        }
    }

    function onStarClick() {
        setBoardToEdit(prevBoard => ({ ...prevBoard, isStarred: !prevBoard.isStarred }))
        setDynamicModalData({ txt: boardToEdit.isStarred ? 'Add to favorites' : 'Remove from favorites' })
    }

    function onInfoClick() {
        setDynamicDialog({
            isOpen: true,
            contentCmp: <InfoModal />
        })
    }

    const { title } = boardToEdit

    return (
        <>
            <button className="back" onClick={() => setIsFullSidebarMobile(true)}>
                <ArrowLeftIcon />
            </button>

            <div
                ref={titleRef}
                onMouseEnter={() => onTooltipParentEnter(isMobile, isOpen, type, 'Click to edit', 'header-title', titleRef)}
                onMouseLeave={() => onTooltipParentLeave(isMobile, parentId, 'header-title')}
            >
                <EditableTxt
                    isEditing={isEditing}
                    txtValue={board.title}
                    onTxtClick={() => setIsEditing(true)}
                    inputValue={title}
                    inputName={'title'}
                    onInputChange={handleChange}
                    onEditClose={onUpdateBoard}
                />
            </div>

            <div className="info-favorite flex align-center">
                <button
                    className="btn info"
                    ref={infoRef}
                    onMouseEnter={() => onTooltipParentEnter(isMobile, isOpen, type, 'Show board description', 'info-title', infoRef)}
                    onMouseLeave={() => onTooltipParentLeave(isMobile, parentId, 'info-title')}
                    onClick={onInfoClick}
                >
                    <InfoIcon />
                </button>

                <Star isStarred={boardToEdit.isStarred} onStarClick={onStarClick} />
            </div>
        </>
    )
}



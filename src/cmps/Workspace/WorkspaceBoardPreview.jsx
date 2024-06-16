import { useNavigate } from "react-router"
import { useEffect, useState } from "react"
import { useEffectUpdate } from "../../customHooks/useEffectUpdate"

import { updateBoard } from "../../store/actions/board.actions"
import { setDynamicModalData, showErrorMsg } from "../../store/actions/system.actions"

import workspaceBoardPreview from "/img/workspace-board-preview.svg"
import { BoardIcon } from "../../services/svg.service"
import { Star } from "../Board/Star"

export function WorkspaceBoardPreview({ board }) {
    const [boardToEdit, setBoardToEdit] = useState(board)
    const navigate = useNavigate()

    useEffect(() => {
        setBoardToEdit(board)
    }, [board])

    useEffectUpdate(() => {
        onUpdateBoard()
    }, [boardToEdit.isStarred])

    async function onUpdateBoard() {
        try {
            await updateBoard(boardToEdit, false)
        } catch (err) {
            console.log('Cannot update board', err)
            showErrorMsg('Cannot update Board')
        }
    }

    function onStarClick(ev) {
        ev.stopPropagation()
        setBoardToEdit(prevBoard => ({ ...prevBoard, isStarred: !prevBoard.isStarred }))
        setDynamicModalData({ txt: boardToEdit.isStarred ? 'Add to favorites' : 'Remove from favorites' })
    }

    return (
        <article className="workspace-board-preview grid"
            onClick={() => navigate(`/board/${board._id}`)}>
            <img src={workspaceBoardPreview} alt="" />
            <section className="flex align-center space-between">
                <div className="flex align-center">
                    <BoardIcon />
                    <p className="board-title">{board.title}</p>
                </div>

                <Star isStarred={boardToEdit.isStarred} onStarClick={onStarClick} />
            </section>
            <p>work management &gt Main workspace  </p>
        </article>
    )
}   
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { updateBoard } from "../../store/actions/board.actions"
import { onTooltipParentEnter, onTooltipParentLeave, resetDynamicDialog, resetDynamicModal, setDynamicModal, showErrorMsg } from "../../store/actions/system.actions"
import { EditableTxt } from "../EditableTxt"
import { CloseIcon, FeedbackIcon } from "../../services/svg.service"
import WorkspaceDisplay from "../WorkspaceDisplay"
import { UserImg } from "../UserImg"
import { utilService } from "../../services/util.service"

export function InfoModal() {
    const board = useSelector((storeState) => storeState.boardModule.filteredBoard)
    const { parentId, type, isOpen } = useSelector((storeState) => storeState.systemModule.dynamicModal)
    const isMobile = useSelector((storeState) => storeState.systemModule.isMobile)


    const [boardToEdit, setBoardToEdit] = useState(board)
    const [isEditingTitle, setIsEditingTitle] = useState(false)
    const [isEditingDesc, setIsEditingDesc] = useState(false)

    const titleRef = useRef(null)
    const txtareaRef = useRef(null)
    const creatorRef = useRef(null)

    useEffect(() => {
        setBoardToEdit(board)
    }, [board])

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
            setIsEditingTitle(false)
            setIsEditingDesc(false)
        }
    }

    function getFormatDate(id) {
        const timestamp = utilService.getCreationTimeFromId(id)
        const date = new Date(timestamp);
        const day = date.getDate();
        const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
        const year = date.getFullYear();
        return `${day} ${month}, ${year}`;
    }


    function onTitelParentHover(txt, name, ref) {
        if (!isEditingTitle) onTooltipParentEnter(isMobile, isOpen, type, txt, name, ref)
    }

    function handleKeyDown(ev) {
        if (ev.key === 'Enter' && (!ev.ctrlKey && !ev.shiftKey)) {
            txtareaRef.current.blur()
        } else if (ev.key === 'Enter' && (ev.ctrlKey || ev.shiftKey)) {
            let boardDesc = boardToEdit.description || ''
            boardDesc += '\n'
            setBoardToEdit(prevBoard => ({ ...prevBoard, description: boardDesc }))
        }
    }

    function onUserImgHover() {
        if (board.createdBy) onTitelParentHover(board.createdBy.fullname, 'header-title', creatorRef)
    }

    const txtPlaceholder = isEditingDesc ? '' : 'Add a description here to make sure your team is aligned on the \npurpose of this board'

    return (
        <div className="flex info-modal">
            <div className="flex column board-description-container">
                <div
                    className="title-container"
                    ref={titleRef}
                    onMouseEnter={() => onTitelParentHover('Click to edit', 'header-title', titleRef)}
                    onMouseLeave={() => onTooltipParentLeave(isMobile, parentId, 'header-title')}
                >
                    <EditableTxt
                        isEditing={isEditingTitle}
                        txtValue={boardToEdit.title}
                        onTxtClick={() => setIsEditingTitle(true)}
                        inputValue={boardToEdit.title}
                        inputName={'title'}
                        onInputChange={handleChange}
                        onEditClose={onUpdateBoard}
                    />
                </div>

                <div className="description-container">
                    <textarea
                        className={`${isEditingDesc && 'edit-mode'}`}
                        value={boardToEdit.description || ''}
                        placeholder={txtPlaceholder}
                        onFocus={() => setIsEditingDesc(true)}
                        onBlur={onUpdateBoard}
                        name="description"
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        ref={txtareaRef}
                    >
                    </textarea>
                </div>

                <a className="flex align-center svg-inherit-color feedback" href="https://mail.google.com/mail/u/0/?fs=1&to=edenrize@gmail.com,mormarzan@gmail.com,noamsaar11@gmail.com&su=Feedback%20on%20Myday&tf=cm" target="_blank">
                    <FeedbackIcon />
                    <p>Give feedback</p>
                </a>
            </div>

            <div className="flex column board-data-container">
                <p className="board-info-title">Board info</p>

                <div className="flex column additional-info">
                    <p className="title">Workspace</p>
                    <WorkspaceDisplay />
                </div>
                <div className="flex column additional-info">
                    <p className="title">Created by</p>
                    <div className="flex align-center creation-info">
                        <div
                            className="flex user-container"
                            ref={creatorRef}
                            onMouseEnter={onUserImgHover}
                            onMouseLeave={() => onTooltipParentLeave(isMobile, parentId, 'header-title')}
                        >
                            <UserImg user={board.createdBy} />
                        </div>

                        <p>{getFormatDate(board._id)}</p>
                    </div>
                </div>
            </div>

            <button className='flex close-btn' onClick={resetDynamicDialog}><CloseIcon /></button>
        </div>
    )
}

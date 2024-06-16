import { useState } from "react"
import { useSelector } from "react-redux"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

import { updateBoardOrder } from "../../../store/actions/board.actions"

import { BigPlusIcon } from "../../../services/svg.service"
import { BoardGroup } from "./BoardGroup"
import emptySearch from "/img/search-empty.svg"


export function GroupList({ board, isFocusLastGroup, onSetIsFocusLastGroup, scrollTop, onAddGrop }) {
    const isHeaderCollapsed = useSelector((storeState) => storeState.boardModule.isHeaderCollapsed)
    const isMobile = useSelector((storeState) => storeState.systemModule.isMobile)
    const [isGroupsCollapsed, setIsGroupsCollapsed] = useState(false)

    const handleDragEnd = (result) => {
        setIsGroupsCollapsed(false)
        if (!result.destination) return

        const boardToSave = { ...board }
        const newOrderedGroups = board.groups
        const [removed] = newOrderedGroups.splice(result.source.index, 1)
        newOrderedGroups.splice(result.destination.index, 0, removed)
        saveNewOrder(boardToSave)
    }

    async function saveNewOrder(boardToSave) {
        try {
            await updateBoardOrder(boardToSave)
        } catch (err) {
            console.log('Cannot save board:', err)
        }
    }

    function onBeforeDragStart() {
        setIsGroupsCollapsed(true)
    }

    function getScrollTopClass(idx) {
        const groupEl = document.querySelector(`.group-${idx}`)
        if (groupEl) {
            const groupScrollTop = groupEl.getBoundingClientRect().y - 48

            if (!scrollTop) return
            let topGap

            if (isMobile) {
                topGap = 59.41
            } else {
                topGap = isHeaderCollapsed ? 124 : 172
            }

            if (topGap > groupScrollTop) {
                return 'bottom-shadow'
            }
        }
    }

    if (!board.groups.length) return (
        <section className="empty-search-container grid place-center">
            <div className="empty-search">
                <img src={emptySearch} alt="" />
                <h4>No results found</h4>
                <p>
                    Try using a different search term, configuring the search options or
                    <br></br>
                    use ”Search Everything” to search across the entire account
                </p>
            </div>

        </section>
    )

    return (
        <>
            <DragDropContext onBeforeDragStart={onBeforeDragStart} onDragEnd={handleDragEnd}>
                <Droppable droppableId={board._id}>
                    {(provided) => (
                        <ul className="clean-list group-list"  {...provided.droppableProps} ref={provided.innerRef}>
                            {
                                board.groups.map((group, idx) => (
                                    <div className={`${getScrollTopClass(idx)} group-container group-${idx}`} key={group.id}>
                                        <Draggable draggableId={group.id} index={idx} >
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <BoardGroup
                                                        key={group.id}
                                                        group={group}
                                                        titlesOrder={board.titlesOrder}
                                                        isEditingTitle={isFocusLastGroup && idx === board.groups.length - 1}
                                                        onTitleEditLeave={onSetIsFocusLastGroup}
                                                        isGroupsCollapsed={isGroupsCollapsed}
                                                        toggleIsGroupsCollapsed={() => setIsGroupsCollapsed(prevCollapsed => !prevCollapsed)}
                                                        isHeaderCollapsed={isHeaderCollapsed}
                                                        isMobile={isMobile}
                                                    />
                                                </div>
                                            )}
                                        </Draggable>
                                    </div>
                                ))
                            }
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>

            <button className="btn add-group-btn sticky-left-40" onClick={onAddGrop}>
                <BigPlusIcon />
                <p>Add new group</p>
            </button>
        </>
    )
}

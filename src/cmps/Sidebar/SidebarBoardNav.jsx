import { useSelector } from "react-redux"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

import { boardService } from "../../services/board.service"
import { utilService } from "../../services/util.service"

import { showErrorMsg } from "../../store/actions/system.actions"
import { saveNewBoards } from "../../store/actions/board.actions"

import { SidebarBoardLink } from "./SidebarBoardLink"
import emptySearch from "/img/search-empty.svg"

export function SidebarBoardNav({ boards, currActiveBoard, removeBoard, updateBoard, filterBy }) {
    const fullBoards = useSelector((storeState) => storeState.boardModule.boards)

    const handleDragEnd = (result) => {
        if (!result.destination) return

        const newOrderedBoards = Array.from(boards)
        const [removed] = newOrderedBoards.splice(result.source.index, 1)
        newOrderedBoards.splice(result.destination.index, 0, removed)

        saveNewOrder(newOrderedBoards)
    }

    async function saveNewOrder(boards) {
        try {
            // if no filter is applied, skip ordering filtered boards vs fullBoards
            let orderedNewBoard = boards
            const emptyFilter = boardService.getDefaultBoardsFilter()
            if (!(utilService.areObjsIdentical(filterBy, emptyFilter))) {
                orderedNewBoard = sortFullBoards(fullBoards, boards)
            }
            await saveNewBoards(orderedNewBoard)
        } catch (err) {
            console.error('Error loading Boards:', err)
            showErrorMsg('Cannot save new Boards order')
        }
    }

    function sortFullBoards(fullBoards, filteredBoards) {
        // Create a new copy of fullBoards to avoid mutating the original
        const fullBoardsCopy = [...fullBoards]

        // Create a map for quick access to board order in filteredBoards
        const boardsOrder = new Map()
        filteredBoards.forEach((board, idx) => {
            boardsOrder.set(board._id, { idx })
        })

        // Create a copy of fullBoards for reference to original order
        const originalBoardsOrder = fullBoardsCopy.map(board => board._id)

        // Sort boards in fullBoardsCopy based on filteredBoards order
        fullBoardsCopy.sort((a, b) => {
            const indexA = boardsOrder.has(a._id) ? boardsOrder.get(a._id).idx : originalBoardsOrder.indexOf(a._id)
            const indexB = boardsOrder.has(b._id) ? boardsOrder.get(b._id).idx : originalBoardsOrder.indexOf(b._id)
            return indexA - indexB
        })
        return fullBoardsCopy
    }

    if (!boards.length) return (
        <section className="empty-search-container grid place-center">
            <div className="empty-search">
                <img src={emptySearch} alt="" />
                <h4>No results found</h4>
                <p>
                    Please check your search terms or filters
                </p>
            </div>

        </section>
    )

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="boards">
                {(provided) => (
                    <nav className="sidebar-board-nav" {...provided.droppableProps} ref={provided.innerRef}>
                        {boards.map((board, index) => (
                            <Draggable key={board._id} draggableId={board._id} index={index}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <SidebarBoardLink
                                            board={board}
                                            boards={boards}
                                            currActiveBoard={currActiveBoard}
                                            removeBoard={removeBoard}
                                            updateBoard={updateBoard}
                                            filterBy={filterBy}
                                        />
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </nav>
                )}
            </Droppable>
        </DragDropContext>
    )
}

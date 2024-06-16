

import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { useSelector } from "react-redux"

import { DynamicSidePanelHeader } from "../DynamicSidePanelHeader"
import { DynamicSidePanelRouter } from "../DynamicSidePanelRouter"
import { loadBoardActivities } from "../../store/actions/board.actions"

export function ActivityLog() {
    const currBoard = useSelector((storeState) => storeState.boardModule.currBoard)
    const isSidePanelOpen = useSelector((storeState) => storeState.systemModule.isSidePanelOpen)

    const [activities, setActivities] = useState(null)

    const { boardId } = useParams()

    useEffect(() => {
        _loadBoardActivities(boardId)
    }, [boardId, currBoard])

    async function _loadBoardActivities(boardId) {
        try {
            const boardActivities = await loadBoardActivities({ boardId })
            setActivities(boardActivities)
        } catch (err) {
            console.error('Error loading board:', err)
        }
    }

    const { title } = currBoard

    const headerProps = {
        type: 'activitylog',
        title,
        subjects: ['Activity Log'],
    }

    if (!activities) return

    const bodyProps = {
        activities
    }

    return (
        <section className={`task-details ${isSidePanelOpen ? 'open' : ''}`}>
            <DynamicSidePanelHeader boardId={boardId} headerProps={{ ...headerProps }} />
            <DynamicSidePanelRouter type={'Activity Log'} bodyProps={bodyProps} />
        </section>
    )
}
import { useSelector } from "react-redux"
import { onTooltipParentEnter, onTooltipParentLeave } from "../../store/actions/system.actions"
import { FilledStarIcon, StarIcon } from "../../services/svg.service"
import { useRef } from "react"

export function Star({ isStarred, onStarClick }) {
    const { parentId, type, isOpen } = useSelector((storeState) => storeState.systemModule.dynamicModal)
    const isMobile = useSelector((storeState) => storeState.systemModule.isMobile)
    const favoriteRef = useRef(null)

    const favoriteTooltip = isStarred ? 'Remove from favorites' : 'Add to favorites'

    return (
        <button
            className={`btn ${isStarred && 'starred svg-inherit-color'} star`}
            ref={favoriteRef}
            onMouseEnter={() => onTooltipParentEnter(isMobile, isOpen, type, favoriteTooltip, 'favorite-title', favoriteRef)}
            onMouseLeave={() => onTooltipParentLeave(isMobile, parentId, 'favorite-title')}
            onClick={onStarClick}
        >
            {isStarred ? <FilledStarIcon /> : <StarIcon />}
        </button>
    )
}

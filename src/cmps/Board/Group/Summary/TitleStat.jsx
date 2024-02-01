import { useRef } from "react"
import { useSelector } from "react-redux"
import { onTooltipParentEnter, onTooltipParentLeave, resetDynamicModal, setDynamicModal } from "../../../../store/actions/system.actions"

export function TitleStat({ titleStat, idx }) {
    const titleRef = useRef(null)

    const isMobile = useSelector((storeState) => storeState.systemModule.isMobile)
    const { parentId, type, isOpen } = useSelector((storeState) => storeState.systemModule.dynamicModal)


    return (
        <div
            className="label-data title-stat"
            ref={titleRef}
            style={{ backgroundColor: titleStat.color, width: titleStat.percentageMap.percent }}
            onMouseEnter={() => onTooltipParentEnter(isMobile, isOpen, type, `${titleStat.title ? titleStat.title : ''} ${titleStat.percentageMap.fraction} ${titleStat.percentageMap.percent}`, idx, titleRef)}
            onMouseLeave={() => onTooltipParentLeave(isMobile, parentId, idx)}
        ></div>
    )
}

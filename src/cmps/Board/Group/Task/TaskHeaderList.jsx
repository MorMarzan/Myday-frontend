import { useSelector } from "react-redux"
import { GroupTitlesList } from "../GroupTitlesList"

export function TaskHeaderList({ groupColor, titlesOrder }) {
    const isMobile = useSelector((storeState) => storeState.systemModule.isMobile)

    return (
        <div className="task-header-list-container subgrid full-grid-column">

            <ul className="clean-list task-header-list sticky-left subgrid full-grid-column">
                <div className="task-title-sticky flex sticky-left">
                    <div className="task-row-placeholder"></div>
                    <div style={{ backgroundColor: groupColor }} className={`${isMobile ? 'sticky-left' : 'sticky-left-36'} color-display`}></div>

                    <div className="task-title-container">
                        <li className="task-selection">
                            <div className="checkbox"></div>
                        </li>

                        <li className="task-title">Task</li>
                    </div>
                </div>

                <div className="subgrid grid-column-table-content">
                    <GroupTitlesList titles={titlesOrder} />
                    <li className="line-end"></li>
                </div>
            </ul>
        </div>
    )
}

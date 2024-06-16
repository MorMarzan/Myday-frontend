import { useState } from "react"
import { useSelector } from "react-redux"

import { userService } from "../services/user.service"
import { utilService } from "../services/util.service"
import { AngleDownIcon } from "../services/svg.service"

import workspaceHeaderConfetti from "/img/workspaceHeaderConfetti.svg"
import { WorkspaceBoardsList } from "../cmps/Workspace/WorkspaceBoardsList"
// import { WorkspaceAside } from "../cmps/Workspace/WorkspaceAside"

export function Workspace() {
    const boards = useSelector((storeState) => storeState.boardModule.boards)
    const [isBoardListShown, setIsBoardListShown] = useState(true)
    const loggedInUser = userService.getLoggedinUser()

    return (
        <section className="workspace-page">
            <div className="welcome-header">
                <div className="titles-container">
                    <div className="first-title">{utilService.getBlessingByTime()}, {loggedInUser ? loggedInUser.fullname : 'Guest'}!</div>
                    <div className="second-title">Quickly access your recent boards, Inbox and workspaces</div>
                </div>
                <img src={workspaceHeaderConfetti} alt="confetti" />
            </div>

            <div className="content-container">
                <div className={`boards-container ${isBoardListShown ? 'open' : ''}`}>
                    <div className="collapsible-header-wrapper flex align-center">
                        <button
                            title="Collapse Header"
                            className={`arrow-container flex svg-inherit-color  ${isBoardListShown ? '' : 'rotated'}`}
                            onClick={() => setIsBoardListShown((prevToggleList => !prevToggleList))}
                        >
                            <AngleDownIcon />
                        </button>
                        <p>Recently visited</p>
                    </div>

                    <section className="collapsible-content">
                        {isBoardListShown && <WorkspaceBoardsList boards={boards} />}
                    </section>
                </div>

                {/* <WorkspaceAside /> */}
            </div>
        </section >
    )
}
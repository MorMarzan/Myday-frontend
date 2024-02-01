import { useState } from 'react'
import { WorkspaceAside } from '../cmps/Workspace/WorkspaceAside'
import { AngleDownIcon } from '../services/svg.service'
import { userService } from '../services/user.service'
import { utilService } from '../services/util.service'
import { WorkspaceBoardsList } from '../cmps/Workspace/WorkspaceBoardsList'
import workspaceHeaderConfetti from '/img/workspaceHeaderConfetti.svg'
import { useSelector } from 'react-redux'
export function Workspace() {
    const [isBoardListShown, setIsBoardListShown] = useState(true)
    const boards = useSelector((storeState) => storeState.boardModule.boards)
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
import { WorkspaceBoardPreview } from "./WorkspaceBoardPreview"

export function WorkspaceBoardsList({ boards }) {
    return (
        <>
            <ul className="workspace-boards-list grid clean-list">
                {boards &&
                    boards.map(board => {
                        return (
                            <li key={board._id}>
                                <WorkspaceBoardPreview board={board} />
                            </li>
                        )
                    })}
            </ul>
        </>
    )
}

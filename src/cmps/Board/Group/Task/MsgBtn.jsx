import { AddMsgIcon, MsgIcon } from "../../../../services/svg.service"

export function MsgBtn({ msgsLength }) {
    return (
        <button className="flex align-center msg-btn">
            {msgsLength ?
                <div className="flex msg-icon-btn">
                    <MsgIcon />
                    <div className="flex align-center justify-center msg-counter"><p>{msgsLength}</p></div>
                </div>
                :
                <AddMsgIcon />}
        </button>
    )
}

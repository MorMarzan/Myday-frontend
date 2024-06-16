import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router'

import loader from "/img/board-loader.gif"
import { boardService } from '../../services/board.service'
import { SOCKET_EMIT_SEND_MSG, SOCKET_EMIT_SET_TOPIC, SOCKET_EVENT_ADD_MSG, socketService } from '../../services/socket.service'
import { MsgList } from './MsgList'
import { addMgs } from '../../store/actions/board.actions'

export function PanelUpdate({ msgs, onAddUpdate }) {
    const { taskId } = useParams()

    const [updateTxt, setUpdateText] = useState('')

    const inputRef = useRef(null)

    useEffect(() => {
        socketService.on(SOCKET_EVENT_ADD_MSG, addMsg) //listen to other people msgs
        return () => {
            socketService.off(SOCKET_EVENT_ADD_MSG, addMsg)
        }
    }, [])

    useEffect(() => {
        socketService.emit(SOCKET_EMIT_SET_TOPIC, taskId) //send topic change onmount and on topic change
    }, [taskId])

    function addMsg(newMsg) {
        console.log(newMsg)
        addMgs(taskId, newMsg)
    }

    function handleSubmit(ev) {
        ev.preventDefault()
        const newUpdate = boardService.getNewUpdate(updateTxt)
        socketService.emit(SOCKET_EMIT_SEND_MSG, newUpdate)
        onAddUpdate(newUpdate)

        setUpdateText('')
        if (inputRef.current) {
            inputRef.current.value = ''
        }
    }

    const dynClass = inputRef.current?.value ? 'contains-txt' : ''

    if (!msgs) {
        return (
            <section className="loader-container panel-update flex align-center justify-center">
                <img className="myday-loader" src={loader} alt="" />
            </section>
        )
    }

    return (
        <section className="panel-update grid">
            <div className={`input-container ${dynClass}`}>
                <form onSubmit={handleSubmit} className="grid">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Write an update..."
                        onChange={(ev) => setUpdateText(ev.target.value)}
                    />

                    {inputRef.current?.value &&
                        <button type="submit" className="btn clrblue">
                            Update
                        </button>
                    }
                </form>
            </div>

            {msgs.length ?
                // <MsgList msgs={msgs} onLikeComment={onLikeComment} />
                <MsgList msgs={msgs} />
                : (
                    <div className="post-not-found grid place-center">
                        <img src="/img/no-updates.svg" alt="" />
                        <div className="post-not-found-txt">
                            <h2>No Updates yet for this item</h2>
                            <p className="post-not-found-subtitle">Be the first one to update about progress, mention someone
                                <br />
                                or upload files to share with your team members</p>
                        </div>
                    </div>
                )}
        </section>
    )
}

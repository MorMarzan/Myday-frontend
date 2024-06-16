import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"

import { setMsg } from "../store/actions/system.actions.js"
import { CheckIcon, CloseIcon } from "../services/svg.service.jsx"

export function UserMsg() {
  const msg = useSelector((storeState) => storeState.systemModule.msg)
  const [isShown, setIsShown] = useState(false)
  const timeoutIdRef = useRef()

  useEffect(() => {
    if (!msg) return
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current)
      timeoutIdRef.current = null
    }

    setIsShown(true)

    timeoutIdRef.current = setTimeout(() => {
      closeMsg()
      setIsShown(false)
    }, 3000)

    return () => {
      clearTimeout(timeoutIdRef.current)
    }
  }, [msg])

  function closeMsg() {
    setIsShown(false)
    setTimeout(() => {
      setMsg(null)
    }, 600)
  }

  if (!msg) return <span></span>
  return (
    <section className={`user-msg flex justify-center align-center ${msg.type} ${isShown ? 'shown' : ''}`}>
      {msg.type === 'success' &&
        <div className="svg-white-fill flex justify-center align-center"><CheckIcon /></div>
      }
      <p>{msg.txt}</p>
      {/* {msg.type === 'success' &&
        <button className="btn-undo flex align-center justify-center">Undo</button>
      } */}
      <button className="flex align-center justify-center" onClick={closeMsg}><CloseIcon /></button>
    </section>
  )
}
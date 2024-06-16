import { useSelector } from "react-redux"
import { useEffect, useRef, useState } from "react"

import { resetDynamicModal } from "../store/actions/system.actions"
import { DynamicModalRouter } from "./DynamicModalRouter"

export function DynamicModal() {
    const modalData = useSelector((storeState) => storeState.systemModule.dynamicModal)
    const [ModalPos, setModalPos] = useState({ left: -500, top: 500 })
    const [caretPos, setCaretPos] = useState('auto') // Default direction
    const [caretDirection, setCaretDirection] = useState('top') // Default direction

    const modalRef = useRef()

    const parentBoundingRect = modalData.parentRefCurrent?.getBoundingClientRect()

    useEffect(() => {
        setModalPos({ left: -500, top: 500 })
        if (!modalRef.current) return

        const modalWidth = modalRef.current.offsetWidth
        const modalHeight = modalRef.current.offsetHeight
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight

        let newLeft = 0
        let newTop = 0

        if (modalData.isPosBlock) {
            // Position below the parent element
            newTop = parentBoundingRect.bottom

            if (modalData.hasCaret) {
                setCaretDirection('top')
                setCaretPos('auto')
            }

            if (modalData.isCenter) {
                // Center horizontally relative to the parent element
                newLeft = parentBoundingRect.left + (parentBoundingRect.width - modalWidth) / 2
            } else {
                newLeft = parentBoundingRect.left
            }

            // Check if modal goes out of the bottom boundary of the viewport and adjust
            if (newTop + modalHeight > viewportHeight) {
                newTop = parentBoundingRect.top - modalHeight

                if (modalData.hasCaret) {
                    setCaretDirection('bottom')
                }
            }

            // Check and adjust for left/right viewport boundaries
            if (newLeft + modalWidth > viewportWidth) {
                newLeft = viewportWidth - modalWidth

                if (parentBoundingRect.right > viewportWidth) { //if parent is not fully shown
                    const newCartpos = getParentVisibleWidth() > 30 ? getParentVisibleWidth() / 2 : 7
                    setCaretPos(newCartpos)
                } else {
                    setCaretPos(parentBoundingRect.width / 2 + 5)
                }

            }
            newLeft = Math.max(0, newLeft)
        } else {
            // Position to the right of the parent element
            newLeft = parentBoundingRect.right
            newTop = parentBoundingRect.top

            // Check and adjust for right viewport boundary
            if (newLeft + modalWidth > viewportWidth) {
                newLeft = parentBoundingRect.left - modalWidth
            }

            // Check and adjust for top/bottom viewport boundaries
            if (newTop + modalHeight > viewportHeight) {
                newTop = viewportHeight - modalHeight
            }
            newTop = Math.max(0, newTop)
        }


        setModalPos({
            left: newLeft,
            top: newTop
        })

    }, [modalData])

    useEffect(() => {
        function handleClickOutside(event) {
            if (modalRef.current && !modalRef.current.contains(event.target)
                && modalData.parentRefCurrent && !modalData.parentRefCurrent.contains(event.target)
            ) {
                resetDynamicModal()
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [modalRef, modalData])

    function getParentVisibleWidth() {
        const viewportWidth = window.innerWidth

        // Check if the element is within the viewport horizontally
        const isWithinViewport = parentBoundingRect.left < viewportWidth && parentBoundingRect.right > 0

        if (!isWithinViewport) {
            // No part of the element is visible
            return 0
        }

        const leftEdge = parentBoundingRect.left < 0 ? 0 : parentBoundingRect.left // Adjust for left overflow
        const rightEdge = parentBoundingRect.right > viewportWidth ? viewportWidth : parentBoundingRect.right // Adjust for right overflow

        return rightEdge - leftEdge // Visible width
    }

    if (!modalData.isOpen) return

    const style = {
        left: `${ModalPos.left}px`,
        top: `${ModalPos.top}px`
    }

    return (
        <div style={style} ref={modalRef} className='dynamic-absolute-modal flex column animate__fadeIn animate__animated animate__faster'>
            {modalData.hasCaret && (
                <div
                    style={{ marginInlineEnd: caretPos }}
                    className={`caret caret-${caretDirection} ${modalData.caretClred && 'colored'}`}
                >
                </div>
            )}
            <DynamicModalRouter type={modalData.type} data={modalData.data} />
        </div>
    )
}
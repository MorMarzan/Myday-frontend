import { useEffect, useRef } from "react"

export function EditableTxt({
    isEditing, txtValue, onTxtClick,
    inputValue, inputName = '', placeholder = '',
    onInputChange, onEditClose, extraBtnsStart,
    extraBtnsEnd, style = {}, isBtnsInTxt
}) {
    const editableTxtRef = useRef(null)

    useEffect(() => {
        if (isEditing) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isEditing, onEditClose])

    function handleClickOutside(ev) {
        if (editableTxtRef.current && !editableTxtRef.current.contains(ev.target)) {
            onEditClose && onEditClose()
        }
    }

    return (
        <div className="editable-txt-container">
            {isEditing ? (
                <div
                    ref={editableTxtRef}
                    tabIndex={0}
                    onBlur={onEditClose}
                    className="focused-input flex align-center"
                >

                    {(extraBtnsStart && extraBtnsStart.length) && extraBtnsStart.map((btn, idx) => {
                        return <div
                            key={idx}
                            className={btn.className}
                            style={btn.style || {}}
                            onMouseDown={btn.onMouseDown}
                        >
                        </div>
                    })}

                    <form onSubmit={ev => (ev.preventDefault(), onEditClose())}>
                        <input
                            name={inputName}
                            className="reset"
                            type="text"
                            autoFocus
                            style={style}
                            value={inputValue}
                            onChange={onInputChange}
                            placeholder={placeholder}
                        />
                    </form>


                    {(extraBtnsEnd && !!extraBtnsEnd.length) && extraBtnsEnd.map((btn, idx) => {
                        return <div
                            key={idx}
                            className={btn.className}
                            style={btn.style || {}}
                            onMouseDown={btn.onMouseDown}
                        >
                            {btn.txt && <p>{btn.txt}</p>}
                        </div>
                    })}

                </div>
            ) : (
                <div
                    className="editable-txt"
                    onClick={onTxtClick}
                    style={style}>

                    {(isBtnsInTxt && extraBtnsStart && extraBtnsStart.length) && extraBtnsStart.map((btn, idx) => {
                        return <div
                            key={idx}
                            className={btn.className}
                            style={btn.style || {}}
                            onMouseDown={btn.onMouseDown}
                        >
                        </div>
                    })}

                    <span>{txtValue}</span>
                </div>
            )}
        </div>
    )
}
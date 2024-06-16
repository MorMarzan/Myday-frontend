import { useRef, useState } from "react"
import { CloseIcon, SearchIcon } from "../services/svg.service"

export function DynamicInput({ inputProps }) {
    const [isFocused, setIsFocused] = useState(false)
    const inputRef = useRef(null)

    function onInputBlur() {
        setIsFocused(false)
        if (onBlur) onBlur()
    }

    const {
        name,
        inputValue,
        placeholder,
        type,
        isSearchInput,
        additionalBtns,
        handleChange,
        onBlur,
        isAutoFocus = false,
        isResetBtn = false,
        isRequired
    } = inputProps

    return (
        <div
            className={`dynamic-input ${type}-input flex align-center ${isFocused ? 'focused' : ''}`}
            onClick={() => inputRef.current.focus()}
        >
            {isSearchInput &&
                <div className="search-icon grid place-center">
                    <SearchIcon />
                </div>
            }

            <input
                name={name}
                ref={inputRef}
                value={inputValue}
                type={type}
                placeholder={placeholder}
                onFocus={() => setIsFocused(true)}
                onBlur={onInputBlur}
                onChange={handleChange}
                required={isRequired}
                autoComplete="off"
                autoFocus={isAutoFocus}

            />

            {isResetBtn &&
                <div className={(!inputValue ? 'hide ' : '') + 'btn reset'} onClick={() => handleChange({ target: { name, value: '' } })}>
                    <CloseIcon />
                </div>
            }

            {additionalBtns && additionalBtns.length &&
                additionalBtns.map((additionalBtn, index) => (
                    <div
                        key={index}
                        className={`btn input-${additionalBtn.name}-icon`}
                        onClick={() => additionalBtn.func()}
                    >
                        {additionalBtn.icon}
                    </div>
                ))}
        </div>
    )
}

// props example:

// const inputProps = {

//     name: 'title',
//     inputValue: filterByToEdit.title,
//     placeholder: 'Search',
//     type: 'search',
//     isFocused: isFocus,
//     onSetIsFocused: onToggleIsFocus,
//     handleChange: handleChange,
//     isSearchInput: true,
//     additionalBtns: [
//         {
//             name: 'filter',
//             icon: < SearchIcon />,
//             func: console.log('hi'),
//         }
//     ]
// }
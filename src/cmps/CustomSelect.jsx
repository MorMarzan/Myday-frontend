import { useRef, useState } from "react"
import { AngleDownIcon } from "../services/svg.service"
import { useOutsideClick } from "../customHooks/useOutsideClick"

export function CustomSelect({ options, onSelect, name, selectedOptValue, openUp }) {
    const intialSelection = options.find(option => option.value === selectedOptValue) || options[0]
    const [selectedOption, setSelectedOption] = useState(intialSelection)
    const [isOpen, setIsOpen] = useState(false)
    const selectRef = useRef()

    function handleSelect(option) {
        setSelectedOption(option)
        setIsOpen(false)
        onSelect({ target: { name, value: option.value } })
    }

    useOutsideClick(selectRef, () => setIsOpen(false))

    return (
        <div className="custom-select" ref={selectRef}>
            <div className="select-display" onClick={() => setIsOpen(!isOpen)}>
                <div className="img-wrap" style={{ backgroundColor: selectedOption.imgClr }}>
                    {selectedOption.img && <img src={selectedOption.img} alt={selectedOption.title} />}
                    {selectedOption.svgCmp}
                </div>
                <span>{selectedOption.title}</span>
                <span className={`btn arrow ${isOpen ? 'up' : ''}`}><AngleDownIcon /></span>
            </div>

            {isOpen && (
                <div className={(openUp ? 'open-up' : '') + ' options-dropdown'}>
                    {options.map(option => (
                        <div key={option.value} className={(option.value === selectedOption.value ? 'selected' : '') + " option"} onClick={() => handleSelect(option)}>
                            <div className="img-wrap" style={{ backgroundColor: option.imgClr }}>
                                {option.img && <img src={option.img} alt={option.title} />}
                                {option.svgCmp}
                            </div>
                            <span>{option.title}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

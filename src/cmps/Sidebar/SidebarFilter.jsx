import { useRef, useState } from "react"
import { useSelector } from "react-redux"

import { utilService } from "../../services/util.service"

import { DynamicInput } from "../DynamicInput"
import { useEffectUpdate } from "../../customHooks/useEffectUpdate"
import { PlusIcon, FilterIcon } from "../../services/svg.service"
import { onTooltipParentEnter, onTooltipParentLeave, resetDynamicModal, setDynamicModal } from "../../store/actions/system.actions"

export function SidebarFilter({ filterBy, onSetFilter, onAddNewBoard }) {
    onSetFilter = useRef(utilService.debounce(onSetFilter))
    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })

    const isMobile = useSelector((storeState) => storeState.systemModule.isMobile)
    const { parentId, type, isOpen } = useSelector((storeState) => storeState.systemModule.dynamicModal)
    const isModalOpen = parentId === `add-board-tooltip`
    const titleRef = useRef(null)

    useEffectUpdate(() => {
        onSetFilter.current(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        let { value, name: field, type } = target
        value = type === 'number' ? +value : value
        setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }))
    }

    const inputProps = {
        name: 'title',
        inputValue: filterByToEdit.title,
        placeholder: 'Search',
        type: 'search',
        handleChange: handleChange,
        isSearchInput: true,
        isResetBtn: true,
    }

    return (
        <>
            <div className="sidebar-filter grid column place-center">
                <DynamicInput inputProps={inputProps} />
            </div>
            <button
                className="btn clrblue"
                onClick={onAddNewBoard}
                ref={titleRef}
                onMouseEnter={() => onTooltipParentEnter(isMobile, isOpen, type, 'Add Item to workspace', 'add-board', titleRef)}
                onMouseLeave={() => onTooltipParentLeave(isMobile, parentId, 'add-board')}
            >
                <PlusIcon />
            </button>
        </>
    )
}
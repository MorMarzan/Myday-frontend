import { useEffect, useRef, useState } from "react"

import { addTask } from "../../store/actions/board.actions"
import { resetDynamicModal, setDynamicModal, setDynamicModalData, showErrorMsg } from "../../store/actions/system.actions"

import { CloseFilledIcon, FilterIcon, HideIcon, PersonIcon, SearchIcon, SettingsKnobsIcon, SortIcon } from "../../services/svg.service"

export function BoardFilter({ board, filterBy, onSetFilter }) {
    const filterSearchRef = useRef(null)
    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)
    const [isMemberFilterOpen, setIsMemberFilterOpen] = useState(false)
    const [isFocused, setIsFocused] = useState(false)

    useEffect(() => {
        function handleClickOutsideSearch(event) {
            if (filterSearchRef.current
                && !filterSearchRef.current.contains(event.target)
                //missing logic: && !input.value
            ) {
                setIsFocused(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutsideSearch)

        return () => {
            document.removeEventListener('mousedown', handleClickOutsideSearch)
        }
    }, [])

    useEffect(() => {
        onSetFilter(filterByToEdit)
    }, [filterByToEdit])

    function onToggleIsFocused() {
        setIsFocused(!isFocused)
    }

    async function onAddTask() {
        try {
            const taskTitle = 'New Item'
            await addTask(board._id, board.groups[0].id, taskTitle, true)
        } catch (err) {
            console.error('Error adding new task:', err)
            showErrorMsg('Cannot update Board')
        }
    }

    function toggleMemberFilter(ev) {
        ev.stopPropagation()
        if (isMemberFilterOpen) {
            //updating modal in store
            resetDynamicModal()
            setIsMemberFilterOpen(false)
        } else {
            //updating modal in store
            setDynamicModal({
                isOpen: true,
                boundingRect: ev.target.getBoundingClientRect(),
                type: 'boardMemberSelect',
                data: { chosenMember: filterByToEdit.member, onChangeMember: setMemberFilter, members: board.members },
                isPosBlock: true
            })
            setIsMemberFilterOpen(true)
        }
    }

    function setMemberFilter(memberId) {
        console.log('memberId', memberId)
        setFilterByToEdit(prevFilter => ({ ...prevFilter, member: memberId }))

        setDynamicModalData({ chosenMember: memberId, onChangeMember: setMemberFilter, members: board.members })
    }

    function onResetMemberFilter(ev) {
        ev.stopPropagation()
        setMemberFilter(null)
        resetDynamicModal()
        resetDynamicModal()
        setIsMemberFilterOpen(false)
    }

    function handleChange({ target }) {
        const field = target.name
        let value = target.value
        console.log('field', field)

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value
                break
            case 'checkbox':
                value = target.checked
                break
            default:
                break
        }
        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }


    const dynFocusedClass = isFocused ? 'focused' : ''
    const { txt } = filterByToEdit


    return (
        <div className="board-filter">

            <button title="New task" className="btn new-task" onClick={onAddTask}>
                <span>New Task</span>
            </button>

            <div className={"btn search " + dynFocusedClass} onClick={onToggleIsFocused} ref={filterSearchRef}>
                <SearchIcon />

                <input
                    className="reset"
                    type="search"
                    placeholder="Search"
                    value={txt}
                    onChange={handleChange}
                    name="txt"
                    autoComplete="off"
                />

                {isFocused &&
                    <SettingsKnobsIcon />
                }
            </div>

            <button className={` btn ${filterByToEdit.member || isMemberFilterOpen ? 'active' : ''} person`} title="Filter by person" onClick={toggleMemberFilter}>
                {filterByToEdit.member ? filterByToEdit.member : <PersonIcon />}
                <span>Person</span>
                {filterByToEdit.member && <div className="close-btn svg-inherit-color"
                    style={{ fill: '#323338' }}
                    onClick={onResetMemberFilter}
                >
                    <CloseFilledIcon />
                </div>}
            </button>

            <button className="btn filter" title="Filter by anything">
                <FilterIcon />
                <span>Filter</span>
            </button>

            <button className="btn sort" title="Sort by column">
                <SortIcon />
                <span>Sort</span>
            </button>

            <button className="btn hide" title="Hidden columns">
                <HideIcon />
                <span>Hide</span>
            </button>

        </div>
    )
}

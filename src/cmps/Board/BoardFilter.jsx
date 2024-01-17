import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"

import { addTask, getMemberFromBoard } from "../../store/actions/board.actions"
import { resetDynamicModal, setDynamicModal, setDynamicModalData, showErrorMsg } from "../../store/actions/system.actions"

import { CloseFilledIcon, FilterIcon, HideIcon, PersonIcon, PlusIcon, SearchIcon, SettingsKnobsIcon, SortIcon } from "../../services/svg.service"
import { UserImg } from "../UserImg"
import { DynamicInput } from "../DynamicInput"

export function BoardFilter({ board, filterBy, onSetFilter }) {
    const filterSearchRef = useRef(null)
    const personBtnRef = useRef(null)
    const filterBtnRef = useRef(null)
    const sortBtnRef = useRef(null)
    const hideBtnRef = useRef(null)

    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)
    const [isFocused, setIsFocused] = useState(false)

    const isMobile = useSelector((storeState) => storeState.systemModule.isMobile)
    const { parentId, type, isOpen } = useSelector((storeState) => storeState.systemModule.dynamicModal)
    const isMemberPickerOpen = parentId === `${board._id}-memberFilterPicker`

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutsideSearch)

        return () => {
            document.removeEventListener('mousedown', handleClickOutsideSearch)
        }
    }, [filterByToEdit.txt])

    useEffect(() => {
        onSetFilter(filterByToEdit)

    }, [filterByToEdit])

    function handleClickOutsideSearch(event) {
        if (filterSearchRef.current
            && !filterSearchRef.current.contains(event.target)) {
            if (filterByToEdit.txt === '') {
                setIsFocused(false)
            }
        }
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
        if (isMemberPickerOpen) { //check if curr modal picker is open
            resetDynamicModal()
        } else {
            setDynamicModal({
                isOpen: true,
                parentRefCurrent: personBtnRef.current,
                parentId: `${board._id}-memberFilterPicker`,
                type: 'boardMemberSelect',
                data: { chosenMember: filterByToEdit.member, onChangeMember: setMemberFilter, members: board.members },
                isPosBlock: true,
                isCenter: true
            })
        }
    }

    function setMemberFilter(memberId) {
        setFilterByToEdit(prevFilter => ({ ...prevFilter, member: memberId }))

        setDynamicModalData({
            chosenMember: memberId,
            onChangeMember: setMemberFilter,
            members: board.members,
        })
    }

    function onResetMemberFilter(ev) {
        ev.stopPropagation()
        setMemberFilter(null)
        resetDynamicModal()
    }

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

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

    function onCancelSearch() {
        setIsFocused(false)
        setFilterByToEdit(prevFilter => ({ ...prevFilter, 'txt': '' }))
    }

    function onStatEnter(txt, name, ref) {
        if (isOpen && type !== 'tooltip') return

        setDynamicModal(
            {
                isOpen: true,
                parentRefCurrent: ref.current,
                type: 'tooltip',
                data: { txt },
                parentId: `${name}-tooltip`,
                hasCaret: true,
                isCenter: true,
                isPosBlock: true,
                caretClred: true
            })
    }

    function onStatLeave(name) {
        if (parentId === `${name}-tooltip`) resetDynamicModal()
    }

    const dynActiveClass = filterByToEdit.txt ? 'active' : ''
    const { txt } = filterByToEdit

    const inputProps = {
        name: 'txt',
        inputValue: txt,
        placeholder: 'Search',
        type: 'search',
        handleChange: handleChange,
        isSearchInput: true,
        isAutoFocus: true,
        isResetBtn: true,
        additionalBtns: [
            {
                name: 'filter',
                icon: <SettingsKnobsIcon />,
                func: () => { },
            }
        ]
    }

    return (
        <div className={`${isFocused && 'search-focused'} board-filter`}>

            <button title="New task" className="btn new-task" onClick={onAddTask}>
                <PlusIcon />
                <span>New Task</span>
            </button>

            <div className={dynActiveClass + ' search'} ref={filterSearchRef}>
                {!isFocused ?
                    <div className="btn" onClick={() => setIsFocused(true)}>
                        <SearchIcon />
                        <span>Search</span>
                    </div>
                    :
                    <div className="flex search-input-container">
                        <DynamicInput inputProps={inputProps} />

                        {(isMobile && isFocused) && <button className="btn close-btn" onClick={onCancelSearch}>Cancel</button>}
                    </div>}
            </div>


            <button
                className={` btn ${filterByToEdit.member || isMemberPickerOpen ? 'active' : ''} person`}
                // title="Filter by person"
                onClick={toggleMemberFilter}
                ref={personBtnRef}
                onMouseEnter={() => onStatEnter('Filter by person', 'person-filter-title', personBtnRef)}
                onMouseLeave={() => onStatLeave('person-filter-title')}
            >
                {filterByToEdit.member ? <UserImg user={getMemberFromBoard(board, filterByToEdit.member)} /> : <PersonIcon />}
                <span>Person</span>
                {filterByToEdit.member && <div className="close-btn svg-inherit-color"
                    style={{ fill: '#323338' }}
                    onClick={onResetMemberFilter}
                >
                    <CloseFilledIcon />
                </div>}
            </button>

            <button
                className="btn filter"
                // title="Filter by anything"
                ref={filterBtnRef}
                onMouseEnter={() => onStatEnter('Filter by anything', 'general-filter-title', filterBtnRef)}
                onMouseLeave={() => onStatLeave('general-filter-title')}
            >
                <FilterIcon />
                <span>Filter</span>
            </button>

            <button
                className="btn sort"
                title="Sort by column"
                ref={sortBtnRef}
                onMouseEnter={() => onStatEnter('Sort by column', 'sort-title', sortBtnRef)}
                onMouseLeave={() => onStatLeave('sort-title')}
            >
                <SortIcon />
                <span>Sort</span>
            </button>

            <button
                className="btn hide"
                title="Hidden columns"
                ref={hideBtnRef}
                onMouseEnter={() => onStatEnter('Hidden columns', 'hide-btn-title', hideBtnRef)}
                onMouseLeave={() => onStatLeave('hide-btn-title')}
            >
                <HideIcon />
                <span>Hide</span>
            </button>

        </div>
    )
}

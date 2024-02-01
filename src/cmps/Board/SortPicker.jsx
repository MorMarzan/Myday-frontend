import { useState } from "react"
import { useSelector } from "react-redux"
import { setSortBy } from "../../store/actions/board.actions"
import { useEffectUpdate } from "../../customHooks/useEffectUpdate"
import { CustomSelect } from "../CustomSelect"
import { SortDownIcon, SortUpIcon } from "../../services/svg.service"
import { boardService } from "../../services/board.service"

export function SortPicker({ isIntialSortEmpty }) {
    const isMobile = useSelector((storeState) => storeState.systemModule.isMobile)
    const sortBy = useSelector((storeState) => storeState.boardModule.sortBy)
    const [sortByToEdit, setSortByToEdit] = useState(sortBy)
    const [isSortOn, setIsSortOn] = useState(!isIntialSortEmpty)

    useEffectUpdate(() => {
        onSetSort(sortByToEdit)
    }, [sortByToEdit])

    function onSetSort(sortByToEdit) {
        setSortBy(sortByToEdit)
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
        setSortByToEdit(prevSort => ({ ...prevSort, [field]: value }))
    }

    function resetSort() {
        setSortByToEdit(boardService.getDefaultSort())
        setIsSortOn(false)
    }

    function startSort() {
        setSortByToEdit({ type: 'title', dir: 1 })
        setIsSortOn(true)
    }

    function toggleIsSortOn() {
        if (isSortOn) resetSort()
        else startSort()
    }

    const typeOptions = [
        { value: 'title', title: 'Name', img: "/img/col-types/name-column-icon.svg", imgClr: '#ffcc00' },
        { value: 'members', title: 'Person', img: "/img/col-types/multiple-person-column-icon.svg", imgClr: '#00cff4' },
        { value: 'status', title: 'Status', img: "/img/col-types/color-column-icon.svg", imgClr: '#11dd80' },
        { value: 'priotity', title: 'Priority', img: "/img/col-types/color-column-icon.svg", imgClr: '#11dd80' },
        { value: 'date', title: 'Date', img: "/img/col-types/date-column-icon.svg", imgClr: '#11dd80' },
    ]

    const dirOptions = [
        { value: 1, title: 'Ascending', svgCmp: <SortDownIcon /> },
        { value: -1, title: 'Descending', svgCmp: <SortUpIcon /> },
    ]

    const { type, dir } = sortByToEdit

    return (
        <section className="sort-picker general-modal">

            <h4 className="title">Sort by</h4>

            {
                isSortOn ?
                    <div className="selects">
                        <CustomSelect options={typeOptions} onSelect={handleChange} name="type" selectedOptValue={type} openUp={isMobile} resetFunc={resetSort} />
                        <CustomSelect options={dirOptions} onSelect={handleChange} name="dir" selectedOptValue={dir} openUp={isMobile} />
                    </div>
                    :
                    <p className="no-select">Sort your items by priority, creation date, price or <br></br>any column you have on your board.</p>
            }

            <button className="btn add" onClick={toggleIsSortOn}>
                {isSortOn ? 'Remove sort' : '+ Add new sort'}
            </button>

        </section>
    )
}

import { useSelector } from "react-redux"
import { useEffect, useRef, useState } from "react"

import { AngleDownIcon, CollapseIcon, DeleteIcon, ExpandIcon, MenuIcon, PencilIcon } from "../../../services/svg.service"

import { getBoardColors, removeGroup, updateGroup } from "../../../store/actions/board.actions"
import { onTooltipParentEnter, onTooltipParentLeave, resetDynamicModal, setDynamicModal, showErrorMsg, showSuccessMsg } from "../../../store/actions/system.actions"

import { EditableTxt } from "../../EditableTxt"
import { TaskTable } from "./Task/TaskTable"
import { TaskHeaderList } from "./Task/TaskHeaderList"
import { utilService } from "../../../services/util.service"

export function BoardGroup({ group, titlesOrder, isEditingTitle, onTitleEditLeave, isGroupsCollapsed, toggleIsGroupsCollapsed, isHeaderCollapsed, isMobile }) {
    const menuBtnRef = useRef(null)
    const collapseBtnRef = useRef(null)
    const colorBtnParentRef = useRef(null)

    const board = useSelector((storeState) => storeState.boardModule.filteredBoard)

    const filterBy = useSelector(storeState => storeState.boardModule.filterBy)
    const { parentId, type, isOpen } = useSelector((storeState) => storeState.systemModule.dynamicModal)


    const [isEditing, setIsEditing] = useState(isEditingTitle)
    const [groupTitle, setGroupTitle] = useState(group.title)
    const [groupColor, setGroupColor] = useState(group.color)
    const [isGroupCollapsed, setIsGroupCollapsed] = useState(false)

    const isMenuOpen = parentId === `${group.id}-menu`
    const isColorPickerOpen = parentId === `${group.id}-colorPicker`
    const isMobileMenu = parentId === `${group.id}-mobile-menu`
    const colors = getBoardColors()


    useEffect(() => {
        setGroupTitle(group.title)
    }, [group])

    useEffect(() => {
        setIsEditing(isEditingTitle)
    }, [isEditingTitle])

    async function onGroupChange(field, data) {
        try {
            const prevState = {
                field,
                data: group[field]
            }
            const newState = {
                field,
                data
            }
            const updatedGroup = { ...group, [field]: data }
            updateGroup(board._id, updatedGroup, prevState, newState)
        } catch (err) {
            console.error('Error updating group:', err)
            showErrorMsg(`Cannot update Group ${groupTitle} ${field}`)
        }
    }

    async function onRemoveGroup() {
        try {
            await removeGroup(board._id, group.id)

            showSuccessMsg(`Group ${groupTitle} was successfully deleted.`)
        } catch (err) {
            console.log('Error removing task:', err)

            if (err) {
                showErrorMsg(err.message)
            } else {

                showErrorMsg(`Cannot delete Group ${groupTitle}`)
            }
        } finally {
            resetDynamicModal()
        }
    }

    async function onChangeTitle({ target }) {
        try {
            const title = target.value
            setGroupTitle(title)
        } catch (err) {
            console.error('Error changing group title:', err)
            showErrorMsg(`Cannot change Group ${groupTitle} Tile`)
        }
    }

    async function onChangeColor(color) {
        try {

            setGroupColor(color)
            // onGroupChange('color', color)

            let titleToSave = groupTitle
            if (!groupTitle) {
                setGroupTitle(group.title)
                titleToSave = group.title
            }

            const prevState = {
                field: 'group color',
                data: group.color
            }
            const newState = {
                field: 'group color',
                data: color
            }

            const updatedGroup = { ...group, 'color': color, 'title': titleToSave }
            updateGroup(board._id, updatedGroup, prevState, newState)
            // onGroupChange('title', titleToSave)
            resetDynamicModal()
            setIsEditing(false)
        } catch (err) {
            console.error('Error changing group color:', err)
            setGroupColor(group.color)
            showErrorMsg(`Cannot change Group ${groupTitle} Color`)
        }
    }

    async function onGroupEditExit() {
        try {
            let titleToSave = groupTitle
            if (!groupTitle) {
                setGroupTitle(group.title)
                titleToSave = group.title
            }

            onGroupChange('title', titleToSave)

            if (!isColorPickerOpen) {
                setIsEditing(false)
                onTitleEditLeave()
            }
        } catch (err) {
            console.error('Error changing group title:', err)
            showErrorMsg(`Cannot change Group Tile`)
        }
    }

    function highlightText(text, query) {
        if (!query) return text
        const escapedQuery = utilService.escapeRegExp(query)

        const parts = text.split(new RegExp(`(${escapedQuery})`, 'gi'))
        return parts.map((part, index) =>
            part.toLowerCase() === query.toLowerCase()
                ? <span key={index} className="highlight">{part}</span>
                : part
        )
    }

    function toggleMenu(ev) {
        if (isMenuOpen) {
            resetDynamicModal()
        } else {
            setDynamicModal({
                isOpen: true,
                parentRefCurrent: menuBtnRef.current,
                type: 'menuOptions', data: { options: menuOptions },
                parentId: `${group.id}-menu`
            })
        }
    }

    function toggleCollapsed() {
        resetDynamicModal()
        setIsGroupCollapsed(prevCollapsed => !prevCollapsed)
        if (isGroupsCollapsed) toggleIsGroupsCollapsed()
    }

    function toggleGroupsCollapsed() {
        resetDynamicModal()
        toggleIsGroupsCollapsed()
    }

    function onColorDisplayClick(ev) {
        ev.stopPropagation()

        if (isColorPickerOpen) {
            resetDynamicModal()
        } else {
            setDynamicModal({
                isOpen: true,
                parentRefCurrent: colorBtnParentRef.current,
                type: 'colorPicker',
                data: { colors: colors, onColorClick: onChangeColor },
                parentId: `${group.id}-colorPicker`,
                isPosBlock: true,
            })
        }
    }

    function onTitleClick() {
        resetDynamicModal()
        if (!isMobile) {
            setIsEditing(true)
        } else {

            if (isMobileMenu) {
                resetDynamicModal()
            } else {
                setDynamicModal(
                    {
                        isOpen: true,
                        parentRefCurrent: colorBtnParentRef.current,
                        type: 'menuOptions',
                        data: { options: menuOptions },
                        parentId: `${group.id}-mobile-menu`,
                        isPosBlock: true,
                        hasCaret: true
                    })
            }
        }
    }

    function onEditClick() {
        resetDynamicModal()
        setIsEditing(true)
    }

    function onTitileHover() {
        if (!isEditing) onTooltipParentEnter(isMobile, isOpen, type, 'Click to edit', `${group.id}-title`, colorBtnParentRef)
    }

    const menuOptions = [
        {
            icon: (isGroupCollapsed || isGroupsCollapsed) ? <ExpandIcon /> : <CollapseIcon />,
            title: (isGroupCollapsed || isGroupsCollapsed) ? 'Expand this group' : 'Collapse this group',
            onOptionClick: toggleCollapsed
        },
        {
            icon: (isGroupsCollapsed) ? <ExpandIcon /> : <CollapseIcon />,
            title: (isGroupsCollapsed) ? 'Expand all groups' : 'Collapse all groups',
            onOptionClick: toggleGroupsCollapsed
        },
        {
            icon: <PencilIcon />,
            title: 'Edit',
            onOptionClick: onEditClick
        },
        {
            icon: <DeleteIcon />,
            title: 'Delete',
            onOptionClick: onRemoveGroup
        }
    ]

    const extraTitleInputBtn = [
        {
            className: "group-color-display",
            style: { backgroundColor: groupColor },
            onMouseDown: onColorDisplayClick
        }
    ]


    return (
        <section className={`${(isGroupCollapsed || isGroupsCollapsed) && 'collapsed'} board-group`}>
            <div className={`full-width subgrid full-grid-column ${isHeaderCollapsed && "board-header-collapsed"} group-sticky-container sticky-left`}>
                <div className="subgrid full-grid-column group-title-container sticky-left">
                    <div className="flex align-center sticky-left full-width">
                        {!isMobile && <div className={`menu-container flex align-center justify-center sticky-left ${isMenuOpen && 'full-opacity'}`} ref={menuBtnRef}>
                            <button className="btn svg-inherit-color" onClick={toggleMenu} style={{ fill: 'black' }}>
                                <MenuIcon />
                            </button>
                        </div>}

                        {(isGroupCollapsed || isGroupsCollapsed) && <>
                            {isMobile && <div className="task-row-placeholder"></div>}
                            <div
                                style={{ backgroundColor: groupColor }}
                                className={`${isMobile ? 'sticky-left-10' : 'sticky-left-36'} color-display `}>
                            </div></>}

                        <div className={`${isMobile ? 'sticky-left' : 'sticky-left-40'} title-container flex align-center`}>
                            <div className="flex align-center">

                                <button
                                    onClick={toggleCollapsed}
                                    // title="Collapse group"
                                    style={{ fill: groupColor }}
                                    className="arrow-container flex svg-inherit-color"
                                    ref={collapseBtnRef}
                                    onMouseEnter={() => onTooltipParentEnter(isMobile, isOpen, type, `${isGroupCollapsed ? 'Expand group' : 'Collapse group'}`, `${group.id}-collapse-title`, collapseBtnRef)}
                                    onMouseLeave={() => onTooltipParentLeave(isMobile, parentId, `${group.id}-collapse-title`)}
                                >
                                    <AngleDownIcon />
                                </button>

                                <div
                                    ref={colorBtnParentRef}
                                    onMouseEnter={onTitileHover}
                                    onMouseLeave={() => onTooltipParentLeave(isMobile, parentId, `${group.id}-title`)}
                                >
                                    <EditableTxt
                                        isEditing={isEditing}
                                        txtValue={highlightText(groupTitle, filterBy.txt)}
                                        onTxtClick={onTitleClick}
                                        inputValue={groupTitle}
                                        onInputChange={onChangeTitle}
                                        onEditClose={onGroupEditExit}
                                        style={{ color: groupColor }}
                                        extraBtnsStart={extraTitleInputBtn}

                                    />
                                </div>
                            </div>


                            <p className="tasks-count">{group.tasks.length} Tasks</p>
                        </div>
                    </div>
                </div>
                <TaskHeaderList groupColor={groupColor} titlesOrder={titlesOrder} />
            </div>

            <TaskTable titlesOrder={titlesOrder} groupColor={groupColor} highlightText={highlightText} filterBy={filterBy} group={group} board={board} />

        </section >
    )
}

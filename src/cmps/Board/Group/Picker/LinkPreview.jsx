import { useSelector } from "react-redux"
import { useRef } from "react"

import { CloseIcon } from "../../../../services/svg.service"

import { resetDynamicModal, setDynamicModal } from "../../../../store/actions/system.actions"

export function LinkPreview({ info, onUpdate, taskId }) {
    const { parentId } = useSelector((storeState) => storeState.systemModule.dynamicModal)
    const isMobile = useSelector((storeState) => storeState.systemModule.isMobile)
    const previewBtnRef = useRef(null)

    const isLinkPickerOpen = parentId === `${taskId}-linkPicker`
    const isMobileMenuOpen = parentId === `${taskId}-mobile-menu`

    function onLinkPreviewClick() {
        if (isLinkPickerOpen) {
            resetDynamicModal()
        } else {
            setDynamicModal({
                isOpen: true,
                parentRefCurrent: previewBtnRef.current,
                type: 'linkPicker',
                data: {
                    url: info && info.url || '',
                    displayTxt: info && info.displayTxt || '',
                    onChangeLink: onUpdate
                },
                parentId: `${taskId}-linkPicker`,
                isPosBlock: true,
            })
        }
    }

    function onRemoveLinkClick(ev) {
        ev.stopPropagation()
        onUpdate('link', null)
    }

    function onMobileHrefClick() {
        if (isMobileMenuOpen) {
            resetDynamicModal()
        } else {
            setDynamicModal({
                isOpen: true,
                parentRefCurrent: previewBtnRef.current,
                type: 'menuOptions',
                data: { options: menuOptions },
                parentId: `${taskId}-mobile-menu`,
                isPosBlock: true,
                hasCaret: true
            })
        }
    }

    const menuOptions = [
        {
            title: 'Open',
            onOptionClick: () => { window.open(info.url, '_blank') }
        },
        {
            title: 'Change',
            onOptionClick: onLinkPreviewClick
        },
    ]

    function onLinkClickDynamic() {
        if (isMobile && info) {
            onMobileHrefClick()
        } else {
            onLinkPreviewClick()
        }
    }

    let linkContent

    if (isMobile) {
        linkContent = info ? (
            <p className="link-href" onClick={onMobileHrefClick}>
                {info.displayTxt || info.url}
            </p>
        ) : null
    } else {
        linkContent = info ? (
            <a className="link-href" target="_blank" href={info.url}>
                {info.displayTxt || info.url}
            </a>
        ) : null
    }

    return (
        <li onClick={onLinkClickDynamic} className="data-preview-container link-preview link-col" ref={previewBtnRef}>
            <button className="flex justify-center align-center data-preview-content">
                {linkContent}
            </button>

            {info && <button className="btn remove-btn" onClick={onRemoveLinkClick}><CloseIcon /></button>}
        </li>
    )
}

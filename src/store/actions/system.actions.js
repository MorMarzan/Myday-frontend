import { SET_DYNAMIC_DIALOG, SET_DYNAMIC_MODAL, SET_DYNAMIC_MODAL_OPEN, SET_DYNAMIC_MODAL_PARENT_REF, SET_DYNAMIC_MODAL_TYPE, SET_DYNAMIC_MODAL_DATA, SET_DYNAMIC_MODAL_PARENT, SET_IS_LOADING, SET_DYNAMIC_PANEL_OPEN, SET_DYNAMIC_PANEL_TYPE, SET_DYNAMIC_PANEL_DATA, SET_SIDE_PANEL_OPEN, SET_IS_FULL_SIDEBAR_MOBILE, SET_IS_MOBILE } from '../reducers/system.reducer'
import { SET_MSG } from '../reducers/system.reducer.js'
import { store } from '../store'
import { useSelector } from 'react-redux';

// Loading
export function setIsLoading(isLoading) {
    store.dispatch({ type: SET_IS_LOADING, isLoading })
}

// msg
export function showSuccessMsg(txt) {
    store.dispatch({ type: SET_MSG, msg: { type: 'success', txt } })
}

export function showErrorMsg(txt) {
    store.dispatch({ type: SET_MSG, msg: { type: 'error', txt } })
}

export function setMsg(msg) {
    store.dispatch({ type: SET_MSG, msg })
}

export function setIsFullSidebarMobile(isFullSidebarMobile) {
    store.dispatch({ type: SET_IS_FULL_SIDEBAR_MOBILE, isFullSidebarMobile })
}

// modal
export function setDynamicModalOpen(isOpen) {
    store.dispatch({ type: SET_DYNAMIC_MODAL_OPEN, isOpen })
}

export function setDynamicModalParentRefCurrent(dynamicModalParentRefCurrent) {
    store.dispatch({ type: SET_DYNAMIC_MODAL_PARENT_REF, dynamicModalParentRefCurrent })
}

export function setDynamicModalType(dynamicModalType) {
    store.dispatch({ type: SET_DYNAMIC_MODAL_TYPE, dynamicModalType })
}

export function setDynamicModalData(dynamicModalData) {
    store.dispatch({ type: SET_DYNAMIC_MODAL_DATA, dynamicModalData })
}

export function setDynamicModalParent(parentId) {
    store.dispatch({ type: SET_DYNAMIC_MODAL_PARENT, parentId })
}

export function setDynamicModal(dynamicModal) {
    store.dispatch({ type: SET_DYNAMIC_MODAL, dynamicModal })
}
export function resetDynamicModal() {
    store.dispatch({
        type: SET_DYNAMIC_MODAL, dynamicModal: getEmptyDynamicModal()
    })
}


export function onTooltipParentEnter(isMobile, isOpen, type, txt, name, ref) {
    if (isMobile || (isOpen && type !== 'tooltip')) return

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

export function onTooltipParentLeave(isMobile, parentId, name) {
    if (isMobile) return
    if (parentId === `${name}-tooltip`) resetDynamicModal()
}

//dialog
export function setDynamicDialog(dynamicDialog) {
    store.dispatch({
        type: SET_DYNAMIC_DIALOG, dynamicDialog
    })
}

export function resetDynamicDialog() {
    store.dispatch({
        type: SET_DYNAMIC_DIALOG, dynamicDialog: getEmptyDynamicDialog()
    })
}

//GET

export function getEmptyDynamicModal() {
    return {
        isOpen: false,
        parentRefCurrent: null,
        type: '',
        data: {},
        parentId: '',
        isPosBlock: true,
        isCenter: true,
        hasCaret: false,
    }
}

export function getEmptyDynamicDialog() {
    return {
        isOpen: false,
        contentCmp: null,
        onClose: null
    }
}

// PANEL

export function setSidePanelOpen(isSidePanelOpen) {
    // console.log('sidePanelIsOpen:', sidePanelIsOpen)
    store.dispatch({ type: SET_SIDE_PANEL_OPEN, isSidePanelOpen })
}

export function setDynamicPanelOpen(dynamicPanelIsOpen) {
    return {
        type: SET_DYNAMIC_PANEL_OPEN,
        dynamicPanelIsOpen,
    }
}

export function setDynamicPanelType(dynamicPanelType) {
    return {
        type: SET_DYNAMIC_PANEL_TYPE,
        dynamicPanelType,
    }
}

export function setDynamicPanelData(dynamicPanelData) {
    return {
        type: SET_DYNAMIC_PANEL_DATA,
        dynamicPanelData,
    }
}

//mobile
export function setIsMobile(isMobile) {
    store.dispatch({
        type: SET_IS_MOBILE,
        isMobile,
    })
}



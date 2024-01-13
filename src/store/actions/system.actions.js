import { SET_DYNAMIC_MODAL, SET_DYNAMIC_MODAL_OPEN, SET_DYNAMIC_MODAL_PARENT_REF, SET_DYNAMIC_MODAL_TYPE, SET_DYNAMIC_MODAL_DATA, SET_DYNAMIC_MODAL_PARENT, SET_IS_LOADING, SET_DYNAMIC_PANEL_OPEN, SET_DYNAMIC_PANEL_TYPE, SET_DYNAMIC_PANEL_DATA, SET_SIDE_PANEL_OPEN, SET_IS_FULL_SIDEBAR_MOBILE, SET_IS_MOBILE } from '../reducers/system.reducer'
import { SET_MSG } from '../reducers/system.reducer.js'
import { store } from '../store'

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

export function getEmptyDynamicModal() {
    return {
        isOpen: false,
        parentRefCurrent: null,
        type: '',
        data: {},
        parentId: '',
        isPosBlock: true,
        isCenter: true,
        hasTooltip: false,
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
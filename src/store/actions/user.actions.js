import { userService } from '../../services/user.service.js'
import { store } from '../store.js'

import { REMOVE_USER, SET_USER, SET_USERS, SET_WATCHED_USER } from '../reducers/user.reducer.js'
import { showErrorMsg } from './system.actions.js'

export async function getUsers() {
    try {
        const users = await userService.getUsers()
        store.dispatch({ type: SET_USERS, users })
        return users
    } catch (err) {
        console.log('UserActions: err in getUsers', err)
    }

}

export async function removeUser(userId) {
    try {
        await userService.remove(userId)
        store.dispatch({ type: REMOVE_USER, userId })
    } catch (err) {
        console.log('UserActions: err in removeUser', err)
    }
}

export async function login(credentials) {
    try {
        const user = await userService.login(credentials)
        store.dispatch({
            type: SET_USER,
            user
        })
        return user
    } catch (err) {
        console.log('Cannot login', err)
        throw err
    }
}

export async function signup(credentials) {
    try {
        const user = await userService.signup(credentials)
        store.dispatch({
            type: SET_USER,
            user
        })
        return user
    } catch (err) {
        console.log('Cannot signup', err)
        throw err
    }
}

export async function logout() {
    try {
        await userService.logout()
        store.dispatch({
            type: SET_USER,
            user: null
        })
    } catch (err) {
        console.log('Cannot logout', err)
        throw err
    }
}

export async function loadUser(userId) {
    try {
        const user = await userService.getById(userId)
        store.dispatch({ type: SET_WATCHED_USER, user })
    } catch (err) {
        showErrorMsg('Cannot load user')
        console.log('Cannot load user', err)
    }
}

export async function getUser(userId) {
    try {
        const user = await userService.getById(userId)
        return user
    } catch (err) {
        showErrorMsg('Cannot load user')
        console.log('Cannot load user', err)
    }
}

export async function updateUser(user) {
    try {
        const updatedUser = await userService.save(user)
        store.dispatch({
            type: SET_USER,
            user
        })
        return updatedUser
    } catch (err) {
        showErrorMsg('Cannot load user')
        console.log('Cannot load user', err)
    }
}

export async function fetchUsers(userIds) {
    try {
        return await Promise.all(
            userIds.map(async (member) => {
                const loadedUser = await getUser(member)
                return loadedUser
            })
        )
    } catch (err) {
        showErrorMsg('Cannot load user')
        console.log('Cannot fetch users', err)
    }
}

export function getUserById(userId) {
    const users = store.getState().userModule.users
    const user = users.find(user => user._id === userId)
    return user || null
}
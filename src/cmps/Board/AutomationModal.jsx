import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

import { useSession, useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react'
import { updateUser } from '../../store/actions/user.actions'
import { resetDynamicDialog } from '../../store/actions/system.actions'

import { GoogleBtn } from './GoogleBtn'
import { CloseIcon, GmailIcon, GoogleCalendarIcon } from '../../services/svg.service'
import { AutomationList } from './AutomationList'

export function AutomationModal() {
    const loggedInUser = useSelector(storeState => storeState.userModule.user)

    const session = useSession() //tokens, when session exists we have a user
    const supaBase = useSupabaseClient() //talk to supabase

    const [isCalendarChecked, setIsCalendarChecked] = useState(false)
    const [isGmailChecked, setIsGmailChecked] = useState(false)

    const { isLoading } = useSessionContext()
    const isDisabled = !loggedInUser || !session

    useEffect(() => {
        if (loggedInUser && loggedInUser.automations) {
            setIsCalendarChecked(loggedInUser.automations.includes('calendar'))
            setIsGmailChecked(loggedInUser.automations.includes('gmail'))
        }
    }, [loggedInUser])

    async function googleSignIn() {
        try {
            const { error } = await supaBase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    scopes: 'https://www.googleapis.com/auth/calendar'
                }
            })
            if (error) throw new Error('Error logging in to google provider')
        } catch (err) {
            console.log('err', err)
        }
    }

    async function signOut() {
        try {
            await supaBase.auth.signOut()
        } catch (err) {
            console.log('err', err)
        }
    }

    async function handleSwitchChange(isChecked, automation) {
        try {
            let newAtomations = loggedInUser.automations || []
            if (isChecked) {
                newAtomations.push(automation)
            } else {
                newAtomations = newAtomations.filter(currAuto => currAuto !== automation)
            }
            const updatedUser = { ...loggedInUser, automations: newAtomations }
            await updateUser(updatedUser)
            switch (automation) {
                case 'calendar':
                    setIsCalendarChecked(isChecked)
                    break

                case 'gmail':
                    setIsGmailChecked(isChecked)
                    break

                default:
                    break
            }
        } catch (err) {
            console.log('err', err)
        }
    }

    const automations = [
        {
            txt: <p>When <span>task is assigned</span> to me <span>add Calendar event</span></p>,
            icon: <GoogleCalendarIcon />,
            name: 'calendar',
            isChecked: isCalendarChecked
        },
        {
            txt: <p>When <span>task is assigned</span> to me <span>recive an email</span></p>,
            icon: <GmailIcon />,
            name: 'gmail',
            isChecked: isGmailChecked
        }
    ]

    if (isLoading) return <div className="automation-modal">Loading...</div>
    return (
        <div className={`${loggedInUser && 'logged-in-user'} ${session && 'session'} automation-modal`}>
            <header className="flex align-center">
                <div className="flex align-center">
                    <img className="logo" src="/img/myday-temp-logo.png" />
                    <h1>Automations</h1>
                </div>

                <button className='flex' onClick={resetDynamicDialog}><CloseIcon /></button>
            </header>

            <GoogleBtn
                onBtnClick={session ? () => signOut() : () => googleSignIn()}
                txt={session ? 'Sign out of google' : 'Sign in with google'}
            />

            {isDisabled &&
                <p className="disabled-msg">To use our Automations, please <span>sign in with Google</span> & make sure to <span>log in to Myday</span></p>
            }

            <AutomationList
                automations={automations}
                isDisabled={isDisabled}
                handleSwitchChange={handleSwitchChange}
            />
        </div>
    )
}

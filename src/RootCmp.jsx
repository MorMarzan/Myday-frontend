import { useRef } from 'react'
import { Routes, Route } from 'react-router'
import { useSession } from '@supabase/auth-helpers-react'
import 'animate.css'

import { BoardDetails } from './pages/BoardDetails'
import { HomePage } from './pages/HomePage'
import { Workspace } from './pages/Workspace'
import { TaskDetails } from './pages/TaskDetails'
import { BoardApp } from './pages/BoardApp'
import { setIsMobile } from './store/actions/system.actions'
import { useEffect } from 'react'
import { LoginSignup } from './pages/LoginSignup'
import { UserMsg } from './cmps/UserMsg'
import { ActivityLog } from './cmps/Panel/ActivityLog'
import { utilService } from './services/util.service'


export function RootCmp() {
    const session = useSession()
    const isLogMsgPrinted = useRef(false)


    useEffect(() => {
        window.addEventListener('resize', handleScreenResize)
        printLogMsg()

        return () => {
            window.removeEventListener('resize', handleScreenResize)
        }
    }, [])


    useEffect(() => {
        if (session) {
            if (session.provider_token) {
                utilService.saveToStorage('provider_token', session.provider_token)
            } else {
                utilService.saveToStorage('sb-xsjwgpefjvojzodrgato-auth-token', null)
                utilService.saveToStorage('provider_token', null)
            }
        }
    }, [session])

    function printLogMsg() {
        if (isLogMsgPrinted.current) return
        console.log(
            `%cLooking for web developers?\n%cWe're looking for a job. Contact us!\n\n` +
            `%cNoam Saar: %chttps://www.linkedin.com/in/noam-saar-8266662a1/\n` +
            `%cEden Rize: %chttps://www.linkedin.com/in/eden-rize-9476541b7/\n` +
            `%cMor Marzan: %chttps://www.linkedin.com/in/mor-marzan-26b48621a/\n`,
            "color: #6161ff; font-size:20px;", // Style for "Looking for web developers?"
            "color: #FFCE04; font-size:14px;", // Style for "We're looking for a job. Contact us!"
            "color: #F6335A; font-size:14px;", // Style for "Noam Saar:"
            "text-decoration: underline; color: #F6335A; font-size:14px;", // Style for Noam Saar's LinkedIn URL
            "color: #FFCE04; font-size:14px;", // Style for "Eden Rize:"
            "text-decoration: underline; color: #FFCE04; font-size:14px;", // Style for Eden Rize's LinkedIn URL
            "color: #04CC77; font-size:14px;", // Style for "Mor Marzan:"
            "text-decoration: underline; color: #04CC77; font-size:14px;"  // Style for Mor Marzan's LinkedIn URL
        )

        isLogMsgPrinted.current = true
    }


    function handleScreenResize() {
        setIsMobile(window.innerWidth <= 905)
    }

    return (
        <section className="app">
            <Routes>
                <Route element={<HomePage />} path="/" />
                <Route element={<LoginSignup />} path="/auth/:navLocation" />

                <Route element={<BoardApp />} path="/board" >
                    <Route element={<Workspace />} path="/board/workspace" />
                    <Route element={<BoardDetails />} path="/board/:boardId" >
                        <Route path="/board/:boardId/task/:taskId" element={<TaskDetails />} />
                        <Route path="/board/:boardId/activity_log" element={<ActivityLog />} />
                    </Route>
                </Route>
            </Routes>
            <UserMsg />
        </section>
    )
}



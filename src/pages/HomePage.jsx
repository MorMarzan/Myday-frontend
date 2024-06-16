import { useState } from "react"

import { HomeHeader } from "../cmps/HomeHeader"

import creativeDesignImg from '/img/home_page/CreativeDesignImg.png'
import ITImg from '/img/home_page/ITImg.png'
import MarketingImg from '/img/home_page/MarketingImg.png'
import ProjectManagementImg from '/img/home_page/ProjectManagementImg.png'
import TaskManagementImg from '/img/home_page/TaskManagementImg.png'
import HRImg from '/img/home_page/HRImg.png'
import OperationsImg from '/img/home_page/OperationsImg.png'
import MoreWorkflowsImg from '/img/home_page/MoreWorkflowsImg.png'
import { ArrowRightIcon } from "../services/svg.service"

import HomeAppPreviewImg from '/img/home_page/HomeAppPreviewImg.avif'
import HoltCatImg from '/img/home_page/HoltCatImg.avif'
import CanvaImg from '/img/home_page/CanvaImg.png'
import CocaColaImg from '/img/home_page/CocaColaImg.png'
import OxyImg from '/img/home_page/OxyImg.png'
import LionsgateImg from '/img/home_page/LionsgateImg.png'
import CarrefourImg from '/img/home_page/CarrefourImg.png'
import BdImg from '/img/home_page/BdImg.png'
import GlossierImg from '/img/home_page/GlossierImg.png'
import UniversalImg from '/img/home_page/UniversalImg.png'
import { useNavigate } from "react-router"

import TimeLine from '/img/home_page/Timeline_column.png'
import Status from '/img/home_page/Status_column.png'
import Battery from '/img/home_page/Battery.png'
import Integration from '/img/home_page/Integration.avif'
import Pie from '/img/home_page/Pie.png'
import Mobile from '/img/home_page/MobileApp.avif'
import Automation from '/img/home_page/Automation.avif'
import Comment from '/img/home_page/Talk.avif'
import Dashboard from '/img/home_page/Dash.avif'
import { BrowserWarning } from "../cmps/BrowserWarning"
import { GetStartedBtn } from "../cmps/GetStartedBtn"

export function HomePage() {
    const [scrolled, setScrolled] = useState(false)
    const navigate = useNavigate()




    window.onscroll = function handleScroll() {
        const isScrolled = window.scrollY > 0
        setScrolled(isScrolled)
    }
    return (
        <section className="home-page page">
            <HomeHeader scrolled={scrolled} />
            <main className="home-page-content main-layout">
                <BrowserWarning />
                <section className='main-titles-container'>
                    <h1 className='home-main-title'>
                        A platform built for a <br />
                        new way of working
                    </h1>
                    <p>What would you like to manage?</p>
                </section>

                <section className='home-cards-options'>
                    <article className='card'>
                        <img src={creativeDesignImg} alt="" />
                        <span>Creative & design</span>
                    </article>
                    <article className='card'>
                        <img src={OperationsImg} alt="" />
                        <span>Operations</span>
                    </article>
                    <article className='card'>
                        <img src={MarketingImg} alt="" />
                        <span>Marketing</span>
                    </article>
                    <article className='card'>
                        <img src={ProjectManagementImg} alt="" />
                        <span>Project management</span>
                    </article>
                    <article className='card'>
                        <img src={TaskManagementImg} alt="" />
                        <span>Task management</span>
                    </article>
                    <article className='card'>
                        <img src={HRImg} alt="" />
                        <span>HR</span>
                    </article>
                    <article className='card'>
                        <img src={ITImg} alt="" />
                        <span>IT</span>
                    </article>
                    <article className='card'>
                        <img src={MoreWorkflowsImg} alt="" />
                        <span>More workflows</span>
                    </article>
                </section>

                <section className='btn-container'>
                    <GetStartedBtn />
                    <p className='no-credit-card-txt'>No credit card needed<span>✦</span>Unlimited time on Free plan</p>
                </section>

            </main>

            <section className='home-first-img-container full'>
                <img src={HomeAppPreviewImg} alt="" />
            </section>

            <section className='sponsers-section'>
                <div className='sponsers-imgs-container'>
                    <img src={HoltCatImg} alt="" />
                    <img src={CanvaImg} alt="" />
                    <img src={CocaColaImg} alt="" />
                    <img className='oxy-img' src={OxyImg} alt="" />
                    <img src={LionsgateImg} alt="" />
                    <img className='carrefour-img' src={CarrefourImg} alt="" />
                    <img src={BdImg} alt="" />
                    <img src={GlossierImg} alt="" />
                    <img src={UniversalImg} alt="" />
                </div>
            </section>

            <section className="boost-your-team flex">
                <div className="flex justify-center">
                    <h2>The Work OS that lets you shape workflows, your way</h2>
                    <div className="boost-your-team-cta flex column">
                        <span>
                            Boost your team’s alignment, efficiency, and productivity by
                            customizing any workflow to fit your needs.
                        </span>
                        <div className="flex">
                            <button onClick={() => navigate('/board/workspace')} className='btn-get-started'><span className='get-started-txt'>Get Started</span>
                                <ArrowRightIcon />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="preview-images-section">
                <div className="masonry-grid">
                    <div className="grid-container">
                        <div className="item item1 timeline">
                            <img src={TimeLine} alt="" />
                        </div>
                        <div className="item item2 status">
                            <img src={Status} alt="" />
                        </div>
                        <div className="item item3 battery">
                            <img src={Battery} alt="" />
                        </div>
                        <div className="item item4 integration">
                            <img src={Integration} alt="" />
                        </div>
                        <div className="item item5 pie">
                            <img src={Pie} alt="" />
                        </div>
                        <div className="item item6 mobile">
                            <img src={Mobile} alt="" />
                        </div>
                        <div className="item item7 automation">
                            <img src={Automation} alt="" />
                        </div>
                        <div className="item item8 comment">
                            <img src={Comment} alt="" />
                        </div>
                        <div className="item item9 dashboard">
                            <img src={Dashboard} alt="" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="footer-section full">
                <h2>Deliver your best work <span>with myday.com</span></h2>
                <p>No credit card needed   <span>✦</span>   Unlimited time on Free plan</p>
                <GetStartedBtn />
            </section>
        </section >
    )
}
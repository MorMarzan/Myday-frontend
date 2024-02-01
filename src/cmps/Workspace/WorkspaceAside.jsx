import TemplatesBanner from "/img/templates-banner.png"
import GetStarted from "/img/get-started-2.svg"
import HelpCenter from "/img/help-center.svg"
import Webinars from "/img/webinars.svg"

export function WorkspaceAside() {
    return (
        <section className="workspace-aside">
            <section className="explore-templates-container">
                <img src={TemplatesBanner} alt="" />

                <div className="banner-content-wrapper">
                    <p className="banner-text">
                        Boost your workflow in minutes with ready-made templates
                    </p>

                    {/* <button className="banner-button">Explore templates</button> */}
                </div>
            </section>

            <section className="get-inspired-content-wrapper">
                <p className="get-inspired-text">
                    Learn & get inspired
                </p>

                <div className="navigation-card-component">
                    <img src={GetStarted} alt="" />

                    <div className="card-content">
                        <p className="card-title">
                            Getting started
                        </p>

                        <p className="card-text">
                            Learn how monday.com works
                        </p>
                    </div>

                </div>

                <div className="navigation-card-component">

                    <img src={HelpCenter} alt="" />

                    <div className="card-content">
                        <p className="card-title">
                            Help center
                        </p>

                        <p className="card-text">
                            Learn and get support
                        </p>
                    </div>

                </div>
                {/* 
                <div className="navigation-card-component">

                    <img src={Webinars} alt="" />

                    <div className="card-content">
                        <p className="card-title">
                            Join a webinar
                        </p>

                        <p className="card-text">
                            Watch a live walkthrough
                        </p>
                    </div>

                </div> */}
            </section>
        </section>
    )
}
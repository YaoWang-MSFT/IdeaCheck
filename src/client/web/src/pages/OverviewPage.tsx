import React from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import Features from '../components/Features'
import HowItWorks from '../components/HowItWorks'
import Footer from '../components/Footer'

const OverviewPage: React.FC = () => {
  return (
    <div className="overview-page">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <Footer />
    </div>
  )
}

export default OverviewPage
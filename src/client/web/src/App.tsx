import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import OverviewPage from './pages/OverviewPage'
import LoginPage from './pages/LoginPage'
import UserHomePage from './pages/UserHomePage'
import ProductDetailPage from './pages/ProductDetailPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<UserHomePage />} />
        <Route path="/products/:productId" element={<ProductDetailPage />} />
      </Routes>
    </Router>
  )
}

export default App
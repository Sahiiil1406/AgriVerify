import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './pages/auth';
import Certificate from './components/cetificate';
import Dashboard from './pages/dashboard';
import { UserProvider } from './context/userContext';
import PlantDetail from './pages/plantDetail';
import Notify from './pages/Notify';



function App() {
  return (
    <UserProvider>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/certificate/:id" element={<Certificate />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/plant/:id" element={<PlantDetail />} />
            <Route path="/notify" element={<Notify />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;

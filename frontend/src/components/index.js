import React from 'react';
import Navbar from './Navbar';
import Content from './content';

import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';
import reportWebVitals from './reportWebVitals';
import {  BrowserRouter as Router  } from 'react-router-dom'

// function App() {
//   return (
//     <div className="App">
//       <Navbar/>
//       <Content/>
//     </div>
//   );
// }


ReactDOM.createRoot(document.getElementById('root')).render(

  <React.StrictMode>
    <Auth0Provider
      domain={config.domain}
      clientId = {config.auth0token}
      audience={config.audience}
      redirectUri={config.port}>
    
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/ProviderInformation" element={<ProviderInformation />} />
          <Route path="/VisitorPage" element={<VisitorPage />} />
          <Route path="/PatientAccess" element={<PatientAccess />}/>
          <Route path="/PatientPage" element={<PatientPage />}/>
          <Route path="/ProviderPage" element={<ProviderPage />}/>
        </Routes>
      </Router>
      
    </Auth0Provider>
  </React.StrictMode>);

// export default AllPage; document.getElementById('root')
reportWebVitals();
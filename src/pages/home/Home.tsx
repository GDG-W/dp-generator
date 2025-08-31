import './home.css'
import devfestLogo from '../../assets/images/home/devfestlogo.png'
import image1 from '../../assets/images/home/joint.png'
import { useNavigate } from 'react-router-dom'
import {Invert, Vector} from '../../assets/svg/svg-export'


export const Home = () => {
  const navigate = useNavigate();
  
  const handleCreateDP = () => {
    navigate('/create');
  };

  return (
    <div className="home-container">
      <header className="header">
        <div className="logo-section">
          <div className="logo-shapes">
            <div className="shape shape-pink"><Invert/></div>
            <div className="shape shape-green"> <Vector/></div>
          </div>
          <div className="logo-content">
            <img src={devfestLogo} alt="DevFest Lagos" className="logo" />
            <h1 className="title">
              DEVFEST LAGOS<br />
              DP MAKER
            </h1>
            <p className="subtitle">Tell everyone you will be there!</p>
            <button type='button' title="Create your DP" className="cta-button" onClick={handleCreateDP}>CREATE YOURS</button>
          </div>
        </div>
      </header>

      <section className="samples-section">
        <div className="samples-grid">
          <div className="sample-image">
            <img className='image' src={image1} alt="Sample DP 1" />
          </div>
        </div>
      </section>
    </div>
  )
}


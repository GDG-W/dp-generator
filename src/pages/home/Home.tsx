import './home.css'
import image1 from '../../assets/images/home/joint.png'
import mobile from '../../assets/images/home/mobile.png'
import { useNavigate } from 'react-router-dom'
import {Invert, Vector} from '../../assets/svg/svg-export'
import Logo from './components/logo'

export const Home = () => {
  const navigate = useNavigate();
  
  const handleCreateDP = () => {
    navigate('/create');
  };

  return (
    <div className="home-container">
      <div className="logo-shapes">
            <div className="shape shape-pink"><Invert/></div>
            <div className="shape shape-green"> <Vector/></div>
          </div>
      <header className="header">
          <Logo/>
            <div className="logo-content">
            <h1 className="hometitle">
              DEVFEST LAGOS<br />
              DP MAKER
            </h1>
            <p className="homesubtitle">Tell everyone you will be there!</p>
            <button type='button' title="Create your DP" className="cta-button" onClick={handleCreateDP}>CREATE YOURS!</button>
          </div>
      </header>

      <section className="samples-section">
        <div className="samples-grid">
          <div className="sample-image">
            <img className='image' src={image1} alt="Sample DP 1" />
          </div>
        </div>
      </section>
      <section className="mobile-section">
        <div className="mobile-grid">
          <div className="mobile-image">
            <img className='images' src={mobile} alt="Sample DP 1" />
          </div>
        </div>
      </section>
      </div>
  )
}


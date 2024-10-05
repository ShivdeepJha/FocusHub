import reactLogo from './assets/react.svg'
import './App.css'
import Clock from './components/Clock';
import ShortCutLinks from './components/ShortCutLinks';

function App() {
    return (
        <>
            <div className="background-container">
                <img className='moon' src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/moon2.png" alt="" />
                <div className="stars"></div>
                <div className="twinkling"></div>
                <div className="clouds"></div>
                <span className='react-icon-container'>
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </span>
            </div>
            <div className='all-widgets'>
            <Clock />
            <ShortCutLinks/>
            </div>
        </>
    )
}

export default App

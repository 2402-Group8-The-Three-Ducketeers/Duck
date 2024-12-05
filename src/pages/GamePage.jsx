import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setToken } from '../redux/authSlice.js';
import { useDispatch } from 'react-redux';
import  VideoGame  from "../game.js"
import { useEffect } from 'react';
import Header from '../components/Header.jsx';

const Game = () => {
  const token = useSelector(state => state.authorization.token);
  const navigate = useNavigate();
  const dispath = useDispatch();

  useEffect(() => {
    //run the game
    VideoGame()
  }, [])
  
  return (
    <>
      <Header />
    </>
  )
}

export default Game
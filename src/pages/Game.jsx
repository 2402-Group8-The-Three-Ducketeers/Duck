import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setToken } from '../redux/authSlice';
import { useDispatch } from 'react-redux';
import  VideoGame  from "../../game.js"
import { Link } from "react-router-dom"

const Game = () => {
  const token = useSelector(state => state.authorization.token);
  const navigate = useNavigate();
  const dispath = useDispatch();

  return (
    <>
    {token ? <VideoGame /> : <Link to="/login"/>}
    </>
  )
}

export default Game
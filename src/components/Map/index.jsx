import { useDispatch,useSelector } from 'react-redux'
import { addRoute,deleteRoute } from '../../../redux/actions/routes'
function Map({locations}) {

    const dispatch = useDispatch()
    // dispatch(addRoute([longetute,latetud]))
    const routes = useSelector((state) => state.routes.routes)
    return (
        <div>Map</div>
    );
  }
  
  
  export default Map;
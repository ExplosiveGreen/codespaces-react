import { useDispatch,useSelector } from 'react-redux'
import { addRoute,deleteRoute } from '../../../redux/actions/routes'
import {useEffect, useState} from "react";
import {APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useMapsLibrary, useMap} from "@vis.gl/react-google-maps";
import LocationService from '../../../services/LocationService';
function MyMap({locations, isDisplayRoute}) {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    // dispatch(addRoute([longetute,latetud]))
    const routes = useSelector((state) => state.routes.routes)

    const [lat, setLatitude] = useState(10.0);
    const [lng, setLongitude] = useState(10.0);
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
          },
          (error) => {
            console.error(error);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    return(
        <APIProvider apiKey = {import.meta.env.VITE_GOOGLE_API_KEY}>
            <div style={{height: "100vh", width: "100%"}}>
                <Map zoom = {12} center={{ lat, lng }} mapId={import.meta.env.VITE_GOOGLE_MAP_ID} fullscreenControl={false} onClick={()=> setOpen(true)}>
                       {/* This is where you insert your markers! */}



                    {locations && locations.map(item=>{
                        const lat = item.location.lat, lng=item.location.lng;
                        return <>
                        {console.log('test 01: ',item.location)}
                        {item.location &&<>
                            <AdvancedMarker position={{ lat,lng }}>
                            {/*    Customizing the marker? here!*/}
                                <Pin background={"grey"} borderColor={"green"} glyphColor={"blue"}></Pin>
                            </AdvancedMarker>
                            {open && <InfoWindow position={{ lat,lng }} onCloseClick={()=>setOpen(false)}>
                                {console.log(item.element)}
                                {item.element}
                            </InfoWindow> }</>}
                        </>
                    })}
                    
                    {isDisplayRoute && <Directions routesList={routes}/>}
                </Map>
            </div>
    
        </APIProvider>
        );

  }
  
  function Directions({routesList}){
    const map = useMap();
    const routesLibrary = useMapsLibrary("routes");
    const [directionsService, setDirectionsService] = useState();
    const [directionsRenderer, setDirectionsRenderer] = useState();
    const [routes, setRoutes] = useState([]);
    const [routeIndex, setRouteIndex] = useState(0);
    const selected = routes[routeIndex];
    const leg = selected?.legs[0]; // if we got more than 1 legs for the journey, which we DO, we can change leg to display the leg we're at!

    useEffect(()=>{
        if (!routesLibrary || !map) return;
        setDirectionsService(new routesLibrary.DirectionsService());
        setDirectionsRenderer(new routesLibrary.DirectionsRenderer({map}));
    }, [routesLibrary, map]);

    useEffect(()=>{
        if (!directionsService || !directionsRenderer) return;
        directionsService.route({
            origin: "",
            destination: "",
            waypoints: routesList.map(item=>{
                return {
                    location: {
                        lat: item[0], 
                        lng: item[1]
                    },
                    stopover: true
                }
            }),
            travelMode: google.maps.TravelMode.DRIVING,
            provideRouteAlternatives: true
        }).then(response => {
            directionsRenderer.setDirections(response);
            setRoutes(response.routes);
        });
    },[directionsService,directionsRenderer]);

    useEffect(() => {
        if (!directionsRenderer) return;
        directionsRenderer.setRouteIndex(routeIndex);
    }, [routeIndex, directionsRenderer]);

    if (!leg) return null;

    return <div className = "directions">
        {/*Route name (generated):*/}
        <h2>{selected.summary}</h2>
        {/*route info (generated):*/}
        <p>
            {/*<START LOCATION> to <END LOCATION>*/}
            {leg.start_address.split(",")[1]} to {leg.end_address.split(",")[1]}
        </p>
        <p>Distance: {leg.distance?.text}</p>
        <p>Duration: {leg.duration?.text}</p>

    {/*    Displaying alternate routes here*/}
        <h3>Other routes</h3>
        <ul>
            {routes.map((route, index) => <li key={route.summary}>
                <button onClick={()=>setRouteIndex(index)}>
                    {route.summary}
                </button>
            </li>)}
        </ul>
    </div>
}

  export default MyMap;
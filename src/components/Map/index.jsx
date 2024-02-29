import { GoogleMap, useJsApiLoader, Marker, InfoWindowF, DirectionsRenderer, DirectionsService} from '@react-google-maps/api';
import { useDispatch,useSelector } from 'react-redux'
import { addRoute,deleteRoute } from '../../../redux/actions/routes'
import {useEffect, useState, useCallback, memo} from "react";

const containerStyle = {
  width: '90%',
  height: '90vh'
};

const center = {
    lat: 10.0,
    lng: 10.0
  };

function MyMap({locations, isDisplayRoute}) {

    const [open, setOpen] = useState(false);
    
    const dispatch = useDispatch();
    // dispatch(addRoute([longetute,latetud]))
    const routes = useSelector((state) => state.routes.routes)

    const [lat, setLatitude] = useState(10.0);
    const [lng, setLongitude] = useState(10.0);

    const { isLoaded } = useJsApiLoader({
        id: import.meta.env.VITE_GOOGLE_MAP_ID,
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY
    })
    useState

    const [map, setMap] = useState(null)
    const [activeMarker, setActiveMarker] = useState(null);

    const [response, setResponse] = useState<google.maps.DirectionsResult | null>(
        null
      )
    // object for holding values of current route
    const [directionsFormValue, setDirectionsFormValue] = useState({
        origin: '',
        destination: '',
        travelMode: google.maps.TravelMode.DRIVING,
    })


    //2 objects holding references to current route's origin and destination
    const originRef = useRef<HTMLInputElement | null>(null)
    const destinationRef = useRef<HTMLInputElement | null>(null)

    const directionsCallback = useCallback(
        (
          result,status
        ) => {
          if (result !== null) {
            if (status === 'OK') {
              setResponse(result)
            } else {
              console.log('response: ', result)
            }
          }
        },
        []
      )

    const onLoad = useCallback(function callback(map) {
        
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

        // const bounds = new window.google.maps.LatLngBounds(center);
        // map.fitBounds(bounds);
        setMap(map)
  }, [navigator.geolocation,locations])

    const onUnmount = useCallback(function callback(map) {
        setMap(null)
    }, [])

    const handleActiveMarker = (marker) => {
        setActiveMarker(marker);
    };

    function reportPost(markerid) {
        console.log(markerid);
    }
    
    // sending to directions api your route destination, origin and travel mode.
    const directionsServiceOptions =
    useMemo<google.maps.DirectionsRequest>(() => {
      return {
        destination: directionsFormValue.destination,
        origin: directionsFormValue.origin,
        travelMode: directionsFormValue.travelMode,
      }
    }, [
      directionsFormValue.origin,
      directionsFormValue.destination,
      directionsFormValue.travelMode,
    ])

    // getting response from directions api.
    const directionsResult = useMemo(() => {
        return {
            directions: response,
        }
    }, [response])


    return isLoaded ? (
        <GoogleMap
        mapContainerStyle={containerStyle}
        center={{ lat, lng }}
        zoom={15}
        id={import.meta.env.VITE_GOOGLE_MAP_ID} 
        fullscreenControl={false}
        onLoad={onLoad}
        onUnmount={onUnmount}
        >
        { /* Child components, such as markers, info windows, etc. */ }
        
        {locations && locations.map((item, index)=>{
                        const lat = item.location.lat, lng=item.location.lng;
                        console.log('new marker:')
                        console.log('lat: ',lat)
                        console.log('lng: ',lng)
                        return <>
                        {item.location &&<>
                            <Marker key={index} position={{ lat,lng }} onClick={() => handleActiveMarker(index)} onCloseClick={() => handleActiveMarker(none)}>
                                {activeMarker === index ? (
                                    <InfoWindowF onCloseClick={() => setActiveMarker(null)}>
                                                {item.element}
          
                                    </InfoWindowF>
                                ) : null}
                            </Marker>
                            </>}
                        </>
                    })}
                    
                    {isDisplayRoute && <Directions routesList={routes}/>}
        <></>
        </GoogleMap>
    ) : <></>
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
export default memo(MyMap)
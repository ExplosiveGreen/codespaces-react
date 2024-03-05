import { useDispatch,useSelector } from 'react-redux'
import { GoogleMap, useJsApiLoader, Marker, InfoWindowF, DirectionsService, DirectionsRenderer} from '@react-google-maps/api';
import { addRoute,deleteRoute } from '../../../redux/actions/routes'
import {useEffect, useState, useCallback, memo, useRef} from "react";

const containerStyle = {
  width: '90%',
  height: '90vh'
};

const center = {
    lat: 10.0,
    lng: 10.0
  };

function MyMap({locations, isDisplayRoute}) {
    // let callCounter = 0
    // console.log('test 0 - how many times am I called? it`s ', callCounter++)
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch()
    // dispatch(addRoute([longetute,latetud]))
    const routes = useSelector((state) => state.routes.routes)

    const [lat, setLatitude] = useState(10.0);
    const [lng, setLongitude] = useState(10.0);

    const { isLoaded } = useJsApiLoader({
        id: import.meta.env.VITE_GOOGLE_MAP_ID,
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY
    })
    useState
    const waypts = [];
    const [map, setMap] = useState(null)
    const [activeMarker, setActiveMarker] = useState(null)
    const [origin, setOrigin] = useState(null)
    const [destination, setDestination] = useState(null)
    const [response, setResponse] = useState(null);
    let count = useRef(0)
    const [route, setRoute] = useState(null)


      // this function runs once after loading
    const onLoad = useCallback(function callback(map) {
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                setLatitude(position.coords.latitude);
                setOrigin({lat: position.coords.latitude,lng: position.coords.longitude})
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
        waypts.push({
            location:{lat:32.151119, lng: 34.845105},
            stopover: true,
        })
        waypts.push({
            location:{lat:32.170437, lng:34.844282},
            stopover: true,
        })
        setDestination({lat:32.504235,lng:35.001531})
        
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
    
    const directionsCallback = (googleResponse) => {
        if (googleResponse) {
          if(response) {
            if (googleResponse.status === 'OK' && googleResponse.routes.overview_polyline !== response.routes.overview_polyline) {
              setResponse(() => googleResponse)
              setRoute(googleResponse.routes[0])
            } else {
              console.log('response: ', googleResponse)
            }
          } else {
            if (googleResponse.status === 'OK') {
              setResponse(() => googleResponse)
              setRoute(googleResponse.routes[0])
            } else {
              console.log('response: ', googleResponse)
            }
          }
        }
      }


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
            {/* <>
            {console.log('Returning map')}
            </> */
            isLoaded? console.log('loaded'):console.log('not loaded')
            }
            
        { /* Child components, such as markers, info windows, etc. */ }
        {/* This is called TOO MANY TIMES!!! */}
        {locations && isLoaded && locations.map((item, index)=>{
            const lat = item.location.lat, lng=item.location.lng;
            console.log('New iteration:')
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
        
        {isDisplayRoute && <DirectionsMap origin={{lat, lng}} destination='' locations={locations}/>}
        {isLoaded && <>
            <div>
          <>
            {
                waypts.push({
                    location:{lat:32.151119, lng: 34.845105},
                    stopover: true,
                })
            }
            {
                waypts.push({
                    location:{lat:32.170437, lng:34.844282},
                    stopover: true,
                })
            }
            {destination !== '' && origin !== '' && (
              <DirectionsService 
                options={{
                  origin,
                  destination,
                  waypoints: waypts,
                  optimizeWaypoints: true,
                  travelMode: 'DRIVING'
                }}
                callback={directionsCallback}
              />
            )}
  
            {response !== null && (
              <DirectionsRenderer 
                options={{
                  directions: response
                }}
              />
            )}
          </>
      </div>
        </>}
        <></>
        </GoogleMap>
    ) : <></>
}

function DirectionsMap(props) {
    const waypts = [];
    const {origin, destination,locations } = props;
    const [mLocations,setLocations] = useState(props[2])
    const [mOrigin, setOrigin] = useState(props[0])
    const [mDestination, setDestination] = useState(props[1])
    const [route, setRoute] = useState(null)
    const [response, setResponse] = useState(null);

    //THIS FUNCTIONS SETS ALL LOCATIONS LOADED INTO THE ROUTE. DO NOT USE UNTIL YOU GET ONLY SPECIFIC ONES!!!!
    
    // locations.map((item, index)=>{
    //     const lat = item.location.lat, lng=item.location.lng;
    //     console.log('New stop in route!')
    //     waypts.push({
    //         location:{lat,lng},
    //         stopOver: true
    //     })
    //     setDestination({lat,lng})
    // })
    //
    //waypts.pop();
    
    // this is mock data:

    waypts.push({
        location:{lat:32.151119, lng: 34.845105},
        stopover: true,
    })
    waypts.push({
        location:{lat:32.170437, lng:34.844282},
        stopover: true,
    })

    setDestination({lat:32.504235,lng:35.001531})
    // end of mock data

    const directionsCallback = (googleResponse) => {
      if (googleResponse) {
        if(response) {
          if (googleResponse.status === 'OK' && googleResponse.routes.overview_polyline !== response.routes.overview_polyline) {
            setResponse(() => googleResponse)
            setRoute(googleResponse.routes[0])
          } else {
            console.log('response: ', googleResponse)
          }
        } else {
          if (googleResponse.status === 'OK') {
            setResponse(() => googleResponse)
            setRoute(googleResponse.routes[0])
          } else {
            console.log('response: ', googleResponse)
          }
        }
      }
    }
  
    return (
      <div>
          <>
            {destination !== '' && origin !== '' && (
                
              <DirectionsService 
                options={{
                  origin,
                  mDestination,
                  waypoints: waypts,
                  optimizeWaypoints: true,
                  travelMode: 'DRIVING'
                }}
                callback={directionsCallback}
              />
            )}
  
            {response !== null && (
              <DirectionsRenderer 
                options={{
                  directions: response
                }}
              />
            )}
          </>
      </div>
    );
  }

// function Directions({routesList}){
//     const map = useMap();
//     const routesLibrary = useMapsLibrary("routes");
//     const [directionsService, setDirectionsService] = useState();
//     const [directionsRenderer, setDirectionsRenderer] = useState();
//     const [routes, setRoutes] = useState([]);
//     const [routeIndex, setRouteIndex] = useState(0);
//     const selected = routes[routeIndex];
//     const leg = selected?.legs[0]; // if we got more than 1 legs for the journey, which we DO, we can change leg to display the leg we're at!

//     useEffect(()=>{
//         if (!routesLibrary || !map) return;
//         setDirectionsService(new routesLibrary.DirectionsService());
//         setDirectionsRenderer(new routesLibrary.DirectionsRenderer({map}));
//     }, [routesLibrary, map]);

//     useEffect(()=>{
//         if (!directionsService || !directionsRenderer) return;
//         directionsService.route({
//             origin: "",
//             destination: "",
//             waypoints: routesList.map(item=>{
//                 return {
//                     location: {
//                         lat: item[0], 
//                         lng: item[1]
//                     },
//                     stopover: true
//                 }
//             }),
//             travelMode: google.maps.TravelMode.DRIVING,
//             provideRouteAlternatives: true
//         }).then(response => {
//             directionsRenderer.setDirections(response);
//             setRoutes(response.routes);
//         });
//     },[directionsService,directionsRenderer]);

//     useEffect(() => {
//         if (!directionsRenderer) return;
//         directionsRenderer.setRouteIndex(routeIndex);
//     }, [routeIndex, directionsRenderer]);

//     if (!leg) return null;

//     return <div className = "directions">
//         {/*Route name (generated):*/}
//         <h2>{selected.summary}</h2>
//         {/*route info (generated):*/}
//         <p>
//             {/*<START LOCATION> to <END LOCATION>*/}
//             {leg.start_address.split(",")[1]} to {leg.end_address.split(",")[1]}
//         </p>
//         <p>Distance: {leg.distance?.text}</p>
//         <p>Duration: {leg.duration?.text}</p>

//     {/*    Displaying alternate routes here*/}
//         <h3>Other routes</h3>
//         <ul>
//             {routes.map((route, index) => <li key={route.summary}>
//                 <button onClick={()=>setRouteIndex(index)}>
//                     {route.summary}
//                 </button>
//             </li>)}
//         </ul>
//     </div>
// }
export default memo(MyMap)
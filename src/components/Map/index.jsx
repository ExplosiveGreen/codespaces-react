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
    const [lat, setLatitude] = useState(32.086759);
    const [lng, setLongitude] = useState(34.789888);

    const { isLoaded } = useJsApiLoader({
        id: import.meta.env.VITE_GOOGLE_MAP_ID,
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY
    })
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
          
        setMap(map)
        waypts.push({
            location:{lat:32.151119, lng: 34.845105},
            stopover: true,
        })
        waypts.push({
            location:{lat:32.170437, lng:34.844282},
            stopover: true,
        })
        setDestination({lat:34.800792,lng:32.083366})
        
  }, [navigator.geolocation,locations])

    const onUnmount = useCallback(function callback(map) {
        setMap(null)
    }, [])

    const handleActiveMarker = (marker) => {
        setActiveMarker(marker);
    };
    
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
            
        { /* Child components, such as markers, info windows, etc. */ }
        {/* This is called TOO MANY TIMES!!! */}
        {locations && isLoaded && locations.map((item, index)=>{
            const lat = item.location.lat , lng=item.location.lng;
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
        
        {isLoaded && isDisplayRoute && <>
            <div>
          <>
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

export default memo(MyMap)
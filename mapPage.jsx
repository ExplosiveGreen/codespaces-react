"use client";
/* global google */
import {useEffect, useState} from "react";
import {APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useMapsLibrary, useMap} from "@vis.gl/react-google-maps";

export default function Intro(){
    const position = {lat: 33.54, lng: 10};
    const [open, setOpen] = useState(false);


    return(
    <APIProvider appKey = {"AIzaSyBH0vU_pZu8o-z2JifMnzab4g4cpgAhy68"}>
        <div style={{height: "100vh", width: "100%"}}>
            <Map zoom = {9} center={position} mapId={/* Enter your custom map ID here, get it from the API webpage for your specific map. it's REQUIRED!!! */} fullscreenControl={false} onClick={()=> setOpen(true)}>
                {/*    This is where you insert your markers! */}

                {/*Example for this map peticularly: */}
                <AdvancedMarker position={position}>
                {/*    Customizing the marker? here!*/}
                    <Pin background={"grey"} borderColor={"green"} glyphColor={"blue"}></Pin>
                </AdvancedMarker>
                {open && <InfoWindow position={position} onCloseClick={()=>setOpen(false)}>
                    <p>Text description for your marker goes here</p>
                </InfoWindow> }

                <AdvancedMarker position={position}>
                    {/*    Customizing the marker? here!*/}
                    <Pin background={"grey"} borderColor={"green"} glyphColor={"blue"}></Pin>
                </AdvancedMarker>
                {open && <InfoWindow position={position} onCloseClick={()=>setOpen(false)}>
                    <p>Text description for your marker goes here</p>
                </InfoWindow> }
            {/*    This is how we render directions!:*/}
                <Directions />
            </Map>
        </div>

    </APIProvider>
    );
}

function Markers(){
    const map = useMap();
    const [marker, setMarker] = useState({
        lat: "",
        lng:"",
        compName: "",
        compDesc: "",
        missingInv: ""
    });
    const [markers, setMarkers] = useState<marker>([]);
    const [markersIndex, setMarkersIndex] = useState(0);
    const selectedMarker = markers[markersIndex];

    // Here we're supposed to call the server... somehow?
    useEffect(()=>{
        if (!map) return;
        //setting up the marker list here somehow???
        //IDK, I'm not sure how to call server here :(

    }, [map]);

}

function Directions(){
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
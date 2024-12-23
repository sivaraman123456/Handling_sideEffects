import { useCallback, useEffect, useRef, useState } from "react";

import Places from "./components/Places.jsx";
import { AVAILABLE_PLACES } from "../data.js";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "../assets/logo.png";
import { sortPlacesByDistance } from "../loc.js";

const storedIds = JSON.parse(localStorage.getItem("selectedId")) || [];
console.log(storedIds);

const pickedPlace = storedIds.map((id) =>
  AVAILABLE_PLACES.find((place) => place.id === id)
);

function App() {
 const [isModalOpen,setModalOpen]=useState(false)
  const selectedPlace = useRef();
  const [pickedPlaces, setPickedPlaces] = useState(pickedPlace);
  const [availablePlaces, setAvailablePlaces] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const soretedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        position.coords.latitude,
        position.coords.longitude
      );
      console.log(soretedPlaces);
      
      setAvailablePlaces(soretedPlaces);
    });
  }, []);

  function handleStartRemovePlace(id) {
    // modal.current.open();
    setModalOpen(true)
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
setModalOpen(false)
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });

    const storedIds = JSON.parse(localStorage.getItem("selectedId")) || [];
    if (storedIds.indexOf(id) === -1) {
      localStorage.setItem("selectedId", JSON.stringify([id, ...storedIds]));
    }
  }

 const handleRemovePlace=useCallback( function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    setModalOpen(false)
    const storedId = JSON.parse(localStorage.getItem("selectedId"));
    localStorage.setItem(
      "selectedId",
      JSON.stringify(storedId.filter((id) => id !== selectedPlace.current))
    );
  },[])
  console.log("isModalOpen>>:",isModalOpen);
  

  return (
    <>
      <Modal open={isModalOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={"Select the places you would like to visit below."}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;

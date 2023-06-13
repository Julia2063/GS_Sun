import React, { useState, useMemo, useEffect } from 'react';
import { auth, getCollection, getCollectionWhereKeyValue } from '../helpers/firebaseControl.js';
import { useNavigate } from 'react-router';
import { db } from '../firebase.js';


export const AppContext = React.createContext({
  user: null,
  setUser: () => {},
  userRole: null,
  clients: [],
  setClients: () => {},
  requests: [],
  setRequests: () => {},
  allRequests: [],
  setAllRequests: () => {},
  location: {},
  setLocation: () => {},
  locations: [],
  setLocations: () => {},
  promotions: [],
  setPromotions: () => {},
});

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [clients, setClients] = useState([]);
  const [requests, setRequests] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [location, setLocation] = useState({});
  const [locations, setLocations] = useState([]);
  const [promotions, setPromotions] = useState([]);

  const fetchLocations = async () => {
    try {
      const loadedLocations = await getCollection('locations');
      setLocations(loadedLocations);
    } catch (error) {
      console.log(error);
    }
  }

  console.log(user);

  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user || null)});
      if (user) {
        getCollectionWhereKeyValue('employees', 'uid', auth.currentUser.uid).then(res => {
          setUserRole(res[0].role)
          
          switch (res[0].role) {
            case "accountant":
              db.collection('users').onSnapshot(snapshot => {
                console.log(snapshot.docs);
                setClients(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
              });
              db.collection('requests').onSnapshot(snapshot => {
                setRequests(snapshot.docs.filter(doc => doc.data().active).map(doc => ({...doc.data(), id: doc.id})));
                setAllRequests(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})))
              });

              navigate("/clients");
              return;

            case "operator": 
            db.collection('users').onSnapshot(snapshot => {
              console.log(snapshot.docs);
              setClients(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
            });
              navigate("/changeLocation");
              return;

            case "content": 
            db.collection('promotions').onSnapshot(snapshot => {
              console.log(snapshot.docs);
              setPromotions(snapshot.docs.map(doc => ({...doc.data()})));
            });
              fetchLocations();
              navigate("/content");
              return;
          
            default: 
              navigate('notEmployees');
              return;
          }
        });
      }
    
  }, [user]);

  


  const contextValue = useMemo(() => {
    return {
      user,
      setUser,
      userRole, 
      clients,
      requests,
      allRequests,
      location,
      setLocation,
      locations,
      promotions
    };
  }, [user, userRole, clients, requests, allRequests, location, setLocation, locations, promotions]) ;

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
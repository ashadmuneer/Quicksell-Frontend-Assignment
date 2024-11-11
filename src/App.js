import React, { useCallback, useEffect, useState } from 'react';
import Header from './components/Header';
import Grid from './components/Grid';
import { loadGrid, mapUsersByUserId } from './utils';
import Loader from './components/Loader';
import './App.css';

function App() {
  const [tickets, setTickets] = useState([]);
  const [userData, setUserData] = useState({});
  const [gridData, setGridData] = useState({});
  const [grouping, setGrouping] = useState("status");
  const [ordering, setOrdering] = useState("priority");
  const [loading, setLoading] = useState(true);

  
  const saveSettings = useCallback((data) => {
    for (let key in data)
      localStorage.setItem(key, data[key]);
  }, []);

  
  const loadSettings = useCallback(() => {
    setGrouping(localStorage.getItem("grouping") || "status");
    setOrdering(localStorage.getItem("ordering") || "priority");
  }, []);

  // Load settings and fetch ticket data
  useEffect(() => {
    loadSettings();
    fetch(process.env.REACT_APP_GET_TICKETS_URL)
      .then(resp => resp.json())
      .then(res => {
        const { tickets, users } = res;
        setTickets(tickets);
        setUserData(mapUsersByUserId(users));
      })
      .catch(err => { });
  }, [loadSettings]); 

  
  useEffect(() => {
    if (!tickets.length) return;
    setGridData(loadGrid(tickets, grouping, ordering));
    setLoading(false);
  }, [grouping, ordering, tickets]);

  const onSetGrouping = useCallback((value) => {
    setLoading(true);
    setGrouping(value);
    saveSettings({ grouping: value });
  }, [saveSettings]); 
 
  const onSetOrdering = useCallback((value) => {
    setLoading(true);
    setOrdering(value);
    saveSettings({ ordering: value });
  }, [saveSettings]); 

  return (
    <div className="App">
      <Header
        grouping={grouping}
        setGrouping={onSetGrouping}
        ordering={ordering}
        setOrdering={onSetOrdering}
      />
      {loading ? <Loader /> :
        <Grid gridData={gridData} grouping={grouping} userIdToData={userData} />
      }
    </div>
  );
}

export default App;

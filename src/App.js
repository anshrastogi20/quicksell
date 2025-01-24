import React, { useState, useEffect } from 'react';
import Card from './card.js';
import './App.css';
import displayIcon from './icons/Display.svg';
import down from './icons/down.svg';
import Backlog from './icons/Backlog.svg';
import Todoicon from './icons/To-do.svg';
import inprogress from './icons/in-progress.svg';
import done from './icons/Done.svg';
import canceled from './icons/Cancelled.svg';
import nopri from './icons/No-priority.svg';
import urgent from './icons/SVG - Urgent Priority colour.svg';
import hipri from './icons/Img - High Priority.svg';
import mdpri from './icons/Img - Medium Priority.svg';
import lopri from './icons/Img - Low Priority.svg';
import add from './icons/add.svg';
import dots from './icons/3 dot menu.svg';
import usericon from './icons/user.png';

function App() {
  const initialDisplayMode = localStorage.getItem("displayMode") || "status";
  const initialSortMode = localStorage.getItem("sortMode") || "priority";
  const [displayMode, setDisplayMode] = useState(initialDisplayMode);
  const [sortMode, setSortMode] = useState(initialSortMode); 
  const [menuVisible, setMenuVisible] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.quicksell.co/v1/internal/frontend-assignment');
        if (!response.ok) throw new Error('Network response was not ok');
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleDisplayMode = (mode) => {
    setDisplayMode(mode);
    localStorage.setItem("displayMode", mode);
  };

  const toggleSortMode = (mode) => {
    setSortMode(mode);
    localStorage.setItem("sortMode", mode);
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleOutsideClick = (e) => {
    if (!e.target.closest(".display-toggle")) {
      setMenuVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleOutsideClick);
    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const sortTickets = (tickets) => {
    return tickets.sort((a, b) => {
      if (sortMode === "priority") return b.priority - a.priority;
      if (sortMode === "title") return a.title.localeCompare(b.title);
      return 0;
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  const xx=5;
  return (
    <div className="App">
    <div className="top-strip">
      <div className="display-toggle">
        <button onClick={toggleMenu} className="toggle-button">
          <img src={displayIcon} alt="Display Icon" className="button-icon" style={{ marginRight: '10px' }} />
          Display
          <img src={down} alt="Down Icon" className="button-icon" style={{ marginLeft: '6px' }} />
        </button>
        {menuVisible && (
          <div className="toggle-menu">
            <div className="menu-content">
              <div className="menu-row">
                <span className="menu-label">Grouping</span>
                <select
                  className="menu-dropdown"
                  value={displayMode}
                  onChange={(e) => toggleDisplayMode(e.target.value)}
                >
                  <option value="status">Status</option>
                  <option value="user">User</option>
                  <option value="priority">Priority</option>
                </select>
              </div>
              <div className="menu-row">
                <span className="menu-label">Sorting</span>
                <select
                  className="menu-dropdown"
                  value={sortMode}
                  onChange={(e) => toggleSortMode(e.target.value)}
                >
                  <option value="priority">Priority</option>
                  <option value="title">Title</option>
                </select>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>

      <div className="content">
        {displayMode === "status" && (
          <div className="status-view">
            {['Backlog', 'Todo', 'In progress', 'Done', 'Cancelled'].map((status) => (
              <div className="column" key={status}>
                <h2 className="header-with-icons">
                  <div className="left-content">
                    <img 
                      src={
                        status === "Backlog" ? Backlog :
                        status === "Todo" ? Todoicon :
                        status === "In progress" ? inprogress :
                        status === "Done" ? done :
                        status === "Cancelled" ? canceled :
                        null
                      } 
                      alt="Icon" 
                      className="button-icon" 
                      style={{ marginRight: '10px' }} 
                    />
                    {status} <div className="count">{data.tickets.filter(ticket => ticket.status === status).length}</div>
                  </div>
                  <div className="right-icons">
                    <img src={add} alt="Add Icon" className="button-icon" style={{ marginRight: '6px' }} />
                    <img src={dots} alt="Dots Icon" className="button-icon" style={{ marginRight: '6px' }} />
                  </div>
                </h2>
                <div className="card-list">
                  {sortTickets(data.tickets.filter(ticket => ticket.status === status)).map(ticket => (
                    <Card key={ticket.id} ticket={ticket} flag={1} user={0} statusicon={0}/>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {displayMode === "user" && (
          <div className="user-view">
            {data.users
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(user => (
                <div className="column" key={user.id}>
                  <h2 className="header-with-icons">
                    <div className="left-content">
                      <img src={usericon} alt="User Icon" className="button-icon" style={{ marginRight: '10px' }} />
                      {user.name} <div className="count">{data.tickets.filter(ticket => ticket.userId === user.id).length}</div>
                    </div>
                    <div className="right-icons">
                      <img src={add} alt="Add Icon" className="button-icon" style={{ marginRight: '6px' }} />
                      <img src={dots} alt="Dots Icon" className="button-icon" style={{ marginRight: '6px' }} />
                    </div>
                  </h2>
                  <div className="card-list">
                    {sortTickets(data.tickets.filter(ticket => ticket.userId === user.id)).map(ticket => (
                      <Card key={ticket.id} ticket={ticket} flag={1} user={1} statusicon={1}/>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}


        {displayMode === "priority" && (
          <div className="priority-view">
            {[0, 4, 3, 2, 1].map((priority) => {
              const priorityLabel = 
                priority === 0 ? "No Priority" :
                priority === 1 ? "Low Priority" :
                priority === 2 ? "Medium Priority" :
                priority === 3 ? "High Priority" :
                "Urgent";
              
              const priorityIcon = 
                priority === 0 ? nopri :
                priority === 1 ? lopri :
                priority === 2 ? mdpri :
                priority === 3 ? hipri :
                urgent;
              
              return (
                <div className="column" key={priority}>
                  <h2 className="header-with-icons">
                    <div className="left-content">
                      <img src={priorityIcon} alt="Priority Icon" className="button-icon" style={{ marginRight: '10px' }} />
                      {priorityLabel} <div className="count">{data.tickets.filter(ticket => ticket.priority === priority).length}</div>
                    </div>
                    <div className="right-icons">
                      <img src={add} alt="Add Icon" className="button-icon" style={{ marginRight: '6px' }} />
                      <img src={dots} alt="Dots Icon" className="button-icon" style={{ marginRight: '6px' }} />
                    </div>
                  </h2>
                  
                  <div className="card-list">
                    {sortTickets(data.tickets.filter(ticket => ticket.priority === priority)).map(ticket => (
                      <Card key={ticket.id} ticket={ticket} flag={0} user={0} statusicon={1}/>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
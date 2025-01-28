// Card.js
import React from 'react';
import './card.css';
import userIcon from './icons/user.png';
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

function Card({ ticket, flag , user , statusicon}) {
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-id">{ticket.id}</span>
        {user === 0 && (<img src={userIcon} alt="User Icon" className="button-icon" />)}
      </div>
      <h2 className="card-title">
      {statusicon === 1 && (<img 
          src={
            ticket.status === "Backlog" ? Backlog :
            ticket.status === "Todo" ? Todoicon :
            ticket.status === "In progress" ? inprogress :
            ticket.status === "Done" ? done :
            ticket.status === "Cancelled" ? canceled :
            null 
          } 
          alt="Icon" style={{marginRight : "6px"}}
        />)}
      {ticket.title}
      </h2>
      <div className="card-footer">
      
          {flag === 1 && (
      <span className="icon"> 
        <img 
          src={
            ticket.priority === 0 ? nopri :
            ticket.priority === 1 ? lopri :
            ticket.priority === 2 ? mdpri :
            ticket.priority === 3 ? hipri :
            ticket.priority === 4 ? urgent :
            null 
          } 
          alt="Icon" 
        />
      </span>
    )}
        <span className="feature-request">{ticket.tag.join(', ')}</span>
      </div>
    </div>
  );
}

export default Card;

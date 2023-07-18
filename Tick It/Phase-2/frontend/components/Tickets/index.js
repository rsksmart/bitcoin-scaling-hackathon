import React, { useEffect, useState } from "react";
import { Row } from "react-bootstrap";

import { readContractCalls } from "@cryptogate/react-providers";
import NFTix721 from "../../abis/NFTix721.json";

import TicketCard from "../TicketCard";
import TickitButton from "../tickitButton";
import AddExtraTicketModal from "../AddExtraTicketModal";

import styles from "./Tickets.module.scss";

const Tickets = ({
  tickets,
  contractAddress,
  isOwner,
  setRefetchEvent,
  ended,
}) => {
  // States
  const [addTicketModal, setAddTicketModal] = useState(false);
  const [ticketsCallData, setTicketsCallData] = useState([]);

  // Contract Calls
  const ticketFromContract = readContractCalls(ticketsCallData);

  // Functions
  const getTicketsFromContract = async () => {
    let ticketTypes = [];

    for (let i = 0; i < tickets.length; i++) {
      const data = {
        address: contractAddress,
        method: "ticketTypes",
        abi: NFTix721.abi,
        args: [i],
      };
      ticketTypes.push(data);
    }

    if (ticketTypes.length) {
      setTicketsCallData(ticketTypes);
    }
  };

  // Use Effects
  useEffect(() => {
    if (tickets) {
      getTicketsFromContract();
    }
  }, [tickets]);

  return (
    <>
      {addTicketModal && (
        <AddExtraTicketModal
          setAddTicket={setAddTicketModal}
          tickets={tickets}
          contractAddress={contractAddress}
          setRefetchEvent={setRefetchEvent}
        />
      )}
      <div className={styles.launchButton}>
        <p className="section-title" style={{ marginRight: "24px" }}>
          Tickets
        </p>

        {isOwner && !ended && (
          <TickitButton
            text="ADD TICKET"
            onClick={() => {
              setAddTicketModal(true);
            }}
          />
        )}
      </div>

      <Row>
        <div>
          {tickets?.map((ticket, index) => (
            <TicketCard
              key={index}
              ticket={ticket}
              allTickets={tickets}
              ended={ended}
              ticketFromContract={ticketFromContract[index]}
              isOwner={isOwner}
              setRefetchEvent={setRefetchEvent}
              contractAddress={contractAddress}
            />
          ))}
        </div>
      </Row>
    </>
  );
};

export default Tickets;

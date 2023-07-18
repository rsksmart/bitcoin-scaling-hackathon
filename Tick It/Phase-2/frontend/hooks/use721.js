import {
  writeContractCall,
  readContractCall,
} from "@cryptogate/react-providers";
import NFTix721 from "../abis/NFTix721.json";

export const use721 = ({ contractAddress }) => {
  const {
    send: addTicket,
    state: addTicketState,
    events: addTicketEvents,
    resetState: resetAddTicket,
  } = writeContractCall({
    address: contractAddress,
    abi: NFTix721.abi,
    method: "addTicketTypes",
  });

  const ticketTypeAmount = readContractCall({
    address: contractAddress,
    abi: NFTix721.abi,
    method: "ticketTypes",
  });
  const {
    send: editTicketPrice,
    state: editTicketPriceState,
    events: editTicketPriceEvents,
    resetState: resetEditTicketPrice,
  } = writeContractCall({
    address: contractAddress,
    abi: NFTix721.abi,
    method: "changeTicketPrice",
  });

  return {
    addTicket,
    addTicketState,
    addTicketEvents,
    resetAddTicket,
    ticketTypeAmount,
    editTicketPrice,
    editTicketPriceState,
    editTicketPriceEvents,
    resetEditTicketPrice,
  };
};

export const usePause = ({ contractAddress, refetchEvent }) => {
  const {
    send: pauseEvent,
    state: pauseState,
    events: pauseEventEvent,
    resetState: resetPause,
  } = writeContractCall({
    address: contractAddress,
    abi: NFTix721.abi,
    method: "pause",
  });

  const {
    send: unpauseEvent,
    state: unpauseState,
    events: unpauseEventEvent,
    resetState: resetUnpause,
  } = writeContractCall({
    address: contractAddress,
    abi: NFTix721.abi,
    method: "unpause",
  });
  const paused = readContractCall({
    address: contractAddress,
    abi: NFTix721.abi,
    method: "paused",
    enabled: refetchEvent,
  });

  return {
    pauseEvent,
    pauseState,
    pauseEventEvent,
    resetPause,
    unpauseEvent,
    unpauseState,
    unpauseEventEvent,
    resetUnpause,
    paused,
  };
};

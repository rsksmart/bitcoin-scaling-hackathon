import { writeContractCall } from "@cryptogate/react-providers";

export const useLaunchpad = () => {
  const {
    send: createEvent,
    state: createEventState,
    events: createEventEvents,
    resetState: resetCreateEventState,
  } = writeContractCall({
    contract: "NFTixLaunchpad",
    method: "createERC721",
  });

  return {
    createEvent,
    createEventState,
    createEventEvents,
    resetCreateEventState,
  };
};

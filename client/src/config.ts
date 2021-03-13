export const BINGO_NUM_LEN = 75;

const APP_CONFIG = () => {
  let url = 'http://localhost:3000';
  let socketEndpoint = 'http://localhost:3001';

  if (typeof process.env.REACT_APP_URL !== 'undefined') {
    url = process.env.REACT_APP_URL;
  }
  if (typeof process.env.REACT_APP_SOCKET_ENDPOINT !== 'undefined') {
    socketEndpoint = process.env.REACT_APP_SOCKET_ENDPOINT;
  }

  return {
    url,
    socketEndpoint,
  };
};

export const APP = APP_CONFIG();

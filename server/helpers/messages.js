import moment from 'moment'

// Format messages
const formatMessage = ( username, text ) => {
  return {
    username,
    text,
    time: moment().format( 'h:mm a' )
  };
};

export default formatMessage;

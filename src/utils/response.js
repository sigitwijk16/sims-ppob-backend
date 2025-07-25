function success(message, data = null) {
  return {
    status: 0,
    message,
    data
  };
}

function error(status, message, data = null) {
  return {
    status,
    message,
    data
  };
}

module.exports = { success, error };

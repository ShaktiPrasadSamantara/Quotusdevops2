const generateReferenceId = () => {
  return 'SENTRA-' + Date.now().toString(36).toUpperCase();
};

module.exports = { generateReferenceId };
const generateReferenceId = () => {
  return 'PCIM-' + Date.now().toString(36).toUpperCase();
};

module.exports = { generateReferenceId };
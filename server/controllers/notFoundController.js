const notFoundController = (req, res) => {
  res.status(404).json({ message: 'Not Found' });
}

export default notFoundController;

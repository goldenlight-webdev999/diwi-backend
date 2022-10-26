const Friend = require("../models/friend.model.js");

// Create and Save a new Friend
exports.create = (req, res) => {
	// Validate request
  if (!req.body) {
    res.status(400).send({
			error: true,
      message: "Content can not be empty!"
    });
  }

  // Create a Friend
  const friend = new Friend({
    name: req.body.name,
  });

  // Save Friend in the database
  Friend.create(friend, (err, data) => {
    if (err)
      res.status(500).send({
				error: true,
        message:
          err.message || "Some error occurred while creating the Friend."
      });
    else res.send({
			success: true,
			data
		});
  });
};

// Retrieve all Friends from the database (with condition).
exports.findAll = (req, res) => {
	const name = req.query.name;

  Friend.getAll(name, (err, data) => {
    if (err)
      res.status(500).send({
				error: true,
        message:
          err.message || "Some error occurred while retrieving friends."
      });
    else res.send({
			success: true,
			data
		});
  });
};

// Find a single Friend with a id
exports.findOne = (req, res) => {
	Friend.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
					error: true,
          message: `Not found Friend with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
					error: true,
          message: "Error retrieving Friend with id " + req.params.id
        });
      }
    } else res.send({
			success: true,
			data
		});
  });
};

// Update a Friend identified by the id in the request
exports.update = (req, res) => {
	// Validate Request
  if (!req.body) {
    res.status(400).send({
			error: true,
      message: "Content can not be empty!"
    });
  }

  console.log(req.body);

  Friend.updateById(
    req.params.id,
    new Friend(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
						error: true,
            message: `Not found Friend with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
						error: true,
            message: "Error updating Friend with id " + req.params.id
          });
        }
      } else res.send({
				success: true,
				data
			});
    }
  );
};

// Delete a Friend with the specified id in the request
exports.delete = (req, res) => {
	Friend.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
					error: true,
          message: `Not found Friend with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
					error: true,
          message: "Could not delete Friend with id " + req.params.id
        });
      }
    } else res.send({ 
			success: true,
			message: `Friend was deleted successfully!`
		});
  });
};

// Delete all Friends from the database.
exports.deleteAll = (req, res) => {
	Friend.removeAll((err, data) => {
    if (err)
      res.status(500).send({
				error: true,
        message:
          err.message || "Some error occurred while removing all friends."
      });
    else res.send({
			success: true,
			message: `All Friends were deleted successfully!`
		});
  });
};
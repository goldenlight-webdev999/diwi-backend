const Look = require("../models/look.model.js");
const Friend = require("../models/friend.model.js");
const Media = require("../models/media.model.js");

// Create and Save a new Look
exports.create = async (req, res) => {
	// Validate request
  if (!req.body) {
    res.status(400).send({
			error: true,
      message: "Content can not be empty!"
    });
  }

  // Create a Look
  const look = new Look({
    title: req.body.title,
    location: req.body.location,
    date: req.body.date,
    friends: req.body.friends,
    note: req.body.note,
    media: req.body.media,
  });

  /**
   * Before save, check if all of the friend ids in request exist in friends table.
   */
  const reqFriends = JSON.parse(req.body.friends);  
  let friendsErrorMessage = '';
  Friend.getAll('', (err, data) => {
    if (err) {
      friendsErrorMessage = err.message || "Some error occurred while retrieving friends."
    } else {
      reqFriends.some(id => {
        const isExist = data.some(obj => {
          return (obj.id === id)
        })
        
        if (!isExist) {
          friendsErrorMessage = `There's no friend with id:${id}`;
          return true
        }
        return false
      });
    }

    if (friendsErrorMessage) {
      res.status(500).send({
        error: true,
        message: friendsErrorMessage
      });
    } else {
      /**
       * Before save, check if media exists.
       */
      const mediaId = req.body.media;
      let mediaErrorMessage = '';
      Media.findById(mediaId, (err, data) => {
        if (err) {
          mediaErrorMessage = err.message || `Some error occurred while retrieving Media by ${mediaId}.`
        }    
        
        if (mediaErrorMessage) {
          res.status(500).send({
            error: true,
            message: mediaErrorMessage
          });
        } else {
          // Save Look in the database
          Look.create(look, (err, data) => {
            if (err)
              res.status(500).send({
                error: true,
                message:
                  err.message || "Some error occurred while creating the Look."
              });
            else res.send({
              success: true,
              data
            });
          });
        }
      });
    }

  });
};

// Retrieve all Looks from the database (with condition).
exports.findAll = (req, res) => {
	const title = req.query.title;
  const location = req.query.location;
  const note = req.query.note;

  Look.getAll(title, location, note, (err, data) => {
    if (err)
      res.status(500).send({
				error: true,
        message:
          err.message || "Some error occurred while retrieving looks."
      });
    else res.send({
			success: true,
			data
		});
  });
};

// Find a single Look with a id
exports.findOne = (req, res) => {
	Look.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
					error: true,
          message: `Not found Look with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
					error: true,
          message: "Error retrieving Look with id " + req.params.id
        });
      }
    } else res.send({
			success: true,
			data
		});
  });
};

// Update a Look identified by the id in the request
exports.update = (req, res) => {
	// Validate Request
  if (!req.body) {
    res.status(400).send({
			error: true,
      message: "Content can not be empty!"
    });
  }

  /**
   * Before update, check if all of the friend ids in request exist in friends table.
   */
   const reqFriends = JSON.parse(req.body.friends);  
   let errorMessage = '';
   Friend.getAll('', (err, data) => {
    if (err)
      errorMessage = err.message || "Some error occurred while retrieving friends."      
    else {
      reqFriends.some(id => {
        const isExist = data.some(obj => {
          return (obj.id === id)
        })
        
        if (!isExist) {
          errorMessage = `There's no friend with id:${id}`;
          return true
        }
        return false
      });
    }

    if (errorMessage) {
      res.status(500).send({
        error: true,
        message: errorMessage
      });
    } else {
      /**
       * Before save, check if media exists.
       */
      const mediaId = req.body.media;
      let mediaErrorMessage = '';
      Media.findById(mediaId, (err, data) => {
        if (err) {
          mediaErrorMessage = err.message || `Some error occurred while retrieving Media by ${mediaId}.`
        }    
        
        if (mediaErrorMessage) {
          res.status(500).send({
            error: true,
            message: mediaErrorMessage
          });
        } else {
          // Update Look in the database
          Look.updateById(
            req.params.id,
            new Look(req.body),
            (err, data) => {
              if (err) {
                if (err.kind === "not_found") {
                  res.status(404).send({
                    error: true,
                    message: `Not found Look with id ${req.params.id}.`
                  });
                } else {
                  res.status(500).send({
                    error: true,
                    message: "Error updating Look with id " + req.params.id
                  });
                }
              } else res.send({
                success: true,
                data
              });
            }
          );
        }
      });
      
    }
  });

};

// Delete a Look with the specified id in the request
exports.delete = (req, res) => {
	Look.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
					error: true,
          message: `Not found Look with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
					error: true,
          message: "Could not delete Look with id " + req.params.id
        });
      }
    } else res.send({ 
			success: true,
			message: `Look was deleted successfully!`
		});
  });
};

// Delete all Looks from the database.
exports.deleteAll = (req, res) => {
	Look.removeAll((err, data) => {
    if (err)
      res.status(500).send({
				error: true,
        message:
          err.message || "Some error occurred while removing all looks."
      });
    else res.send({
			success: true,
			message: `All Looks were deleted successfully!`
		});
  });
};
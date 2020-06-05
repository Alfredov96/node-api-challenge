const express = require('express');
const actions = require('./data/helpers/actionModel.js');
const projects = require('./data/helpers/projectModel.js');


const router = express.Router();


router.get('/', (req, res) => {

    actions.get()
        .then( actions => {
            res.status(200).send(actions);
        })
        .catch( err => {
            res.status(500).json({success: false, err});
        });


});

router.get('/:id', (req, res) => {

    const { id } = req.params

    actions.get(id)
        .then( action => {
            action ? res.status(200).send(action) : res.status(404).send("404 not found")
        })
        .catch( err => {
            res.status(500).json({success: false, err});
        });


});

router.post('/', validatePost, (req, res) => {

    const newAction = req.body;

    actions.insert(newAction)
        .then( action => {
            res.status(201).json({success: true, action});
        })
        .catch( err => {
            res.status(500).json({success: false, message: err.message})
        });
});

router.put('/:id', validatePut, (req, res) => {

    const { id } = req.params;
    const updatedAction = req.body

    actions.update(id, updatedAction)
        .then( action => {
            action? res.status(201).json({success: true, action}) : res.status(404).send("404 not found")
        })
        .catch( error => {
            res.status(500).json({success: false, error});
        });
});

router.delete('/:id', (req, res) => {

    const { id } = req.params;

    actions.remove(id)
        .then( action => {
            res.status(204).json({success: true});
        })
        .catch(error => {
            res.status(500).json({success: false, error})
        });
});


function validatePost( req, res, next ) {

    let id = req.body.project_id;
    
    projects.get(id)
        .then( project => {
            if(project) {

                if(!req.body){

                    res.status(400).json({message: "missing action data"});
                  }
                else {
                    if(!req.body.hasOwnProperty('description') || !req.body.hasOwnProperty('notes') || !req.body.hasOwnProperty('project_id')){
                
                      res.status(400).json({message: "missing required description, or notes field"});
                    }
                    else{
                      next();
                    }
                }
            }
            else {
                res.status(404).json({message: "the project does not exist", project, body: id});
            }
        })
        .catch( error => {
            res.status(500).json({success: false, error});
        });
    
   
}

function validatePut( req, res, next ) {

    if(!req.body){

        res.status(400).json({message: "missing actions data"});
      }
      else {
        if(!req.body.hasOwnProperty('description') && !req.body.hasOwnProperty('notes')){
    
          res.status(400).json({message: "missing required notes or description field"});
        }
        else{
          next();
        }
      }
}

module.exports = router;
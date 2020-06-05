const express = require('express');
const projects = require('./data/helpers/projectModel.js');

const router = express.Router();


router.get('/', (req, res) => {

    projects.get()
    .then( projects => {

        res.status(200).send(projects);
    })
    .catch(error => {

        res.status(500).json({errorMessage: "error", error});
    });
});

router.get('/:id', (req, res) => {

    const { id } = req.params;

    projects.get(id)
    .then( project => {

        project? res.status(200).send(project) : res.status(404).send("404 not found")
    })
    .catch(error => {

        res.status(500).json({errorMessage: "error", error});
    });
});

router.get('/:id/actions', (req, res) => {

    const { id } = req.params;

    projects.get(id)
    .then( project => {

       project ? res.status(200).send(project.actions) :  res.status(404).send("404 not found")
    })
    .catch(error => {

        res.status(500).json({errorMessage: "error", error});
    });
})


router.post('/', validatePost, (req, res) => {

    const project = req.body;

    projects.insert(project)
        .then( project => {
            res.status(201).json({sucess: true, project});
        })
        .catch( err => {
            res.status(500).json({sucess: false, err})
        });
});

router.put('/:id', validatePut, (req, res) => {

    const { id } = req.params;
    const projectInfo = req.body;

    projects.update(id, projectInfo)
        .then( project => {

            project ? res.status(201).json({success: true, project}) : res.status(404).send("404 not found")
        })
        .catch( error => {
            res.status(500).json({success: false, error});
        });

});

router.delete('/:id' , (req, res) => {

    const { id } = req.params;


    projects.remove(id)
        .then( project => {
            res.status(204).json({success: true, project});
        })
        .catch( error => {
            res.status(500).json({success: false, error})
        });
});

function validatePost( req, res, next ) {

    if(!req.body){

        res.status(400).json({message: "missing user data"});
      }
      else {
        if(!req.body.hasOwnProperty('name') || !req.body.hasOwnProperty('description')){
    
          res.status(400).json({message: "missing required name or description field"});
        }
        else{
          next();
        }
      }
}

function validatePut( req, res, next ) {

    if(!req.body){

        res.status(400).json({message: "missing user data"});
      }
      else {
        if(!req.body.hasOwnProperty('name') && !req.body.hasOwnProperty('description')){
    
          res.status(400).json({message: "missing required name or description field"});
        }
        else{
          next();
        }
      }
}


module.exports = router;
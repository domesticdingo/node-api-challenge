const express = require('express');

const Projects = require('../data/helpers/projectModel');
const Actions = require('../data/helpers/actionModel');

const router = express.Router();

//Checking that project ID exists in database
const validateProjId = (req, res, next) => {
    const project = req.params.id;

    Projects.get(project)
        .then(proj => {
            if (!proj) {
                res.status(400).json({ error: "The project ID does not exist in the database." })
            } else {
                next();
            }
        })
}

//Checks that project has a name and description
const validateProj = (req, res, next) => {
    const project = req.body;

    if (!project.name || !project.description) {
        res.status(400).json({ error: "Please provide a name and description with a project." })
    } else {
        next();
    }
}

//Checks that action has necessary properties of project_id, description (limit 128 characters), notes
const validateAction = (req, res, next) => {
    const action = req.body;

    if (!action.project_id || !action.description || !action.notes) {
        res.status(400).json({ error: "Please check action has all necessary requirements. Expecting a project ID, description, and notes." })
    } else if (action.description.length < 128) {
        next();
    } else {
        res.status(400).json({ error: "Error adding action. Description has a character limit of 128 characters." })
    }
}

//Show all projects +
router.get('/', (req, res) => {
    Projects.get()
        .then(proj => res.status(200).json(proj))
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "There was an error getting the list of projects." })
        })
})

//Show a project based on its ID +
router.get('/:id', validateProjId, (req, res) => {
    const id = req.params.id

    Projects.get(id)
        .then(proj => res.status(200).json(proj))
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "There was an error getting that project." })
        })
})

//Create new project +
router.post('/', validateProj, (req, res) => {
    const project = req.body;

    Projects.insert(project)
        .then(proj => res.status(200).json(proj))
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "There was an error adding a project." })
        })
})

//Update a project +
router.put('/:id', validateProj, validateProjId, (req, res) => {
    const project = req.params.id;
    const update = req.body;

    Projects.update(project, update)
        .then(proj => res.status(200).json(proj))
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "There was an error updating the project." })
        })
})

//Delete a project +
router.delete('/:id', validateProjId, (req, res) => {
    const id = req.params.id;

    Projects.remove(id)
        .then(proj => res.status(200).json(proj))
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "There was an error deleting the project." })
        })
})

//Get all actions for a project +
router.get('/:id/actions', validateProjId, (req, res) => {
    project = req.params.id;

    Projects.getProjectActions(project)
        .then(act => res.status(200).json(act))
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "There was an error getting the actions for that project." })
        })
})

//Add action for a project +
router.post('/:id/actions', validateProjId, validateAction, (req, res) => {
    action = req.body;

    Actions.insert(action)
        .then(act => res.status(200).json(act))
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "There was an error adding an action to the project." })
        })
})

//Update action for a project
// router.put('/:id/actions', validateProjId, validateAction, (req, res) => {
//     action = req.body;
//     id = req.params.id;

//     Actions.update(id, action)
//         .then(act => res.status(200).json(act))
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({ error: "There was an error updating the action." })
//         })
// })

//Delete action for a project +
router.delete('/:id/actions', validateProjId, (req, res) => {
    id = req.params.id;

    Actions.remove(id)
        .then(act => res.status(200).json(act))
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "There was an error deleting the action." })
        })
})


module.exports = router;
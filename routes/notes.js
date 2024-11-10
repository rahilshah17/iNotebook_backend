const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser.js');
const Notes = require('../models/Notes.js');
const { body, validationResult, header } = require('express-validator');

router.get('/fetchallnotes', fetchuser, async (req,res)=> {
    const notes = await Notes.find({user: req.user.id});
    res.json(notes);
})

router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').exists(),
    body('description', 'Enter a valid description').isLength({min: 5})
], async (req,res)=> {
    
    const {title, description, tag} = req.body;
    
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }
    try {
        const note = new Notes({
            title, description, tag, user:req.user.id
        })
        
        const savedNote = await note.save();
        res.json(note);    
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Something went wrong");
    }
    
})

router.put('/updatenote/:id', fetchuser, async (req,res)=> {
    const {title, description, tag} = req.body;
    const newNote = {};
    if (title) newNote.title = title;
    if (description) newNote.description = description;
    if (tag) newNote.tag = tag;

    note = await Notes.findById(req.params.id);
    if (!note) {
        return res.status(404).send("Not found");
    }

    if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
    }
    
    note = await Notes.findByIdAndUpdate(req.params.id, {$set :  newNote}, {new: true});
    res.json(newNote);
})

router.delete('/deletenote/:id', fetchuser, async (req,res)=> {

    note = await Notes.findById(req.params.id);
    if (!note) {
        return res.status(404).send("Not found");
    }

    if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
    }
    
    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({"status":"Successfully deleted"});
})
module.exports = router
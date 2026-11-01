import express from "express";
import Note from "../models/Note.js";

const router = express.Router()

router.get("/", async (req, res) => {
    try {
        const notes = await Note.find().sort({ updatedAt: -1});

        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch notes",
            error: error.message
        });
    }
});
 
router.get("/:id", async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({
                message: "NOte not found"
            });

        }

        res.status(200).json(note);
    } catch (error) {
        res.status(400).json({
            mesage: "Invalid note Id",
            error: error.message
        });
    }
});

router.post("/", async (req, res) => {
    try {
        const {title, content, author} = req.body;

        const newNote = new Note({
            title,
            content,
            author
        });

        const savedNote = await newNote.save();

        res.status(201).json(savedNote);
    } catch (error) {
        res.status(400).json({
            message: "Failed to create note",
            error: error.message
        })
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { title, content, author } = req.body;

        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            { title, content, author },
            { new: true, runValidators: true }
        );

        if (!updatedNote) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        res.status(200).json(updatedNote);
    } catch (error) {
        res.status(400).json({
            message: "Failed to update note",
            error: error.message
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const deletedNote = await Note.findByIdAndDelete(
            req.params.id
        );

        if (!deletedNote) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        res.status(200).json({
            message: "note deleted successfully"
        });
    } catch (error) { 
        res.status(400).json({
            message: "failed to delete note",
            error: error.message
        });
    }
});

export default router;
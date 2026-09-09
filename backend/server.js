const express = require("express");
const cors = require("cors");

const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());

let applications = [
    {
        id: 1,
        company: "Accenture",
        role: "Software Engineer",
        status: "Applied",
        date: "2026-09-09"
    },
    {
        id: 2,
        company: "Infosys",
        role: "DevOps Engineer",
        status: "Interview",
        date: "2026-09-08"
    },
    {
        id: 3,
        company: "TCS",
        role: "Graduate Engineer",
        status: "Rejected",
        date: "2026-09-05"
    }
];

app.get("/", (req, res) => {
    res.json({
        message: "DevOpsHub backend is running 🚀"
    });
});

app.get("/api/applications", (req, res) => {
    res.json(applications);
});

app.post("/api/applications", (req, res) => {

    const newApplication = {
        id: Date.now(),
        company: req.body.company,
        role: req.body.role,
        status: req.body.status,
        date: req.body.date
    };

    applications.push(newApplication);

    res.status(201).json(newApplication);
});

app.delete("/api/applications/:id", (req, res) => {

    const id = Number(req.params.id);

    applications = applications.filter(
        application => application.id !== id
    );

    res.json({
        message: "Application deleted"
    });
});

app.listen(PORT, () => {
    console.log(`DevOpsHub server running on port ${PORT}`);
});
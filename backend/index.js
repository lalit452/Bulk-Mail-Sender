const express = require('express');
const cors = require('cors');
const mailRoutes = require('./routes/mailRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

app.use('/api/mails', mailRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
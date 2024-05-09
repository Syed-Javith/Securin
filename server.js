const express = require('express');
const app = express();
const axios = require('axios');
const mongoose = require('mongoose');
const CVE = require('./cve.schema');
const cors = require('cors');
app.use(cors())
const connectToDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/securin');
        console.log("connected");
    } catch (error) {
        console.log(error);
    }
}

connectToDB();

app.get('/', async (req,res)=>{
    try {
        const data = await axios.get('https://services.nvd.nist.gov/rest/json/cves/2.0');
        if(data.data){
            console.log(data.data.vulnerabilities);
            const res = await CVE.insertMany(data.data.vulnerabilities)
            if(res){
                console.log('Inserted')
            }
        }
    } catch (error) {
        console.log(error);
    }
})

app.get('/get', async (req,res)=>{
    try {
        const data = await CVE.find({},{
          "cve.id": 1,
          "cve.sourceIdentifier": 1,
          "cve.published": 1,
          "cve.lastModified": 1,
          "cve.vulnStatus": 1 })
        if(data)
            return res.status(200).send(data)
        return res.status(404).send({message:"Not Found"})
    } catch (error) {
        console.log(error);
    }
})

app.listen(5000,()=>{
    console.log("Port Connected!!");
})
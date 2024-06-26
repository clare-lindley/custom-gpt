import express from 'express';

const app = express();

app.use(express.json());

const requestList = new Map()

/**
 * @todo what if GPT sesh has expired?
 * @todo what if we can't find the request id in the list of requests?
 */

app.get("/test", (_, res) => {
    res.status(200)
    res.send({})
});


app.post("/incoming", (req, res) => {
    const body = req.body
    const requestId = Math.ceil(Math.random(0,1) * 10000).toString();
    requestList.set(requestId,res)
    callZapier(requestId, body)
});

// fire and forget to this webhook. When it's ready it will call our /outgoing endpoint (we need to configure Zapier to do that!)
function callZapier(requestId, body){
    console.log('calling zapier')
    console.log('requestId ', requestId);
}

// Zapier is configured to call this with the data we care about
app.post("/outgoing", (req, res) => {
    const body = req.body
    const requestId = body.requestId // also contains the data we care about
    const chatGPTResponse = requestList.get(requestId)
    chatGPTResponse.send({score: '100%'});
    res.status(200)
    res.send({})
    requestList.delete(requestId)
})

app.listen(8080)

module.exports = app
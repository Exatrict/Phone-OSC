import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Mobile device connected!');

  ws.on('message', (message) => {
    // Parse the incoming data from the phone
    const gyroData = JSON.parse(message);
    console.log('Gyro Data Received:', gyroData);

    // Optional: Broadcast this data to your Vite frontend preview
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === 1) {
        client.send(JSON.stringify(gyroData));
      }
    });
  });

  ws.on('close', () => console.log('Mobile disconnected'));
});
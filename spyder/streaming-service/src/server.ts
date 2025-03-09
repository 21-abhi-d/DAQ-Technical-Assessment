import net from "net";
import { WebSocket, WebSocketServer } from "ws";

interface VehicleData {
  battery_temperature: number;
  timestamp: number;
}

const TCP_PORT = 12000;
const WS_PORT = 8080;
const tcpServer = net.createServer();
const websocketServer = new WebSocketServer({ port: WS_PORT });

const SAFE_TEMP_MIN = 20;
const SAFE_TEMP_MAX = 80;
const VIOLATION_THRESHOLD = 3;
const VIOLATION_TIME_WINDOW = 5000;

let temperatureViolations: number[] = [];

tcpServer.on("connection", (socket) => {
  console.log("TCP client connected");

  socket.on("data", (msg) => {
    const message: string = msg.toString();
    console.log(`Received: ${message}`);

    try {
      const parsedData = JSON.parse(message);

      if (typeof parsedData.battery_temperature === "number" && !isNaN(parsedData.battery_temperature)) {
        const currentTimestamp = parsedData.timestamp || Date.now();

        const formattedTemp = Math.round(parsedData.battery_temperature * 1000) / 1000;

        const cleanData: VehicleData = {
          battery_temperature: formattedTemp,
          timestamp: currentTimestamp,
        };

        console.log(`Formatted Temperature: ${formattedTemp}°C`);

        if (formattedTemp < SAFE_TEMP_MIN || formattedTemp > SAFE_TEMP_MAX) {
          temperatureViolations.push(currentTimestamp);
        }

        temperatureViolations = temperatureViolations.filter(
          (timestamp) => currentTimestamp - timestamp <= VIOLATION_TIME_WINDOW
        );

        if (temperatureViolations.length > VIOLATION_THRESHOLD) {
          console.error(`[ALERT] Battery temperature exceeded safe range 3+ times in 5s!`);
          console.error(`Timestamp: ${new Date(currentTimestamp).toISOString()}`);
        }

        if (formattedTemp >= SAFE_TEMP_MIN && formattedTemp <= SAFE_TEMP_MAX) {
          websocketServer.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(cleanData));
            }
          });
        } else {
          console.warn(`Skipping out-of-range temperature: ${formattedTemp}°C`);
        }
      } else {
        console.warn("Invalid battery_temperature received, must be a valid number.");
      }
    } catch (error) {
      console.error("JSON parsing error:", error);
    }
  });

  socket.on("end", () => {
    console.log("Closing connection with the TCP client");
  });

  socket.on("error", (err) => {
    console.error("TCP client error:", err);
  });
});

websocketServer.on("listening", () =>
  console.log(`WebSocket server started on port ${WS_PORT}`)
);

websocketServer.on("connection", async (ws: WebSocket) => {
  console.log("Frontend websocket client connected");
  ws.on("error", console.error);
});

tcpServer.listen(TCP_PORT, () => {
  console.log(`TCP server listening on port ${TCP_PORT}`);
});

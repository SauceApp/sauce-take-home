import { schema } from "./gql/schema";
import { createYoga } from "graphql-yoga";
import { createServer } from "http";
import { CloseCode, makeServer } from "graphql-ws";
import { WebSocketServer } from "ws";

const yoga = createYoga({ schema });
const server = createServer(yoga);

const wsServer = new WebSocketServer({
  server,
  path: "/graphql",
});

const wsGraphQLServer = makeServer({ schema });

wsServer.on("connection", (socket, request) => {
  const closed = wsGraphQLServer.opened(
    {
      protocol: socket.protocol,
      send: (data) =>
        new Promise((resolve, reject) => {
          socket.send(data, (err: unknown) => (err ? reject(err) : resolve()));
        }),
      close: (code, reason) => socket.close(code, reason),
      onMessage: (cb) =>
        socket.on("message", async (event) => {
          try {
            await cb(event.toString());
          } catch (err) {
            const errorMessage =
              err instanceof Error ? err.message : String(err);
            socket.close(CloseCode.InternalServerError, errorMessage);
          }
        }),
    },
    { socket, request }
  );

  socket.once("close", (code, reason) => closed(code, reason.toString()));
});

server.listen(4000, () => {
  console.info("Server is running on http://localhost:4000/graphql");
});

import express from 'express';
import * as http from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';

import Socket from './routes/socket';
import * as dotenv from 'dotenv';

export default class BingoServer {
  private app!: express.Application;
  private httpServer!: http.Server;
  private port!: string | number;
  private clientOrigins: Array<string> = [];
  private socket!: Socket;

  constructor() {
    this.createApp();
    this.useMiddlewaer();
    this.config();
  }

  private createApp(): void {
    this.app = express();
  }

  private config(): void {
    dotenv.config({ path: path.join(__dirname, '../../.env') });

    this.port = process.env.SERVER_PORT || '3000';

    // クライアント側のオリジンをセット
    this.clientOrigins.push(`http://${process.env.CLIENT_URL}`);
    if ('production' === this.app.get('env')) {
      this.clientOrigins.push(`http://${process.env.CLIENT_URL}:80`);
      this.clientOrigins.push(`https://${process.env.CLIENT_URL}:443`);
    }
  }

  private useMiddlewaer(): void {
    this.app.use(bodyParser.json());
    this.app.use(cors());
  }

  public listen() {
    try {
      this.httpServer = this.app.listen(this.port, () =>
        console.log(`Listening on port ${this.port}!`)
      );

      this.app.use(express.static(path.resolve('./', 'public')));

      // start socketIO
      this.socket = new Socket(this.httpServer, this.clientOrigins);
      this.socket.start();

      this.app.get('*', function (req, res) {
        res.sendFile(path.resolve('./', 'public', 'index.html'));
      });
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  }
}

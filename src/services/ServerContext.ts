import { ILog, MockLog } from "@jsq/jsq-lib-core/build/Log";
import { ServerContextBase } from "@jsq/jsq-lib-core/build/ServerContextBase";

export interface IServerContext {
  log: ILog;
}

export class ServerContext extends ServerContextBase implements IServerContext {
  private constructor(public readonly log: ILog) {
    super(log);
  }

  static async create(log: ILog): Promise<ServerContext> {
    // Create any downstream services/clients here and include them in the ctor call

    return new ServerContext(log);
  }
}

export class MockServerContext implements IServerContext {
  log = new MockLog();
}

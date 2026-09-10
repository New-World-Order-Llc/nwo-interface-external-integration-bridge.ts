import { ExternalIntegrationSchema } from "beast-contracts/interface";
import { publishEvent } from "../data/EventPublisher";

export class ExternalIntegrationBridge {
  deliver(externalEnvelope) {
    const valid = ExternalIntegrationSchema.safeParse(externalEnvelope);
    if (!valid.success) throw new Error("Invalid external integration envelope");

    const { targetSystem, uiState, requestId } = valid.data;

    const packet = {
      id: crypto.randomUUID(),
      requestId,
      targetSystem,
      payload: this.formatForExternal(uiState),
      deliveredAt: new Date().toISOString()
    };

    publishEvent("interface.external.delivered", packet);
    return packet;
  }

  formatForExternal(uiState) {
    return {
      entityId: uiState.id,
      name: uiState.name,
      status: uiState.status,
      metadata: uiState.metadata,
      lastUpdated: uiState.lastUpdated
    };
  }
}

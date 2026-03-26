import MESSAGES, { MESSAGES as namedMessages } from './messages';
import { VMapEvents } from './events';

describe('utility constants', () => {
  it('exports lifecycle messages as named and default export', () => {
    expect(MESSAGES).toBe(namedMessages);
    expect(MESSAGES.COMPONENT_CONNECTED_CALLBACK).toBe('connectedCallback');
    expect(MESSAGES.COMPONENT_DID_LOAD).toBe('componentDidLoad');
  });

  it('exports the public v-map event names', () => {
    expect(VMapEvents.Ready).toBe('ready');
    expect(VMapEvents.MapProviderReady).toBe('map-provider-ready');
    expect(VMapEvents.MapProviderWillShutdown).toBe('map-provider-will-shutdown');
  });
});

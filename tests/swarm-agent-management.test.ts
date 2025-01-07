import { describe, it, expect, beforeEach } from 'vitest';

// Simulated contract state
let agentCount = 0;
const agents = new Map();

// Simulated contract functions
function createAgent(configuration: string, sender: string) {
  const agentId = ++agentCount;
  agents.set(agentId, {
    owner: sender,
    configuration,
    performance: 0,
    lastUpdate: Date.now()
  });
  return agentId;
}

function updateAgent(agentId: number, newConfiguration: string, performance: number, sender: string) {
  const agent = agents.get(agentId);
  if (!agent) throw new Error('Invalid agent');
  if (agent.owner !== sender) throw new Error('Not authorized');
  agent.configuration = newConfiguration;
  agent.performance = performance;
  agent.lastUpdate = Date.now();
  agents.set(agentId, agent);
  return true;
}

describe('Swarm Agent Management Contract', () => {
  beforeEach(() => {
    agentCount = 0;
    agents.clear();
  });
  
  it('should create a new agent', () => {
    const agentId = createAgent('initial_config', 'user1');
    expect(agentId).toBe(1);
    expect(agents.size).toBe(1);
    const agent = agents.get(agentId);
    expect(agent.configuration).toBe('initial_config');
    expect(agent.performance).toBe(0);
  });
  
  it('should update an agent', () => {
    const agentId = createAgent('initial_config', 'user2');
    expect(updateAgent(agentId, 'updated_config', 10, 'user2')).toBe(true);
    const agent = agents.get(agentId);
    expect(agent.configuration).toBe('updated_config');
    expect(agent.performance).toBe(10);
  });
  
  it('should not allow unauthorized updates', () => {
    const agentId = createAgent('initial_config', 'user3');
    expect(() => updateAgent(agentId, 'unauthorized_update', 5, 'user4')).toThrow('Not authorized');
  });
});


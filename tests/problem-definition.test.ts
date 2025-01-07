import { describe, it, expect, beforeEach } from 'vitest';

// Simulated contract state
let problemCount = 0;
const problems = new Map();

// Simulated contract functions
function createProblem(description: string, parameters: string[], evaluationCriteria: string, creator: string) {
  const problemId = ++problemCount;
  problems.set(problemId, {
    creator,
    description,
    parameters,
    evaluationCriteria,
    status: 'open',
    bestSolution: null
  });
  return problemId;
}

function updateProblemStatus(problemId: number, newStatus: string, updater: string) {
  const problem = problems.get(problemId);
  if (!problem) throw new Error('Invalid problem');
  if (problem.creator !== updater) throw new Error('Not authorized');
  problem.status = newStatus;
  problems.set(problemId, problem);
  return true;
}

function setBestSolution(problemId: number, solutionId: number, setter: string) {
  const problem = problems.get(problemId);
  if (!problem) throw new Error('Invalid problem');
  if (problem.creator !== setter) throw new Error('Not authorized');
  problem.bestSolution = solutionId;
  problems.set(problemId, problem);
  return true;
}

describe('Problem Definition Contract', () => {
  beforeEach(() => {
    problemCount = 0;
    problems.clear();
  });
  
  it('should create a new problem', () => {
    const problemId = createProblem('Test problem', ['param1', 'param2'], 'Evaluation criteria', 'user1');
    expect(problemId).toBe(1);
    expect(problems.size).toBe(1);
    const problem = problems.get(problemId);
    expect(problem.description).toBe('Test problem');
    expect(problem.status).toBe('open');
  });
  
  it('should update problem status', () => {
    const problemId = createProblem('Another problem', ['param1'], 'Criteria', 'user2');
    expect(updateProblemStatus(problemId, 'closed', 'user2')).toBe(true);
    const problem = problems.get(problemId);
    expect(problem.status).toBe('closed');
  });
  
  it('should set best solution', () => {
    const problemId = createProblem('Third problem', ['param1', 'param2', 'param3'], 'Complex criteria', 'user3');
    expect(setBestSolution(problemId, 5, 'user3')).toBe(true);
    const problem = problems.get(problemId);
    expect(problem.bestSolution).toBe(5);
  });
  
  it('should not allow unauthorized updates', () => {
    const problemId = createProblem('Secure problem', ['param1'], 'Secure criteria', 'user4');
    expect(() => updateProblemStatus(problemId, 'closed', 'user5')).toThrow('Not authorized');
    expect(() => setBestSolution(problemId, 3, 'user5')).toThrow('Not authorized');
  });
});


import { describe, it, expect, beforeEach } from 'vitest';

// Simulated contract state
let solutionCount = 0;
const solutions = new Map();

// Mock problem-definition contract
const mockProblemDefinition = {
  getProblem: (id: number) => ({ creator: 'problem_creator' })
};

// Simulated contract functions
function submitSolution(problemId: number, solutionData: string, solver: string) {
  const solutionId = ++solutionCount;
  solutions.set(solutionId, {
    problemId,
    solver,
    solutionData,
    score: 0,
    timestamp: Date.now()
  });
  return solutionId;
}

function evaluateSolution(solutionId: number, score: number, evaluator: string) {
  const solution = solutions.get(solutionId);
  if (!solution) throw new Error('Invalid solution');
  const problem = mockProblemDefinition.getProblem(solution.problemId);
  if (problem.creator !== evaluator) throw new Error('Not authorized');
  solution.score = score;
  solutions.set(solutionId, solution);
  return true;
}

describe('Solution Evaluation Contract', () => {
  beforeEach(() => {
    solutionCount = 0;
    solutions.clear();
  });
  
  it('should submit a new solution', () => {
    const solutionId = submitSolution(1, 'solution_data', 'solver1');
    expect(solutionId).toBe(1);
    expect(solutions.size).toBe(1);
    const solution = solutions.get(solutionId);
    expect(solution.solutionData).toBe('solution_data');
    expect(solution.score).toBe(0);
  });
  
  it('should evaluate a solution', () => {
    const solutionId = submitSolution(1, 'solution_data', 'solver2');
    expect(evaluateSolution(solutionId, 85, 'problem_creator')).toBe(true);
    const solution = solutions.get(solutionId);
    expect(solution.score).toBe(85);
  });
  
  it('should not allow unauthorized evaluation', () => {
    const solutionId = submitSolution(1, 'solution_data', 'solver3');
    expect(() => evaluateSolution(solutionId, 90, 'unauthorized_user')).toThrow('Not authorized');
  });
});


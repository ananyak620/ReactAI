/**
 * Working Memory & Execution Buffer for the Autonomous Agent
 */
export class AgentMemory {
  constructor(goal) {
    this.goal = goal;
    this.startTime = Date.now();
    this.steps = [];
    this.extractedKnowledge = [];
    this.createdArtifacts = [];
  }

  addStep(step) {
    this.steps.push({
      ...step,
      timestamp: Date.now()
    });
  }

  recordArtifact(filename, details = {}) {
    this.createdArtifacts.push({
      filename,
      ...details,
      createdAt: new Date().toISOString()
    });
  }

  getRecentObservations(limit = 4) {
    return this.steps
      .slice(-limit)
      .map(s => ({
        step: s.stepNumber,
        action: s.action,
        observation: s.observation
      }));
  }

  formatHistoryForPrompt() {
    if (this.steps.length === 0) return 'No previous steps taken.';

    return this.steps
      .map((s) => {
        return `Step ${s.stepNumber}:
Thought: ${s.thought}
Action: ${s.action}
Action Input: ${JSON.stringify(s.actionInput)}
Observation: ${typeof s.observation === 'object' ? JSON.stringify(s.observation).slice(0, 1000) : String(s.observation).slice(0, 1000)}`;
      })
      .join('\n\n');
  }

  getSummary() {
    return {
      goal: this.goal,
      totalSteps: this.steps.length,
      durationMs: Date.now() - this.startTime,
      artifacts: this.createdArtifacts
    };
  }
}

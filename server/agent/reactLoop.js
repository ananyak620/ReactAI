import { TOOL_DEFINITIONS, executeTool } from '../tools/registry.js';
import { AgentMemory } from './memory.js';
import { getNextAgentStep } from './reasoningEngine.js';

/**
 * Core ReAct Autonomous Loop
 * Reads input/web, Reasons next action, and Reacts via tool execution.
 * Loops automatically without requiring human interaction for each step.
 */
export async function runReActAgent({
  goal,
  maxSteps = 8,
  config = {},
  onEvent = () => {},
  abortSignal = null
}) {
  const memory = new AgentMemory(goal);
  const startTime = Date.now();

  onEvent({
    type: 'agent_start',
    data: {
      goal,
      maxSteps,
      timestamp: startTime,
      toolsAvailable: TOOL_DEFINITIONS.map(t => t.name)
    }
  });

  let currentStep = 1;
  let isCompleted = false;
  let finalAnswer = '';

  try {
    while (currentStep <= maxSteps && !isCompleted) {
      if (abortSignal?.aborted) {
        onEvent({
          type: 'agent_aborted',
          data: { message: 'Agent loop was aborted by the user.' }
        });
        return { success: false, aborted: true, memory: memory.getSummary() };
      }

      onEvent({
        type: 'step_start',
        data: { stepNumber: currentStep }
      });

      // 1. REASON: Decide next action based on goal, memory, and previous observations
      const stepDecision = await getNextAgentStep({
        goal,
        memory,
        toolDefinitions: TOOL_DEFINITIONS,
        config
      });

      // Emit Thought
      onEvent({
        type: 'thought',
        data: {
          stepNumber: currentStep,
          thought: stepDecision.thought
        }
      });

      // Check for Finish condition
      if (stepDecision.isFinish || stepDecision.action?.toLowerCase() === 'finish') {
        isCompleted = true;
        finalAnswer = stepDecision.finalAnswer || 'Task completed successfully.';
        
        memory.addStep({
          stepNumber: currentStep,
          thought: stepDecision.thought,
          action: 'Finish',
          actionInput: null,
          observation: 'Objective fulfilled.'
        });

        onEvent({
          type: 'finish',
          data: {
            stepNumber: currentStep,
            finalAnswer,
            totalSteps: currentStep,
            durationMs: Date.now() - startTime
          }
        });
        break;
      }

      // 2. REACT: Execute selected Action / Tool
      const toolName = stepDecision.action;
      const toolInput = stepDecision.actionInput || {};

      onEvent({
        type: 'action',
        data: {
          stepNumber: currentStep,
          tool: toolName,
          input: toolInput
        }
      });

      const toolStartTime = Date.now();
      const toolResult = await executeTool(toolName, toolInput);
      const toolDuration = Date.now() - toolStartTime;

      // 3. READ: Process Observation returned by tool
      onEvent({
        type: 'observation',
        data: {
          stepNumber: currentStep,
          tool: toolName,
          result: toolResult,
          durationMs: toolDuration
        }
      });

      // Record any file artifact created
      if (toolName === 'file_writer' && toolResult.success) {
        memory.recordArtifact(toolResult.filename, toolResult);
        onEvent({
          type: 'artifact_created',
          data: toolResult
        });
      }

      // Record step in working memory
      memory.addStep({
        stepNumber: currentStep,
        thought: stepDecision.thought,
        action: toolName,
        actionInput: toolInput,
        observation: toolResult
      });

      currentStep++;
    }

    if (!isCompleted) {
      finalAnswer = `Max step threshold (${maxSteps}) reached. Summary of findings: ${memory.steps.length} actions executed autonomously.`;
      onEvent({
        type: 'finish',
        data: {
          stepNumber: currentStep - 1,
          finalAnswer,
          totalSteps: currentStep - 1,
          durationMs: Date.now() - startTime,
          hitMaxSteps: true
        }
      });
    }

    return {
      success: true,
      finalAnswer,
      summary: memory.getSummary(),
      steps: memory.steps
    };
  } catch (error) {
    onEvent({
      type: 'agent_error',
      data: { error: error.message }
    });
    return {
      success: false,
      error: error.message
    };
  }
}

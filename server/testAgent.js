import { runReActAgent } from './agent/reactLoop.js';

async function testFlight() {
  console.log('--- Testing Autonomous ReAct Flight Booking ---');
  const goal = 'Book flight from Bangalore to Patna on 25th October under 6000 INR';

  const result = await runReActAgent({
    goal,
    maxSteps: 5,
    config: { provider: 'builtin' },
    onEvent: (event) => {
      if (event.type === 'thought') {
        console.log(`\n[STEP ${event.data.stepNumber}] 🧠 THOUGHT:`, event.data.thought);
      } else if (event.type === 'action') {
        console.log(`[STEP ${event.data.stepNumber}] ⚡ ACTION:`, event.data.tool, event.data.input);
      } else if (event.type === 'observation') {
        console.log(`[STEP ${event.data.stepNumber}] 👁️ OBSERVATION SUCCESS:`, event.data.result?.success);
      } else if (event.type === 'artifact_created') {
        console.log(`📁 ARTIFACT CREATED:`, event.data.filename);
      } else if (event.type === 'finish') {
        console.log('\n🏁 [FINISH] Final Answer:\n', event.data.finalAnswer);
      }
    }
  });

  console.log('\nAutonomous Execution Succeeded:', result.success);
}

testFlight();

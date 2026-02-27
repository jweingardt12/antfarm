export interface Run {
  id: string;
  run_number: number | null;
  workflow_id: string;
  task: string;
  status: string;
  context: string;
  notify_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Step {
  id: string;
  run_id: string;
  step_id: string;
  agent_id: string;
  step_index: number;
  input_template: string;
  expects: string;
  status: string;
  output: string | null;
  retry_count: number;
  max_retries: number;
  type?: string;
  loop_config?: string;
  current_story_id?: string;
  abandoned_count?: number;
  created_at: string;
  updated_at: string;
}

export interface RunWithSteps extends Run {
  steps: Step[];
}

export interface Story {
  id: string;
  run_id: string;
  story_index: number;
  story_id: string;
  title: string;
  description: string;
  acceptance_criteria: string;
  status: string;
  output: string | null;
  retry_count: number;
  max_retries: number;
  created_at: string;
  updated_at: string;
}

export interface AntfarmEvent {
  ts: string;
  event: string;
  runId: string;
  workflowId?: string;
  stepId?: string;
  agentId?: string;
  storyId?: string;
  storyTitle?: string;
  detail?: string;
}

export interface Workflow {
  id: string;
  name: string;
  steps: Array<{ id: string; agent: string }>;
}

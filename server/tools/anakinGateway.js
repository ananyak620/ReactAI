import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Anakin.ai Unified Multi-Model Gateway & Tool Worker Client
 * Endpoint: https://api.anakin.ai/v1/
 */
export class AnakinClient {
  constructor(apiKey = process.env.ANAKIN_API_KEY || '', appId = process.env.ANAKIN_APP_ID || '') {
    this.apiKey = apiKey;
    this.appId = appId;
    this.baseUrl = 'https://api.anakin.ai/v1';
  }

  /**
   * Universal LLM Generation via Anakin Multi-Model Hub
   * Routes prompt to Claude 3.7, GPT-4o, or Llama 3 via Anakin API
   */
  async generate({ prompt, model = 'claude-3-7-sonnet', temperature = 0.0 }) {
    if (!this.apiKey) {
      return {
        success: false,
        fallback: true,
        message: 'No ANAKIN_API_KEY configured. Using local LangGraph state engine fallback.'
      };
    }

    try {
      // Standard Anakin.ai QuickApp Run / Chat endpoint
      const targetUrl = this.appId 
        ? `${this.baseUrl}/quickapps/${this.appId}/runs`
        : `${this.baseUrl}/chat/completions`;

      const payload = this.appId ? {
        inputs: {
          prompt: prompt,
          model: model
        },
        stream: false
      } : {
        model: model,
        messages: [{ role: 'user', content: prompt }],
        temperature: temperature
      };

      const res = await axios.post(targetUrl, payload, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      });

      return {
        success: true,
        source: 'anakin_api_gateway',
        model: model,
        data: res.data
      };
    } catch (error) {
      console.warn('Anakin API call failed, falling back to local orchestrator:', error.message);
      return {
        success: false,
        error: error.message,
        fallback: true
      };
    }
  }

  /**
   * Pre-Built Web Search & Scrape Worker via Anakin App Endpoint
   */
  async runSearchWorker(query) {
    if (!this.apiKey || !this.appId) {
      return {
        success: false,
        fallback: true,
        message: 'Using local hybrid scraper'
      };
    }

    try {
      const res = await axios.post(`${this.baseUrl}/quickapps/${this.appId}/runs`, {
        inputs: { search_query: query },
        stream: false
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 12000
      });

      return {
        success: true,
        source: 'anakin_tool_worker',
        results: res.data
      };
    } catch (err) {
      return {
        success: false,
        fallback: true,
        error: err.message
      };
    }
  }
}

export const defaultAnakinClient = new AnakinClient();

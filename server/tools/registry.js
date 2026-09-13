import { readWebPage } from './webReader.js';
import { searchWeb } from './webSearch.js';
import { writeReportFile, readReportFile, listOutputFiles } from './fileTools.js';
import { calculateExpression } from './calculator.js';
import { searchFlights, executeReservation } from './bookingTools.js';

export const TOOL_DEFINITIONS = [
  {
    name: 'search_flights',
    description: 'Searches live airline routes and portal aggregators for flights matching origin, destination, date, and budget limits.',
    parameters: {
      type: 'object',
      properties: {
        origin: { type: 'string', description: 'Departure city (e.g. Bangalore, Delhi, Mumbai)' },
        destination: { type: 'string', description: 'Arrival city (e.g. Patna, Kolkata, Goa)' },
        date: { type: 'string', description: 'Travel date (e.g. 25th October, 2026-10-25)' },
        maxPrice: { type: 'number', description: 'Budget ceiling in INR (e.g. 6000)' }
      },
      required: ['origin', 'destination']
    }
  },
  {
    name: 'book_flight_reservation',
    description: 'Autonomously confirms and books a selected flight, generating a verifiable PNR code, itinerary voucher, and E-Ticket artifact without manual human clicking.',
    parameters: {
      type: 'object',
      properties: {
        flight: { type: 'object', description: 'The selected flight object from search_flights' },
        passengerName: { type: 'string', description: 'Passenger name (default Valued Traveler)' },
        travelDate: { type: 'string', description: 'Travel date' }
      },
      required: ['flight']
    }
  },
  {
    name: 'web_browser_read',
    description: 'Reads and parses a live web page given a URL. Extracts clean text, headings, metadata, and links, stripping scripts and advertisements.',
    parameters: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'The web page URL to fetch and read (e.g. https://example.com)' },
        maxLength: { type: 'number', description: 'Optional maximum character length to extract (default 4000)' }
      },
      required: ['url']
    }
  },
  {
    name: 'search_web',
    description: 'Searches the live web for articles, news, facts, and URLs matching a query.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'The search query to look up on the web' },
        maxResults: { type: 'number', description: 'Max search results to retrieve (default 5)' }
      },
      required: ['query']
    }
  },
  {
    name: 'file_writer',
    description: 'Generates and saves reports, markdown analyses, notes, or structured data artifacts into the workspace output directory.',
    parameters: {
      type: 'object',
      properties: {
        filename: { type: 'string', description: 'Target filename (e.g. ai_research_report.md)' },
        content: { type: 'string', description: 'The markdown, text, or json content to write' }
      },
      required: ['filename', 'content']
    }
  },
  {
    name: 'file_reader',
    description: 'Reads an existing artifact or document previously saved in the workspace.',
    parameters: {
      type: 'object',
      properties: {
        filename: { type: 'string', description: 'The filename to read' }
      },
      required: ['filename']
    }
  },
  {
    name: 'calculator_eval',
    description: 'Evaluates mathematical, numeric, and statistical computations.',
    parameters: {
      type: 'object',
      properties: {
        expression: { type: 'string', description: 'The mathematical expression to evaluate (e.g. 1045 * 1.15)' }
      },
      required: ['expression']
    }
  }
];

export async function executeTool(toolName, args = {}) {
  switch (toolName) {
    case 'search_flights':
      return await searchFlights(args);

    case 'book_flight_reservation':
      return await executeReservation(args);

    case 'web_browser_read':
      return await readWebPage(args.url, { maxLength: args.maxLength });

    case 'search_web':
      return await searchWeb(args.query, { maxResults: args.maxResults });

    case 'file_writer':
      return await writeReportFile(args.filename, args.content);

    case 'file_reader':
      return await readReportFile(args.filename);

    case 'calculator_eval':
      return calculateExpression(args.expression);

    default:
      return {
        success: false,
        error: `Unknown tool: ${toolName}. Available tools: ${TOOL_DEFINITIONS.map(t => t.name).join(', ')}`
      };
  }
}

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUTS_DIR = path.resolve(__dirname, '../../workspace_outputs');

// Ensure output directory exists
if (!fs.existsSync(OUTPUTS_DIR)) {
  fs.mkdirSync(OUTPUTS_DIR, { recursive: true });
}

/**
 * File Writer Tool
 * Allows the agent to react and take real actions by saving reports, documents,
 * and data artifacts to the workspace.
 */
export async function writeReportFile(filename, content) {
  if (!filename || !content) {
    return {
      success: false,
      error: 'Both filename and content are required.'
    };
  }

  try {
    // Sanitize filename
    const safeFilename = path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, '_');
    const targetPath = path.join(OUTPUTS_DIR, safeFilename);

    await fs.promises.writeFile(targetPath, content, 'utf8');
    const stats = await fs.promises.stat(targetPath);

    return {
      success: true,
      filename: safeFilename,
      fullPath: targetPath,
      sizeBytes: stats.size,
      updatedAt: stats.mtime,
      message: `Successfully generated and saved artifact file: ${safeFilename}`
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to write file: ${error.message}`
    };
  }
}

/**
 * File Reader Tool
 * Allows the agent to read existing files and output artifacts.
 */
export async function readReportFile(filename) {
  if (!filename) {
    return { success: false, error: 'Filename is required.' };
  }

  try {
    const safeFilename = path.basename(filename);
    const targetPath = path.join(OUTPUTS_DIR, safeFilename);

    if (!fs.existsSync(targetPath)) {
      return { success: false, error: `File not found: ${safeFilename}` };
    }

    const content = await fs.promises.readFile(targetPath, 'utf8');
    return {
      success: true,
      filename: safeFilename,
      content
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to read file: ${error.message}`
    };
  }
}

/**
 * List generated artifacts
 */
export async function listOutputFiles() {
  try {
    if (!fs.existsSync(OUTPUTS_DIR)) {
      return { success: true, files: [] };
    }

    const files = await fs.promises.readdir(OUTPUTS_DIR);
    const fileList = await Promise.all(
      files.map(async (name) => {
        const filePath = path.join(OUTPUTS_DIR, name);
        const stats = await fs.promises.stat(filePath);
        return {
          filename: name,
          sizeBytes: stats.size,
          modified: stats.mtime
        };
      })
    );

    return {
      success: true,
      files: fileList.sort((a, b) => b.modified - a.modified)
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to list artifacts: ${error.message}`
    };
  }
}

import { supabase } from '../keys/supabase';
import { generateRepoSummary } from './chain';

// Function to fetch README content from GitHub
async function getReadmeContent(repository, branch = 'main') {
  try {
    const [owner, repo] = repository.split('/');
    
    // First, try to get repository information to check if it exists
    const repoResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'GitHub-Summarizer-App'
        }
      }
    );

    if (!repoResponse.ok) {
      throw new Error(`Repository not found: ${repoResponse.status}`);
    }

    const repoData = await repoResponse.json();
    
    // Try to fetch README content from GitHub API
    const readmeResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme?ref=${branch}`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'GitHub-Summarizer-App'
        }
      }
    );

    if (!readmeResponse.ok) {
      // If README not found, return repository info instead
      return {
        title: repoData.name || 'Repository',
        description: repoData.description || 'No description available',
        content: `Repository: ${repoData.full_name}\nDescription: ${repoData.description || 'No description'}\nLanguage: ${repoData.language || 'Unknown'}\nStars: ${repoData.stargazers_count}\nForks: ${repoData.forks_count}`,
        fullContent: `Repository: ${repoData.full_name}\nDescription: ${repoData.description || 'No description'}\nLanguage: ${repoData.language || 'Unknown'}\nStars: ${repoData.stargazers_count}\nForks: ${repoData.forks_count}\nCreated: ${repoData.created_at}\nUpdated: ${repoData.updated_at}`,
        hasReadme: false,
        repositoryInfo: {
          name: repoData.name,
          fullName: repoData.full_name,
          description: repoData.description,
          language: repoData.language,
          stars: repoData.stargazers_count,
          forks: repoData.forks_count,
          createdAt: repoData.created_at,
          updatedAt: repoData.updated_at
        }
      };
    }

    const readmeData = await readmeResponse.json();
    
    // Decode base64 content
    const content = Buffer.from(readmeData.content, 'base64').toString('utf-8');
    
    // Extract title and description from README
    const lines = content.split('\n');
    let title = repoData.name || 'Repository';
    let description = repoData.description || 'No description available';
    
    // Try to extract title from first line if it's a heading
    if (lines[0] && lines[0].trim().startsWith('#')) {
      title = lines[0].replace(/^#+\s*/, '').trim();
    }
    
    // Get first paragraph as description if README has content
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line && !line.startsWith('#')) {
        description = line;
        break;
      }
    }

    return {
      title: title || 'Repository',
      description: description || 'No description available',
      content: content.substring(0, 500) + (content.length > 500 ? '...' : ''),
      fullContent: content,
      hasReadme: true,
      readmeFile: readmeData.name,
      repositoryInfo: {
        name: repoData.name,
        fullName: repoData.full_name,
        description: repoData.description,
        language: repoData.language,
        stars: repoData.stargazers_count,
        forks: repoData.forks_count
      }
    };
  } catch (error) {
    console.error('Error fetching repository content:', error);
    return {
      title: 'Error fetching repository',
      description: 'Could not fetch repository content',
      content: `Error: ${error.message}`,
      fullContent: `Error fetching repository ${repository}: ${error.message}`,
      hasReadme: false,
      error: error.message
    };
  }
}

export async function POST(req) {
  try {
    const key = req.headers.get('x-api-key') || req.headers.get('X-API-KEY');
    const requestData = await req.json();
    
    // Validate API key first
    if (!key) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'API key is required' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if the API key exists in the database
    const { data: keyData, error: keyError } = await supabase
      .from('api_keys')
      .select('id')
      .eq('key', key)
      .maybeSingle();

    if (keyError) {
      console.error('Database error:', keyError);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Database error' 
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // If key doesn't exist, return unauthorized
    if (!keyData) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Invalid API key' 
      }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // API key is valid, now process the GitHub summarizer request
    const { repository, branch = 'main', ...otherParams } = requestData;

    if (!repository) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Repository is required' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fetch README content
    const readmeData = await getReadmeContent(repository, branch);
    
    // Generate AI summary using LangChain
    const summaryResult = await generateRepoSummary(readmeData.fullContent);
    
    const summary = {
      repository,
      branch,
      summary: summaryResult.summary,
      cool_facts: summaryResult.cool_facts,
      readme_data: readmeData,
      timestamp: new Date().toISOString(),
      apiKeyUsed: key.substring(0, 5) + '...' // Show first 5 chars for security
    };

    return new Response(JSON.stringify({ 
      success: true, 
      data: summary 
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('GitHub summarizer error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Internal server error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}


export async function fetchGitHubAccessToken(
  code: string
): Promise<{ accessToken: string | null; error: string | null }> {
  const accessTokenParams = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code
  }).toString();
  const accessTokenUrl = `https://github.com/login/oauth/access_token?${accessTokenParams}`;

  try {
    const response = await fetch(accessTokenUrl, {
      method: "POST",
      headers: { Accept: "application/json" }
    });
    const data = await response.json();

    if (data.error) {
      console.error("Error fetching GitHub access token:", data.error);
      return { accessToken: null, error: data.error };
    }

    return { accessToken: data.access_token, error: null };
  } catch (error: any) {
    console.error(
      "An error occurred while fetching the GitHub access token:",
      error
    );
    return { accessToken: null, error: error.message };
  }
}

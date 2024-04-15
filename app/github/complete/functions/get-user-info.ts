export async function fetchGitHubUserProfileAndEmails(
  accessToken: string
): Promise<{
  login: string | null;
  id: string | null;
  avatar_url: string | null;
  emails: any;
  error: string | null;
}> {
  try {
    // 사용자 프로필 정보 가져오기
    const userProfileResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json"
      },
      cache: "no-cache"
    });
    if (!userProfileResponse.ok)
      throw new Error("Failed to fetch user profile.");

    const userProfile = await userProfileResponse.json();

    // 사용자 이메일 정보 가져오기
    const userEmailResponse = await fetch(
      "https://api.github.com/user/emails",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json"
        },
        cache: "no-cache"
      }
    );
    if (!userEmailResponse.ok) throw new Error("Failed to fetch user emails.");

    const userEmails = await userEmailResponse.json();

    return {
      login: userProfile.login,
      id: userProfile.id,
      avatar_url: userProfile.avatar_url,
      emails: userEmails,
      error: null
    };
  } catch (error: any) {
    console.error(
      "Error fetching GitHub user profile or emails:",
      error.message
    );
    return {
      login: null,
      id: null,
      avatar_url: null,
      emails: null,
      error: error.message
    };
  }
}

import { useState, useEffect } from "react";

const CLIENT_ID = "6ed45ea6867e468ab97168d75b56ee88"; //import.meta.env.VITE_SPOTIFY_CLIENT_ID
const REDIRECT_URI = https://grinard0071988.github.io/jamming-m/;
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

export function login() {
  const state = crypto.randomUUID();
  const codeVerifier = btoa(
    crypto.getRandomValues(new Uint8Array(64)).join("")
  );
  sessionStorage.setItem("verifier", codeVerifier);

  window.location = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=playlist-modify-private%20playlist-modify-public&code_challenge_method=plain&code_challenge=${codeVerifier}&state=${state}`;
}

export function logout() {
  sessionStorage.clear();
  window.location.reload();
}

export function useSpotifyAuth() {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) exchangeCodeForToken(code);
  }, []);

  async function exchangeCodeForToken(code) {
    const verifier = sessionStorage.getItem("verifier");
    try {
      const res = await fetch(TOKEN_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: REDIRECT_URI,
          client_id: CLIENT_ID,
          code_verifier: verifier,
        }),
      });
      const data = await res.json();
      setAccessToken(data.access_token);
      const profile = await spotifyFetch("/me", data.access_token);
      setUser(profile);
      window.history.replaceState({}, document.title, REDIRECT_URI);
    } catch (e) {
      setError("Auth failed");
    }
  }

  return { accessToken, user, error };
}

export async function spotifyFetch(endpoint, accessToken, opts = {}) {
  const res = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    },
  });
  return res.json();
}


import { apiRequest } from "./apiClient";

export function fetchMyTeams() {
  return apiRequest("get", "/api/challenges/teams/my/");
}

export function createChallengeTeam(challenge) {
  return apiRequest("post", "/api/challenges/teams/", { challenge });
}

export function inviteTeamMember(team, receiver) {
  return apiRequest("post", "/api/challenges/invites/", { team, receiver });
}

export function updateTeamMemberRole(team, member, role) {
  return apiRequest(
    "patch",
    `/api/challenges/teams/${team}/members/${member}/role/`,
    { role },
  );
}

export function acceptChallengeInvite(invite) {
  return apiRequest("post", `/api/challenges/invites/${invite}/accept/`);
}

export function removeTeamMember(team, member) {
  return apiRequest(
    "delete",
    `/api/challenges/teams/${team}/members/${member}/remove/`,
  );
}

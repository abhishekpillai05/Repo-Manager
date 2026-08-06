import { ParsedRepository } from "../interfaces/parser-repository.interface";

export function parseRepositoryName(
  repositoryName: string,
  repositoryPrefix: string,
): ParsedRepository | null {
  // Step 1: Validate prefix
  // Step 2: Remove prefix
  // Step 3: Split remaining name
  // Step 4: Validate structure
  // Step 5: Extract role
  // Step 6: Extract candidate name
  // Step 7: Return parsed object

  // Repository must start with configured prefix
  if (!repositoryName.startsWith(repositoryPrefix)) {
    return null;
  }

  // Remove prefix
  const remaining = repositoryName.slice(repositoryPrefix.length);

  const parts = remaining.split("-");

  // Must contain at least:
  // role + candidate name
  if (parts.length < 2) {
    return null;
  }

  const candidateRole = parts[0];

  const candidateName = parts.slice(1).join("-");

  if (candidateRole.trim() === "" || candidateName.trim() === "") {
    return null;
  }

  return {
    repositoryName,
    candidateRole,
    candidateName,
  };
}

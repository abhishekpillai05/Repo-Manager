/**
 * Generic response returned after
 * repository operations such as:
 *
 * - archive
 * - delete
 * - collaborator removal
 *
 * Can be reused across multiple endpoints.
 */
export class OperationResponseDto {
  success!: boolean;

  message!: string;
}

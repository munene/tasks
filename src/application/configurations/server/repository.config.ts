import { IRepository } from "../../interfaces/persistence/repository.interface";
import { InMemoryRepository } from "../../../persistence/In Memory Repository/repository";

/**
 * Initialize and return the repository to be used.
 * Call this when starting the server
 * @returns Promise: The actual repository that we will inject everywhere else
 */
export const initializeRepository = async (): Promise<IRepository> => {
  return new Promise((resolve) => {
    resolve(new InMemoryRepository())
  });
}
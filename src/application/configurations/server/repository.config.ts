import { IRepository } from "../../interfaces/persistence/repository.interface";
import { InMemoryRepository } from "../../../persistence/In Memory Repository/repository";

export const initializeRepository = async (): Promise<IRepository> => {
  return new Promise((resolve) => {
    resolve(new InMemoryRepository())
  });
}
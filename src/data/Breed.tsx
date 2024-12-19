import { Dog } from "./Dog";

export type Breed = {
    name: string;
    id: number;
    dogs: Dog[];
};
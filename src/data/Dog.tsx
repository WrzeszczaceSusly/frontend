import { Breed } from "./Breed";

export type Dog = {
    id: number;
    name: string;
    breedName: string;
    image: string;
    age: number;
    sex: string;
    size: string;
    weight: number;

    // Nowe pola:
    description: string;
    color: string;
    vaccinated: boolean;
    sterilized: boolean;
    microchipped: boolean;
    friendlyWithKids: boolean;
    friendlyWithAnimals: boolean;
};
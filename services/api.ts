import axios from 'axios';

export interface Character {
  hogwartsStudent: any;
  hogwartsStaff: any;
  id: string;
  name: string;
  house: string;
  image: string;
  actor: string;
  species: string;
  dateOfBirth: string | null;
  ancestry: string;
  patronus: string;
  alive: boolean;
  gender: string;
}

export interface Spell {
  id: string;
  name: string;
  description: string;
}

export interface House {
  name: string;
  founder: string;
  houseColours: string;
  values: string;
  animal: string;
}

const api = axios.create({
  baseURL: 'https://hp-api.onrender.com/api',
});

export const getCharacters = async (): Promise<Character[]> => {
  const { data } = await api.get<Character[]>('/characters');
  return data;
};

export const getSpells = async (): Promise<Spell[]> => {
  const { data } = await api.get<Spell[]>('/spells');
  return data;
};

export const getHouses = async (): Promise<House[]> => {
  const { data } = await api.get<House[]>('/houses');
  return data;
};
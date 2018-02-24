import {assoc} from 'ramda';
import {baseUrl} from 'variants/variant';

export type MainState = {
    name: string;
    offsetTop: number;
    baseUrl: string;
};

export type MainStateAction = (state: MainState) => MainStateAction;

export const initialMainState: MainState = {
    name: '',
    offsetTop: 0,
    baseUrl: baseUrl
};

export function makeUpdateNameAction(name: string): MainStateAction {
    return assoc('name', name);
}

export function makeUpdateOffsetTopAction(val: number): MainStateAction {
    return assoc('scroll', val);
}

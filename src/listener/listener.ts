import { Event } from "../util/clientEvents";
import { Module } from "..";

export default interface Listener {
    event: Event;
    id: string;
    module: Module;
    func: Function;
    wrapperFunc?: (...args: any[]) => void;
}

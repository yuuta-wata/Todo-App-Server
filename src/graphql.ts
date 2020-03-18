
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export interface CreateTodoInput {
    title: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface RegisterInput {
    userName: string;
    email: string;
    password: string;
}

export interface IMutation {
    createTodo(input: CreateTodoInput): Todo | Promise<Todo>;
    deleteTodo(id: string): boolean | Promise<boolean>;
    register(registerInput: RegisterInput): boolean | Promise<boolean>;
    login(loginInput: LoginInput): boolean | Promise<boolean>;
}

export interface IQuery {
    getTodoList(): Todo[] | Promise<Todo[]>;
    getUsers(): User[] | Promise<User[]>;
    bye(): string | Promise<string>;
}

export interface Todo {
    id: string;
    title: string;
}

export interface User {
    id: string;
    userName: string;
    email: string;
    todo?: Todo[];
}

import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { AppState } from './types';

const DB_NAME = 'digilocker_db_v1';
const STORE_NAME = 'app_state';
const KEY = 'current_state';

interface MyDB extends DBSchema {
    [STORE_NAME]: {
        key: string;
        value: AppState;
    };
}

let dbPromise: Promise<IDBPDatabase<MyDB>> | null = null;

const getDB = () => {
    if (!dbPromise) {
        dbPromise = openDB<MyDB>(DB_NAME, 1, {
            upgrade(db) {
                db.createObjectStore(STORE_NAME);
            },
        });
    }
    return dbPromise;
};

export const saveStateToDB = async (state: AppState) => {
    const db = await getDB();
    await db.put(STORE_NAME, state, KEY);
};

export const loadStateFromDB = async (): Promise<AppState | undefined> => {
    const db = await getDB();
    return await db.get(STORE_NAME, KEY);
};

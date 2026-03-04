import { createStore, Store } from "tinybase";
import {
  createExpoSqlitePersister,
  ExpoSqlitePersister,
} from "tinybase/persisters/persister-expo-sqlite";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("database.db");

const store: Store = createStore();

const USERS_TABLE = "usersRoleta";
const PRIZES_TABLE = "prizes";
const SETTINGS_PAGE = "@settings-roullete-app-act";

const persister: ExpoSqlitePersister = createExpoSqlitePersister(store, db);

let isStoreInitialized = false;
let initializationPromise: Promise<void> | null = null;

const initializeStore = async () => {
  // ✅ Evita múltiplas inicializações simultâneas
  if (initializationPromise) {
    console.log("Store está sendo inicializada, aguardando...");
    return initializationPromise;
  }

  if (isStoreInitialized) {
    console.log("Store já inicializada.");
    return Promise.resolve();
  }

  initializationPromise = (async () => {
    try {
      console.log("🔄 Iniciando carregamento da store do SQLite...");

      // ✅ Carrega dados do SQLite
      await persister.load();

      console.log("✅ Dados carregados do SQLite");

      // ✅ Cria tabelas se não existirem
      if (!store.hasTable(USERS_TABLE)) {
        store.setTable(USERS_TABLE, {});
        console.log(`Tabela ${USERS_TABLE} criada`);
      }
      if (!store.hasTable(PRIZES_TABLE)) {
        store.setTable(PRIZES_TABLE, {});
        console.log(`Tabela ${PRIZES_TABLE} criada`);
      }
      if (!store.hasTable(SETTINGS_PAGE)) {
        store.setTable(SETTINGS_PAGE, {});
        console.log(`Tabela ${SETTINGS_PAGE} criada`);
      }

      // ✅ Inicia auto-save
      await persister.startAutoSave();

      isStoreInitialized = true;
      console.log("✅ Store inicializada com sucesso!");
    } catch (error) {
      console.error("❌ Erro Crítico ao inicializar a store:", error);
      isStoreInitialized = false;
      initializationPromise = null;
      throw error;
    }
  })();

  return initializationPromise;
};

// ✅ Função auxiliar para garantir que a store está pronta
const ensureStoreInitialized = async () => {
  if (!isStoreInitialized) {
    await initializeStore();
  }
};

const clearTable = async (tableName: string) => {
  await ensureStoreInitialized();
  store.delTable(tableName);
  console.log(`Tabela ${tableName} limpa. Autosave deve persistir.`);
};

const updateRow = async (tableName: string, rowId: string, newData: any) => {
  await ensureStoreInitialized();

  const currentRow = store.getRow(tableName, rowId);
  if (!currentRow) {
    console.warn(`Linha com ID ${rowId} não encontrada na tabela ${tableName}`);
    return;
  }
  store.setRow(tableName, rowId, { ...currentRow, ...newData });
  console.log(`✅ Linha ${rowId} atualizada na tabela ${tableName}`);
};

// ✅ NOVO: Função segura para obter tabela
const getTableSafe = async (tableName: string) => {
  await ensureStoreInitialized();
  return store.getTable(tableName);
};

// ✅ NOVO: Função segura para adicionar linha
const addRowSafe = async (tableName: string, data: any) => {
  await ensureStoreInitialized();
  return store.addRow(tableName, data);
};

export {
  store,
  USERS_TABLE,
  PRIZES_TABLE,
  SETTINGS_PAGE,
  initializeStore,
  persister,
  clearTable,
  isStoreInitialized,
  updateRow,
  ensureStoreInitialized,
  getTableSafe,
  addRowSafe,
};

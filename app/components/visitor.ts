"use client";

import { useSyncExternalStore } from "react";

export const ASK_NAME_EVENT = "mango:ask-name";

const KEY = "mango-visitor-name";

/**
 * 稱呼存在 localStorage，下次進站直接顯示、不再詢問。
 * 「先跳過」只記在這次瀏覽的記憶體：沒有留下稱呼，下次進站會再問一次。
 * localStorage 被封鎖時（無痛模式等）退回記憶體，至少本次瀏覽可用。
 */
type State = { name: string; decided: boolean };

let memoryName = "";
let skipped = false;
let cache: State | null = null;
const listeners = new Set<() => void>();

function readName(): string {
  try {
    return localStorage.getItem(KEY) ?? memoryName;
  } catch {
    return memoryName;
  }
}

/** useSyncExternalStore 要求內容沒變時回傳同一個物件 */
function getSnapshot(): State {
  const name = readName();
  const decided = !!name || skipped;
  if (!cache || cache.name !== name || cache.decided !== decided) {
    cache = { name, decided };
  }
  return cache;
}

function notify() {
  listeners.forEach((cb) => cb());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  // 別的分頁改了稱呼時同步
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

export function saveName(name: string) {
  memoryName = name;
  skipped = false;
  try {
    localStorage.setItem(KEY, name);
  } catch {
    /* 無法寫入時只保留在記憶體 */
  }
  notify();
}

/** 使用者選擇跳過：本次瀏覽不再詢問，但不會留下任何資料 */
export function skipName() {
  skipped = true;
  notify();
}

export function askNameAgain() {
  window.dispatchEvent(new Event(ASK_NAME_EVENT));
}

/**
 * ready 為 false 代表還在伺服器端／尚未 hydration，
 * 此時不要顯示任何依稱呼而定的內容，避免畫面閃動。
 */
export function useVisitor(): { ready: boolean; name: string; decided: boolean } {
  const current = useSyncExternalStore(subscribe, getSnapshot, () => null);
  if (current === null) return { ready: false, name: "", decided: false };
  return { ready: true, ...current };
}

// @flow

const FB_MODULE_RE = /^(.*) \[from (.*)\]$/;
const cachedDisplayNames: WeakMap<Function, string> = new WeakMap();

export function getDisplayName(
  type: Function,
  fallbackName: string = 'Unknown'
): string {
  const nameFromCache = cachedDisplayNames.get(type);
  if (nameFromCache != null) {
    return nameFromCache;
  }

  let displayName;

  // The displayName property is not guaranteed to be a string.
  // It's only safe to use for our purposes if it's a string.
  // github.com/facebook/react-devtools/issues/803
  if (typeof type.displayName === 'string') {
    displayName = type.displayName;
  }

  if (!displayName) {
    displayName = type.name || fallbackName;
  }

  // Facebook-specific hack to turn "Image [from Image.react]" into just "Image".
  // We need displayName with module name for error reports but it clutters the DevTools.
  const match = displayName.match(FB_MODULE_RE);
  if (match) {
    const componentName = match[1];
    const moduleName = match[2];
    if (componentName && moduleName) {
      if (
        moduleName === componentName ||
        moduleName.startsWith(componentName + '.')
      ) {
        displayName = componentName;
      }
    }
  }

  cachedDisplayNames.set(type, displayName);
  return displayName;
}

let uidCounter: number = 0;

export function getUID(): number {
  return ++uidCounter;
}

export function utfDecodeString(array: Uint8Array): string {
  let string = '';
  const { length } = array;
  for (let i = 0; i < length; i++) {
    string += String.fromCharCode(array[i]);
  }
  return string;
}

export function utfEncodeString(string: string): Uint8Array {
  const array = new Uint8Array(string.length);
  const { length } = string;
  for (let i = 0; i < length; i++) {
    array[i] = string.charCodeAt(i);
  }
  return array;
}
